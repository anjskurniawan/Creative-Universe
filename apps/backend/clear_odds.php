<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\SubApps\Odds\Models\Task;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "Mereset data tabel ODDS...\n";

Schema::disableForeignKeyConstraints();

$tables = [
    'odds_time_logs',
    'odds_skip_requests',
    'odds_cancel_requests',
    'odds_task_revisions',
    'odds_task_reviews',
    'odds_task_results',
    'odds_task_queues',
    'odds_task_briefs',
    'odds_tasks',
    'odds_conversations',
    'odds_messages',
];

foreach ($tables as $table) {
    if (Schema::hasTable($table)) {
        DB::table($table)->truncate();
        echo "Tabel {$table} telah dikosongkan.\n";
    }
}

Schema::enableForeignKeyConstraints();

echo "Semua data task ODDS berhasil di-drop!\n";
