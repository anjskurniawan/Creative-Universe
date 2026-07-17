<?php

namespace App\SubApps\KvRetail\Models;

use App\SubApps\KvRetail\Jobs\GenerateKvRetailCreativeAgentReport;
use Illuminate\Database\Eloquent\Relations\Pivot;

class KvRetailTaskUser extends Pivot
{
    protected $table = 'kv_retail_task_user';

    protected static function booted(): void
    {
        $queueCreativeAgent = static function (): void {
            if (! app()->environment('testing')) {
                GenerateKvRetailCreativeAgentReport::dispatch();
            }
        };

        static::created($queueCreativeAgent);
        static::updated($queueCreativeAgent);
        static::deleted($queueCreativeAgent);
    }
}
