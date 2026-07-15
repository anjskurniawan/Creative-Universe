<?php

namespace Database\Seeders;

use App\Models\Core\Division;
use App\Models\Core\Position;
use App\Models\Core\User;
use App\SubApps\KvRetail\Models\KvRetailTask;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use JsonException;
use RuntimeException;

class HostingRealDataSeeder extends Seeder
{
    /**
     * Restore real hosting users and legacy Homework Tasks from a private data pack.
     */
    public function run(): void
    {
        $path = (string) config('hosting-restore.path');
        $payload = $this->loadPayload($path);

        // Ensure roles, permissions, master data, Root, and applications exist first.
        $this->call(ProductionDatabaseSeeder::class);

        $restored = DB::transaction(function () use ($payload): array {
            $usersByUsername = $this->restoreUsers($payload['users']);
            $taskResult = $this->restoreTasks(
                $payload['tasks'],
                $usersByUsername,
                (string) $payload['metadata']['source_key'],
            );

            return [
                'users' => count($usersByUsername),
                'tasks' => $taskResult['tasks'],
                'assignments' => $taskResult['assignments'],
                'skipped_legacy_assignments' => $taskResult['skipped_legacy_assignments'],
            ];
        });

        // Recalculate app assignments after the real users and task relations exist.
        $this->call(ApplicationAccessSeeder::class);

        $this->command?->info(sprintf(
            'Restored %d real users, %d KV Retail tasks, and %d real-user assignments. Skipped %d legacy default-account assignments.',
            $restored['users'],
            $restored['tasks'],
            $restored['assignments'],
            $restored['skipped_legacy_assignments'],
        ));
    }

    /** @return array{metadata: array<string, mixed>, users: array<int, array<string, mixed>>, tasks: array<int, array<string, mixed>>} */
    private function loadPayload(string $path): array
    {
        if ($path === '' || ! is_file($path)) {
            throw new RuntimeException("File restore hosting tidak ditemukan: {$path}");
        }

        $checksumPath = $path.'.sha256';
        if (is_file($checksumPath)) {
            $expected = trim((string) file_get_contents($checksumPath));
            $actual = hash_file('sha256', $path);
            if (! hash_equals($expected, $actual)) {
                throw new RuntimeException('Checksum file restore hosting tidak cocok. Restore dibatalkan.');
            }
        }

        try {
            $payload = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException('File restore hosting bukan JSON yang valid.', previous: $exception);
        }

        if (! is_array($payload)
            || data_get($payload, 'metadata.schema_version') !== 1
            || blank(data_get($payload, 'metadata.source_key'))
            || ! is_array($payload['users'] ?? null)
            || ! is_array($payload['tasks'] ?? null)) {
            throw new RuntimeException('Struktur file restore hosting tidak dikenali.');
        }

        if ((int) data_get($payload, 'metadata.counts.users', -1) !== count($payload['users'])
            || (int) data_get($payload, 'metadata.counts.tasks', -1) !== count($payload['tasks'])) {
            throw new RuntimeException('Jumlah data pada metadata restore hosting tidak cocok.');
        }

        return $payload;
    }

    /**
     * @param  array<int, array<string, mixed>>  $records
     * @return array<string, User>
     */
    private function restoreUsers(array $records): array
    {
        $usersByUsername = [];

        foreach ($records as $record) {
            $username = trim((string) ($record['username'] ?? ''));
            $email = trim((string) ($record['email'] ?? ''));
            $passwordHash = (string) ($record['password_hash'] ?? '');

            if ($username === '' || $email === '' || $passwordHash === '') {
                throw new RuntimeException('Record user restore tidak memiliki username, email, atau password hash.');
            }

            $divisionId = null;
            $positionId = null;
            $divisionName = trim((string) ($record['division_name'] ?? ''));
            $positionName = trim((string) ($record['position_name'] ?? ''));

            if ($divisionName !== '') {
                $division = Division::firstOrCreate(['name' => $divisionName]);
                $divisionId = $division->id;

                if ($positionName !== '') {
                    $positionId = Position::firstOrCreate([
                        'division_id' => $division->id,
                        'name' => $positionName,
                    ])->id;
                }
            }

            $byUsername = User::withTrashed()->where('username', $username)->first();
            $byEmail = User::withTrashed()->where('email', $email)->first();
            if ($byUsername && $byEmail && $byUsername->id !== $byEmail->id) {
                throw new RuntimeException("Konflik restore user {$username}: username dan email dimiliki record berbeda.");
            }

            $existing = $byUsername ?? $byEmail;
            $attributes = [
                'name' => (string) $record['name'],
                'username' => $username,
                'email' => $email,
                'whatsapp_number' => $record['whatsapp_number'] ?: null,
                // Use Query Builder so an existing password hash is not hashed a second time.
                'password' => $passwordHash,
                'is_onboarded' => (bool) ($record['is_onboarded'] ?? true),
                'division_id' => $divisionId,
                'position_id' => $positionId,
                'avatar_path' => $record['avatar_path'] ?: null,
                'settings' => isset($record['settings']) ? json_encode($record['settings'], JSON_THROW_ON_ERROR) : null,
                'deleted_at' => $record['deleted_at'] ?: null,
                'created_at' => $record['created_at'] ?: now(),
                'updated_at' => $record['updated_at'] ?: now(),
            ];

            if (Schema::hasColumn('users', 'is_active')) {
                $attributes['is_active'] = true;
            }
            if (Schema::hasColumn('users', 'approved_at')) {
                $attributes['approved_at'] = $record['created_at'] ?: now();
            }

            if ($existing) {
                DB::table('users')->where('id', $existing->id)->update($attributes);
                $userId = $existing->id;
            } else {
                $userId = DB::table('users')->insertGetId($attributes);
            }

            $user = User::withTrashed()->findOrFail($userId);
            $roleNames = array_values(array_filter(array_map('strval', $record['roles'] ?? [])));
            if ($roleNames === []) {
                throw new RuntimeException("User {$username} tidak memiliki role pada file restore.");
            }
            $user->syncRoles($roleNames);
            $usersByUsername[$username] = $user;
        }

        return $usersByUsername;
    }

    /**
     * @param  array<int, array<string, mixed>>  $records
     * @param  array<string, User>  $usersByUsername
     * @return array{tasks: int, assignments: int, skipped_legacy_assignments: int}
     */
    private function restoreTasks(array $records, array $usersByUsername, string $sourceKey): array
    {
        $assignmentCount = 0;
        $skippedCount = 0;

        foreach ($records as $record) {
            $legacyId = (int) ($record['legacy_id'] ?? 0);
            $creatorUsername = (string) ($record['created_by_username'] ?? '');
            $creator = $usersByUsername[$creatorUsername] ?? null;

            if ($legacyId < 1 || ! $creator) {
                throw new RuntimeException("Task legacy {$legacyId} tidak memiliki pembuat dari kelompok user nyata.");
            }

            $task = KvRetailTask::updateOrCreate(
                [
                    'legacy_source' => $sourceKey,
                    'legacy_id' => $legacyId,
                ],
                [
                    'task_given_date' => $record['task_given_date'],
                    'task_name' => $record['task_name'],
                    'pic_vendor' => $record['pic_vendor'] ?: null,
                    'deadline_date' => $record['deadline_date'] ?: null,
                    'file_link' => $record['file_link'] ?: null,
                    'status' => $record['status'],
                    'task_timestamps' => $record['task_timestamps'] ?? [],
                    'delay_reasons' => $record['delay_reasons'] ?? null,
                    'support_file_path' => $record['support_file_path'] ?? [null, null, null],
                    'draft_file_path' => $record['draft_file_path'] ?? [null, null, null],
                    'created_by' => $creator->id,
                ],
            );

            DB::table('kv_retail_tasks')->where('id', $task->id)->update([
                'created_at' => $record['created_at'] ?: now(),
                'updated_at' => $record['updated_at'] ?: now(),
            ]);

            $assignedUserIds = [];
            foreach ($record['assigned_usernames'] ?? [] as $username) {
                $assigned = $usersByUsername[(string) $username] ?? null;
                if (! $assigned) {
                    throw new RuntimeException("Assignee nyata {$username} tidak ditemukan saat restore task {$legacyId}.");
                }
                $assignedUserIds[] = $assigned->id;
            }

            $assignedUserIds = array_values(array_unique($assignedUserIds));
            $task->users()->sync($assignedUserIds);
            $assignmentCount += count($assignedUserIds);
            $skippedCount += count($record['skipped_default_usernames'] ?? []);
        }

        return [
            'tasks' => count($records),
            'assignments' => $assignmentCount,
            'skipped_legacy_assignments' => $skippedCount,
        ];
    }
}
