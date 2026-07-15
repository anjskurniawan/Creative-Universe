<?php

declare(strict_types=1);

namespace Tests\Feature\Database;

use App\Models\Core\User;
use App\SubApps\KvRetail\Models\KvRetailTask;
use Database\Seeders\HostingRealDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class HostingRealDataSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_restores_real_users_tasks_and_relationships_idempotently(): void
    {
        $path = storage_path('framework/testing/hosting-restore-test.json');
        $payload = $this->payload();
        file_put_contents($path, json_encode($payload, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
        file_put_contents($path.'.sha256', hash_file('sha256', $path));

        Config::set('auth.root_user.password', 'root-test-password');
        Config::set('hosting-restore.path', $path);

        try {
            $this->seed(HostingRealDataSeeder::class);
            $this->seed(HostingRealDataSeeder::class);

            $this->assertSame(3, User::count());
            $this->assertDatabaseHas('users', [
                'username' => 'real-manager',
                'is_onboarded' => true,
            ]);
            $this->assertDatabaseHas('positions', [
                'name' => 'Manager',
            ]);

            $manager = User::where('username', 'real-manager')->firstOrFail();
            $designer = User::where('username', 'real-designer')->firstOrFail();
            $this->assertTrue($manager->hasRole('Manajer'));
            $this->assertTrue($designer->hasRole('Designer'));
            $this->assertTrue(Hash::check('manager-password', $manager->password));

            $this->assertSame(1, KvRetailTask::count());
            $task = KvRetailTask::firstOrFail();
            $this->assertSame('hosting-test', $task->legacy_source);
            $this->assertSame(77, $task->legacy_id);
            $this->assertSame($manager->id, $task->created_by);
            $this->assertSame([$designer->id], $task->users()->pluck('users.id')->all());
        } finally {
            @unlink($path);
            @unlink($path.'.sha256');
        }
    }

    /** @return array<string, mixed> */
    private function payload(): array
    {
        return [
            'metadata' => [
                'schema_version' => 1,
                'source_key' => 'hosting-test',
                'counts' => [
                    'users' => 2,
                    'tasks' => 1,
                    'real_user_assignments' => 1,
                    'skipped_default_user_assignments' => 1,
                ],
            ],
            'users' => [
                [
                    'legacy_id' => 10,
                    'name' => 'Real Manager',
                    'username' => 'real-manager',
                    'email' => 'real-manager@example.test',
                    'whatsapp_number' => '81234567890',
                    'password_hash' => Hash::make('manager-password'),
                    'is_onboarded' => true,
                    'division_name' => 'Creative',
                    'position_name' => 'Manajer',
                    'avatar_path' => null,
                    'settings' => null,
                    'roles' => ['Manajer'],
                    'deleted_at' => null,
                    'created_at' => '2026-07-01 10:00:00',
                    'updated_at' => '2026-07-01 10:00:00',
                ],
                [
                    'legacy_id' => 11,
                    'name' => 'Real Designer',
                    'username' => 'real-designer',
                    'email' => 'real-designer@example.test',
                    'whatsapp_number' => null,
                    'password_hash' => Hash::make('designer-password'),
                    'is_onboarded' => true,
                    'division_name' => 'HRD',
                    'position_name' => 'Manager',
                    'avatar_path' => null,
                    'settings' => null,
                    'roles' => ['Designer'],
                    'deleted_at' => null,
                    'created_at' => '2026-07-02 10:00:00',
                    'updated_at' => '2026-07-02 10:00:00',
                ],
            ],
            'tasks' => [
                [
                    'legacy_id' => 77,
                    'task_given_date' => '2026-07-03',
                    'task_name' => 'Legacy KV Task',
                    'pic_vendor' => 'Fushion',
                    'deadline_date' => '2026-07-10',
                    'file_link' => null,
                    'status' => 'Progress Design',
                    'task_timestamps' => ['ACC Draft' => '03/07/2026 10:00'],
                    'delay_reasons' => null,
                    'support_file_path' => ['homework_tasks/77_reference.pdf', null, null],
                    'draft_file_path' => [null, null, null],
                    'created_by_username' => 'real-manager',
                    'assigned_usernames' => ['real-designer'],
                    'skipped_default_usernames' => ['spv'],
                    'created_at' => '2026-07-03 10:00:00',
                    'updated_at' => '2026-07-03 12:00:00',
                ],
            ],
        ];
    }
}
