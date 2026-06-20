<?php

namespace Tests\Feature\Core;

use App\Livewire\Core\DashboardStats;
use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Livewire\Livewire;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_non_root_user_sees_only_standard_metrics(): void
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('Designer');

        Livewire::actingAs($user)
            ->test(DashboardStats::class)
            ->assertSet('isRoot', false)
            ->assertSet('totalSessions', 0)
            ->assertSet('totalSuspendedUsers', 0)
            ->assertSet('latestActivities', [])
            ->assertSet('systemEnv', [])
            ->assertSee('User Aktif')
            ->assertSee('Role Kamu')
            ->assertDontSee('Sesi Perangkat Aktif')
            ->assertDontSee('Ukuran Basis Data')
            ->assertDontSee('Log Aktivitas Sistem Terbaru');
    }

    public function test_root_user_can_view_comprehensive_system_metrics(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        // Simulate a suspended user
        User::factory()->create([
            'is_active' => false,
            'approved_by' => $root->id,
        ]);

        // Insert dummy session
        DB::table('sessions')->insert([
            'id' => 'dummy_session_id',
            'user_id' => $root->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0',
            'payload' => 'dummy',
            'last_activity' => time(),
        ]);

        // Create some global activities
        activity('auth')->causedBy($root)->withProperties(['ip' => '127.0.0.1'])->log('Uji Coba Aktivitas Root');
        activity('rbac')->causedBy($root)->withProperties(['ip' => '127.0.0.1'])->log('Mengubah hak akses');

        Livewire::actingAs($root)
            ->test(DashboardStats::class)
            ->assertSet('isRoot', true)
            ->assertSet('totalSessions', 1)
            ->assertSet('totalSuspendedUsers', 1)
            ->assertSet('databaseDriver', DB::getDriverName())
            ->assertHasNoErrors()
            ->assertSee('Pengguna Sistem')
            ->assertSee('Sesi Perangkat Aktif')
            ->assertSee('Antrean Pekerjaan')
            ->assertSee('Ukuran Basis Data')
            ->assertSee('Log Aktivitas Sistem Terbaru')
            ->assertSee('Uji Coba Aktivitas Root')
            ->assertSee('Mengubah hak akses')
            ->assertSee('Laravel Version')
            ->assertSee('PHP Version');
    }

    public function test_user_status_updated_event_is_dispatched_on_registration(): void
    {
        \Illuminate\Support\Facades\Event::fake();

        $this->post('/register', [
            'name' => 'Uji Coba',
            'username' => 'ujicoba',
            'email' => 'ujicoba@example.com',
            'whatsapp_number' => '6281234567890',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'registration_note' => 'Catatan pendaftaran',
        ]);

        \Illuminate\Support\Facades\Event::assertDispatched(\App\Events\Core\UserStatusUpdated::class);
    }
}
