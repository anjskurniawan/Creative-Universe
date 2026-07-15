<?php

namespace App\SubApps\CreativeReport\Models;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assessment extends Model
{
    protected $table = 'creative_report_assessments';

    public const STATUS_DRAFT = 'draft';

    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'creative_report_group_id', 'user_id', 'period', 'creative_scores',
        'leave_count', 'absence_count', 'late_count', 'status', 'completed_at', 'completed_by',
    ];

    protected function casts(): array
    {
        return ['period' => 'date', 'creative_scores' => 'array', 'completed_at' => 'datetime'];
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(ReportGroup::class, 'creative_report_group_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function score30(): int
    {
        return array_sum(array_slice($this->creative_scores ?? [], 0, 5));
    }

    public function score50(): int
    {
        return array_sum(array_slice($this->creative_scores ?? [], 5, 5));
    }

    public function hrdScore(): int
    {
        $late = $this->late_count >= 2 ? 2 : ($this->late_count === 1 ? 1 : 0);
        $absence = $this->absence_count >= 2 ? 5 : ($this->absence_count === 1 ? 3 : 0);

        return max(0, 20 - $late - $absence);
    }

    public function finalScore(): int
    {
        return $this->score30() + $this->score50() + $this->hrdScore();
    }
}
