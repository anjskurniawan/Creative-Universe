<?php

namespace Tests\Feature\Core;

use App\Models\Core\User;
use App\SubApps\Odds\Contracts\OddsTaskReader;
use App\SubApps\Odds\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OddsPublicContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_core_can_read_an_odds_summary_without_receiving_the_domain_model(): void
    {
        $requester = User::factory()->create();
        $task = Task::create([
            'task_number' => 'ODDS-CONTRACT-001',
            'category_snapshot' => ['name' => 'Design'],
            'requester_id' => $requester->id,
            'design_purpose' => 'Contract verification',
            'brief_text' => 'Verify the public boundary.',
            'deadline' => now()->addDay(),
            'status' => 'submitted',
        ]);

        $summary = app(OddsTaskReader::class)->findSummary($task->id);

        $this->assertNotNull($summary);
        $this->assertSame($task->id, $summary->id);
        $this->assertSame('submitted', $summary->status);
        $this->assertNotInstanceOf(Task::class, $summary);
    }
}
