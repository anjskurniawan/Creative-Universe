<?php

namespace App\SubApps\KvRetail\Services;

use App\SubApps\KvRetail\Models\KvRetailTask;
use Carbon\Carbon;

class KvRetailTaskTimingService
{
    /** @var array<string, string> */
    private const TRANSITION_REASON_STAGE = [
        'Progress Design' => 'ACC Draft',
        'Approval Design' => 'Progress Design',
        'Kirim Email' => 'Approval Design',
    ];

    /**
     * @return array{bottleneck: bool, late: bool, violations: array<string, array{label: string, late: bool}>}
     */
    public function evaluate(KvRetailTask $task): array
    {
        $timestamps = $task->task_timestamps ?? [];
        $violations = [
            'ACC Draft' => [
                'label' => 'ACC Draft',
                'late' => $this->isMoreThanDays($task->task_given_date, $timestamps['ACC Draft'] ?? null, 1),
            ],
            'Progress Design' => [
                'label' => 'Progress Design',
                'late' => $this->isMoreThanDays($timestamps['ACC Draft'] ?? null, $timestamps['Progress'] ?? null, 1),
            ],
            'Approval Design' => [
                'label' => 'Approval Design',
                'late' => $this->isAtLeastDays($timestamps['Progress'] ?? null, $timestamps['Approve'] ?? null, 2),
            ],
            'Kirim Email' => [
                'label' => 'Kirim Email',
                'late' => $this->isEmailAfterOrOnDeadline($timestamps['Email'] ?? null, $task->deadline_date),
            ],
        ];

        $hasBottleneck = collect($violations)
            ->except('Kirim Email')
            ->contains(fn (array $violation) => $violation['late']);
        // If the email exists, its timestamp is the source of truth. Otherwise,
        // an unfinished task becomes late as soon as its deadline has passed.
        $isLate = isset($timestamps['Email']) && $timestamps['Email']
            ? $this->isAfterDeadline($timestamps['Email'], $task->deadline_date)
            : $this->isDeadlinePassed($task->deadline_date);

        return [
            'bottleneck' => $hasBottleneck,
            'late' => $isLate,
            'violations' => $violations,
        ];
    }

    public function requiredReasonStage(KvRetailTask $task, string $nextStatus): ?string
    {
        $stage = self::TRANSITION_REASON_STAGE[$nextStatus] ?? null;
        if (! $stage) {
            return null;
        }

        return data_get($this->evaluate($task), "violations.{$stage}.late") ? $stage : null;
    }

    private function isMoreThanDays(mixed $start, mixed $end, int $days): bool
    {
        $startAt = $this->parseDate($start);
        $endAt = $this->parseDate($end);

        return $startAt && $endAt && $endAt->greaterThan($startAt->copy()->addDays($days));
    }

    private function isAtLeastDays(mixed $start, mixed $end, int $days): bool
    {
        $startAt = $this->parseDate($start);
        $endAt = $this->parseDate($end);

        return $startAt && $endAt && $endAt->greaterThanOrEqualTo($startAt->copy()->addDays($days));
    }

    private function isEmailAfterOrOnDeadline(mixed $emailTimestamp, mixed $deadline): bool
    {
        $emailAt = $this->parseDate($emailTimestamp);
        $deadlineAt = $this->parseDate($deadline);

        return $emailAt && $deadlineAt && $emailAt->startOfDay()->greaterThan($deadlineAt->startOfDay());
    }

    private function isAfterDeadline(mixed $completedTimestamp, mixed $deadline): bool
    {
        $completedAt = $this->parseDate($completedTimestamp);
        $deadlineAt = $this->parseDate($deadline);

        return $completedAt && $deadlineAt && $completedAt->startOfDay()->greaterThan($deadlineAt->startOfDay());
    }

    private function isDeadlinePassed(mixed $deadline): bool
    {
        $deadlineAt = $this->parseDate($deadline);

        return $deadlineAt && now()->startOfDay()->greaterThan($deadlineAt->startOfDay());
    }

    private function parseDate(mixed $value): ?Carbon
    {
        if (! $value) {
            return null;
        }

        if ($value instanceof Carbon) {
            return $value->copy();
        }

        try {
            if (is_string($value) && preg_match('/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/', $value)) {
                return Carbon::createFromFormat('d/m/Y H:i', $value);
            }

            return Carbon::parse($value);
        } catch (\Throwable) {
            return null;
        }
    }
}
