<?php

namespace App\SubApps\KvRetail\Services;

use App\SubApps\Cai\Services\GroqService;
use App\SubApps\KvRetail\Models\KvRetailTask;
use Illuminate\Support\Facades\Cache;

class KvRetailCreativeAgentService
{
    private const CACHE_KEY = 'kv-retail:creative-agent:current';

    private const SOURCE_HASH_KEY = 'kv-retail:creative-agent:source-hash';

    private const GENERATION_LOCK_KEY = 'kv-retail:creative-agent:generation-lock';

    private const BOTTLENECK_STAGES = ['ACC Draft', 'Progress Design', 'Approval Design'];

    public function __construct(private readonly GroqService $groqService) {}

    /** @return array{content: string, generated_at: string} */
    public function generateAndStore(): array
    {
        return $this->generate($this->reportData());
    }

    /**
     * Generates a report only when the aggregated KV Retail data changed.
     */
    public function generateAndStoreIfChanged(): bool
    {
        $reportData = $this->reportData();
        $sourceHash = $this->sourceHash($reportData);
        $lock = Cache::lock(self::GENERATION_LOCK_KEY, 120);

        if (! $lock->get()) {
            return false;
        }

        try {
            if (hash_equals((string) Cache::get(self::SOURCE_HASH_KEY, ''), $sourceHash)) {
                return false;
            }

            $this->generate($reportData, $sourceHash);

            return true;
        } finally {
            $lock->release();
        }
    }

    /** @return array{content: string, generated_at: string}|null */
    public function latest(): ?array
    {
        $report = Cache::get(self::CACHE_KEY);

        return is_array($report) ? $report : null;
    }

    private function reportData(): array
    {
        $tasks = KvRetailTask::query()
            ->whereBetween('task_given_date', [now()->startOfMonth(), now()->endOfMonth()])
            ->orderBy('task_given_date')
            ->get();

        $summaries = $tasks->map(function (KvRetailTask $task): array {
            $evaluation = $task->timing_evaluation;
            $bottleneckStages = collect(self::BOTTLENECK_STAGES)
                ->filter(fn (string $stage) => data_get($evaluation, "violations.{$stage}.late"))
                ->values()
                ->all();

            return [
                'task' => $task,
                'is_late' => (bool) data_get($evaluation, 'late'),
                'bottleneck_stages' => $bottleneckStages,
            ];
        });

        $priorityTasks = $summaries
            ->filter(fn (array $summary) => $summary['is_late'] || $summary['bottleneck_stages'] !== [] || $summary['task']->status !== 'Done')
            ->sortByDesc(fn (array $summary) => $summary['is_late'] || $summary['bottleneck_stages'] !== [])
            ->take(3)
            ->map(fn (array $summary) => [
                'name' => mb_strimwidth((string) $summary['task']->task_name, 0, 48, '…'),
                'issue' => $summary['is_late']
                    ? 'terlambat'
                    : ($summary['bottleneck_stages'] !== []
                        ? 'bottleneck '.implode(', ', $summary['bottleneck_stages'])
                        : 'dalam proses'),
            ])
            ->values();

        $reportData = [
            'periode' => now()->translatedFormat('F Y'),
            'total_task' => $tasks->count(),
            'selesai' => $tasks->where('status', 'Done')->count(),
            'tepat_waktu' => $summaries->filter(fn (array $summary) => $summary['task']->status === 'Done' && ! $summary['is_late'])->count(),
            'terlambat' => $summaries->where('is_late', true)->count(),
            'dalam_proses' => $tasks->filter(fn (KvRetailTask $task) => ! in_array($task->status, ['0', 'Done'], true))->count(),
            'bottleneck_per_tahap' => collect(self::BOTTLENECK_STAGES)->mapWithKeys(fn (string $stage) => [
                $stage => $summaries->filter(fn (array $summary) => in_array($stage, $summary['bottleneck_stages'], true))->count(),
            ])->all(),
            'task_prioritas' => $priorityTasks,
        ];
        return $reportData;
    }

    /** @param array<string, mixed> $reportData */
    private function generate(array $reportData, ?string $sourceHash = null): array
    {
        $report = [
            'content' => $this->groqService->generateResponse($this->prompt($reportData)),
            'generated_at' => now()->toIso8601String(),
        ];

        Cache::put(self::CACHE_KEY, $report, now()->addDays(31));
        Cache::put(self::SOURCE_HASH_KEY, $sourceHash ?? $this->sourceHash($reportData), now()->addDays(31));

        return $report;
    }

    /** @param array<string, mixed> $reportData */
    private function sourceHash(array $reportData): string
    {
        return hash('sha256', json_encode($reportData, JSON_UNESCAPED_UNICODE) ?: '{}');
    }

    /** @param array<string, mixed> $reportData */
    private function prompt(array $reportData): string
    {
        $reportJson = json_encode($reportData, JSON_UNESCAPED_UNICODE) ?: '{}';

        return <<<PROMPT
KV Retail, Bahasa Indonesia. Data ringkas: {$reportJson}
Berikan HANYA rekomendasi tindakan dalam Markdown: mulai dengan ## Rekomendasi Bulan Ini, lalu tepat 3 bullet. Setiap bullet hanya boleh membahas kumpulan task berdasarkan status, deadline, atau tahap proses bulan ini; sertakan angka yang relevan bila tersedia. Gunakan gaya seperti: "Tuntaskan 2 task terlambat ...", "Dorong 4 task di ACC Draft ...", atau "Pantau 5 task dalam proses ...". DILARANG menyarankan tindakan terhadap orang atau tim, termasuk anggota, staf, sumber daya, reviewer, pembagian beban kerja, rapat, reminder, atau evaluasi performa orang. Jangan menulis ringkasan, temuan, prioritas, angka yang berdiri sendiri, JSON, atau proses berpikir. Terlambat = Kirim Email melewati deadline. Bottleneck hanya ACC Draft, Progress Design, Approval Design.
PROMPT;
    }
}
