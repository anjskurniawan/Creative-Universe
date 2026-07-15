<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;

require dirname(__DIR__).'/vendor/autoload.php';

$app = require dirname(__DIR__).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

[$script, $database, $output, $sourceKey, $sourceSql] = array_pad($argv, 5, null);

if (! is_string($database) || ! preg_match('/^[A-Za-z0-9_]+$/', $database)
    || ! is_string($output) || $output === ''
    || ! is_string($sourceKey) || ! preg_match('/^[A-Za-z0-9._-]+$/', $sourceKey)) {
    fwrite(STDERR, "Usage: php {$script} <database> <output.json> <source-key> [source.sql]\n");
    exit(1);
}

$connection = config('database.connections.mysql');
$connection['database'] = $database;
config(['database.connections.legacy_hosting_export' => $connection]);
$db = DB::connection('legacy_hosting_export');

$defaultUsernames = [
    'root',
    'manajer',
    'ceo',
    'spv',
    'designer',
    'videographer',
    'client',
    'leaderretail',
    'picretail',
];

$users = $db->table('users as users')
    ->leftJoin('divisions', 'divisions.id', '=', 'users.division_id')
    ->leftJoin('positions', 'positions.id', '=', 'users.position_id')
    ->whereNotIn('users.username', $defaultUsernames)
    ->orderBy('users.id')
    ->get([
        'users.id as legacy_id',
        'users.name',
        'users.username',
        'users.email',
        'users.whatsapp_number',
        'users.password as password_hash',
        'users.is_onboarded',
        'divisions.name as division_name',
        'positions.name as position_name',
        'users.avatar_path',
        'users.settings',
        'users.deleted_at',
        'users.created_at',
        'users.updated_at',
    ]);

$realUserIds = $users->pluck('legacy_id')->map(fn ($id) => (int) $id)->all();
$realUserIdLookup = array_fill_keys($realUserIds, true);
$rolesByUserId = $db->table('model_has_roles as assignment')
    ->join('roles', 'roles.id', '=', 'assignment.role_id')
    ->where('assignment.model_type', 'App\\Models\\Core\\User')
    ->whereIn('assignment.model_id', $realUserIds)
    ->orderBy('roles.id')
    ->get(['assignment.model_id', 'roles.name'])
    ->groupBy('model_id');

$userRecords = $users->map(function ($user) use ($rolesByUserId): array {
    return [
        'legacy_id' => (int) $user->legacy_id,
        'name' => $user->name,
        'username' => $user->username,
        'email' => $user->email,
        'whatsapp_number' => $user->whatsapp_number,
        'password_hash' => $user->password_hash,
        'is_onboarded' => (bool) $user->is_onboarded,
        'division_name' => $user->division_name,
        'position_name' => $user->position_name,
        'avatar_path' => $user->avatar_path,
        'settings' => decodeJson($user->settings),
        'roles' => $rolesByUserId->get($user->legacy_id, collect())->pluck('name')->values()->all(),
        'deleted_at' => $user->deleted_at,
        'created_at' => $user->created_at,
        'updated_at' => $user->updated_at,
    ];
})->values();

$assignmentsByTaskId = $db->table('homework_task_user as assignment')
    ->join('users', 'users.id', '=', 'assignment.user_id')
    ->orderBy('assignment.id')
    ->get(['assignment.homework_task_id', 'assignment.user_id', 'users.username'])
    ->groupBy('homework_task_id');

$taskRecords = $db->table('homework_tasks as tasks')
    ->leftJoin('users as creator', 'creator.id', '=', 'tasks.created_by')
    ->orderBy('tasks.id')
    ->get([
        'tasks.*',
        'creator.username as created_by_username',
    ])
    ->map(function ($task) use ($assignmentsByTaskId, $realUserIdLookup): array {
        $assignments = $assignmentsByTaskId->get($task->id, collect());

        return [
            'legacy_id' => (int) $task->id,
            'task_given_date' => $task->task_given_date,
            'task_name' => $task->task_name,
            'pic_vendor' => $task->pic_vendor,
            'deadline_date' => $task->deadline_date,
            'file_link' => $task->file_link,
            'status' => $task->status,
            'task_timestamps' => decodeJson($task->task_timestamps) ?? [],
            'delay_reasons' => null,
            'support_file_path' => decodeJson($task->support_file_path) ?? [null, null, null],
            'draft_file_path' => decodeJson($task->draft_file_path) ?? [null, null, null],
            'created_by_username' => $task->created_by_username,
            'assigned_usernames' => $assignments
                ->filter(fn ($assignment) => isset($realUserIdLookup[(int) $assignment->user_id]))
                ->pluck('username')
                ->values()
                ->all(),
            'skipped_default_usernames' => $assignments
                ->reject(fn ($assignment) => isset($realUserIdLookup[(int) $assignment->user_id]))
                ->pluck('username')
                ->values()
                ->all(),
            'created_at' => $task->created_at,
            'updated_at' => $task->updated_at,
        ];
    })
    ->values();

$payload = [
    'metadata' => [
        'schema_version' => 1,
        'source_key' => $sourceKey,
        'source_database' => $database,
        'source_sql_sha256' => is_string($sourceSql) && is_file($sourceSql) ? hash_file('sha256', $sourceSql) : null,
        'exported_at' => now()->toIso8601String(),
        'counts' => [
            'users' => $userRecords->count(),
            'tasks' => $taskRecords->count(),
            'real_user_assignments' => $taskRecords->sum(fn ($task) => count($task['assigned_usernames'])),
            'skipped_default_user_assignments' => $taskRecords->sum(fn ($task) => count($task['skipped_default_usernames'])),
            'referenced_files' => $taskRecords->sum(fn ($task) => count(array_filter($task['support_file_path'])) + count(array_filter($task['draft_file_path']))),
        ],
        'excluded_default_usernames' => $defaultUsernames,
    ],
    'users' => $userRecords->all(),
    'tasks' => $taskRecords->all(),
];

$directory = dirname($output);
if (! is_dir($directory) && ! mkdir($directory, 0700, true) && ! is_dir($directory)) {
    throw new RuntimeException("Cannot create output directory: {$directory}");
}

$json = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR).PHP_EOL;
if (file_put_contents($output, $json, LOCK_EX) === false) {
    throw new RuntimeException("Cannot write restore data: {$output}");
}
@chmod($output, 0600);

$checksum = hash_file('sha256', $output);
file_put_contents($output.'.sha256', $checksum.PHP_EOL, LOCK_EX);
@chmod($output.'.sha256', 0600);

fwrite(STDOUT, json_encode([
    'output' => $output,
    'sha256' => $checksum,
    'counts' => $payload['metadata']['counts'],
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES).PHP_EOL);

/** @return array<mixed>|null */
function decodeJson(mixed $value): ?array
{
    if ($value === null || $value === '') {
        return null;
    }

    return json_decode((string) $value, true, 512, JSON_THROW_ON_ERROR);
}
