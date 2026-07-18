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

    /** @return array{content: string, generated_at: string}|null */
    public function latestTaskSuggestion(int $taskId): ?array
    {
        $suggestion = Cache::get($this->taskSuggestionKey($taskId));

        return is_array($suggestion) ? $suggestion : null;
    }

    public function hasCurrentTaskSuggestion(KvRetailTask $task): bool
    {
        $suggestion = $this->latestTaskSuggestion((int) $task->id);

        return $suggestion !== null
            && hash_equals(
                (string) Cache::get($this->taskSuggestionHashKey((int) $task->id), ''),
                $this->sourceHash($this->taskSuggestionData($task)),
            );
    }

    /**
     * Generates recommendations for one task after its persisted data changes.
     * The source hash prevents repeated Groq requests for unchanged task data.
     */
    public function generateTaskSuggestionIfChanged(KvRetailTask $task): bool
    {
        $data = $this->taskSuggestionData($task);
        $sourceHash = $this->sourceHash($data);
        $lock = Cache::lock("kv-retail:creative-agent:task:{$task->id}:lock", 120);

        if (! $lock->get()) {
            return false;
        }

        try {
            if (hash_equals((string) Cache::get($this->taskSuggestionHashKey((int) $task->id), ''), $sourceHash)) {
                return false;
            }

            $suggestion = [
                'content' => $this->groqService->generateResponse($this->taskSuggestionPrompt($data)),
                'generated_at' => now()->toIso8601String(),
            ];

            Cache::put($this->taskSuggestionKey((int) $task->id), $suggestion, now()->addDays(31));
            Cache::put($this->taskSuggestionHashKey((int) $task->id), $sourceHash, now()->addDays(31));

            return true;
        } finally {
            $lock->release();
        }
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
            'dalam_proses' => $tasks->filter(fn (KvRetailTask $task) => $task->status !== 'Done')->count(),
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

    /** @return array<string, mixed> */
    private function taskSuggestionData(KvRetailTask $task): array
    {
        $evaluation = $task->timing_evaluation;
        $timestamps = $task->task_timestamps ?? [];
        $stages = ['ACC Draft' => 'ACC Draft', 'Progress Design' => 'Progress', 'Approval Design' => 'Approve', 'Kirim Email' => 'Email'];
        $activeStage = collect($stages)->first(fn (string $timestamp) => blank($timestamps[$timestamp] ?? null));

        return [
            'status' => $task->status,
            'deadline' => optional($task->deadline_date)->toDateString(),
            'deadline_terlewati' => (bool) data_get($evaluation, 'late'),
            'bottleneck' => (bool) data_get($evaluation, 'bottleneck'),
            'tahap_aktif' => $activeStage ?: 'Selesai',
            'tahap_selesai' => collect($stages)
                ->filter(fn (string $timestamp) => filled($timestamps[$timestamp] ?? null))
                ->keys()
                ->values()
                ->all(),
            'pelanggaran_tahap' => collect(data_get($evaluation, 'violations', []))
                ->filter(fn (mixed $violation) => (bool) data_get($violation, 'late'))
                ->keys()
                ->values()
                ->all(),
        ];
    }

    /** @param array<string, mixed> $data */
    private function taskSuggestionPrompt(array $data): string
    {
        $json = json_encode($data, JSON_UNESCAPED_UNICODE) ?: '{}';

        return <<<PROMPT
KV Retail, Bahasa Indonesia. Data ringkas satu task: {$json}
Berikan tepat 3 saran tindakan yang singkat dan spesifik hanya untuk task ini. Tulis HANYA tiga bullet Markdown dengan awalan "- ". Maksimal 16 kata tiap bullet. Jangan menyebut orang, tim, reviewer, pembagian kerja, rapat, reminder, evaluasi performa, atau data/proses berpikir. Jangan menambah judul, ringkasan, penomoran, atau Markdown lain. Terlambat berarti Kirim Email melewati deadline; bottleneck hanya tahap ACC Draft, Progress Design, Approval Design.
PROMPT;
    }

    private function taskSuggestionKey(int $taskId): string
    {
        return "kv-retail:creative-agent:task:{$taskId}";
    }

    private function taskSuggestionHashKey(int $taskId): string
    {
        return "kv-retail:creative-agent:task:{$taskId}:source-hash";
    }


    /** @param array<string, mixed> $reportData */
    private function prompt(array $reportData): string
    {
        $reportJson = json_encode($reportData, JSON_UNESCAPED_UNICODE) ?: '{}';

        return <<<PROMPT
KV Retail, Bahasa Indonesia. Data ringkas: {$reportJson}
Berikan HANYA rekomendasi tindakan dalam Markdown: mulai dengan ## Rekomendasi Terkini, lalu tepat 3 bullet. Setiap bullet hanya boleh membahas kumpulan task berdasarkan status, deadline, atau tahap proses saat ini; sertakan angka yang relevan bila tersedia. Gunakan gaya seperti: "Tuntaskan 2 task terlambat ...", "Dorong 4 task di ACC Draft ...", atau "Pantau 5 task dalam proses ...". DILARANG menyarankan tindakan terhadap orang atau tim, termasuk anggota, staf, sumber daya, reviewer, pembagian beban kerja, rapat, reminder, atau evaluasi performa orang. Jangan menulis ringkasan, temuan, prioritas, angka yang berdiri sendiri, JSON, atau proses berpikir. Terlambat = Kirim Email melewati deadline. Bottleneck hanya ACC Draft, Progress Design, Approval Design.
PROMPT;
    }
}
