<?php

namespace App\SubApps\CreativeReport\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReportGroup extends Model
{
    protected $table = 'creative_report_groups';

    protected $fillable = ['name', 'sort_order'];

    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class);
    }
}
