<?php

namespace Tests\Feature\Core;

use App\Livewire\Core\MaintenancePanel;
use App\Models\Core\User;
use App\Notifications\Core\TestNotification;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Livewire\Livewire;
use Tests\TestCase;

class MaintenancePanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_maintenance_panel(): void
    {
        $this->get('/maintenance')
            ->assertRedirect('/login');
    }

    public function test_non_superadmin_cannot_access_maintenance_panel(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('Desainer'); // Desainer tidak memiliki permission 'run-artisan'

        $this->actingAs($user)
            ->get('/maintenance')
            ->assertStatus(403);
    }

    public function test_superadmin_can_access_maintenance_panel(): void
    {
        $admin = $this->makeSuperadmin();

        $this->actingAs($admin)
            ->get('/maintenance')
            ->assertOk()
            ->assertSee('Panel Maintenance');
    }

    public function test_superadmin_can_trigger_artisan_commands(): void
    {
        $admin = $this->makeSuperadmin();

        Livewire::actingAs($admin)
            ->test(MaintenancePanel::class)
            ->call('runCommand', 'optimize:clear')
            ->assertHasNoErrors()
            ->assertSee('Command executed successfully!')
            ->assertSee("Running 'php artisan optimize:clear'");
    }

    public function test_superadmin_can_send_test_notification(): void
    {
        $admin = $this->makeSuperadmin();
        Notification::fake();

        // 1. Test Database Only
        Livewire::actingAs($admin)
            ->test(MaintenancePanel::class)
            ->set('testMessage', 'Pesan Uji Coba Lonceng Notifikasi')
            ->call('sendTestNotification', 'database')
            ->assertHasNoErrors();

        Notification::assertSentTo(
            $admin,
            TestNotification::class,
            function ($notification, $channels) {
                return in_array('database', $channels) && !in_array('broadcast', $channels);
            }
        );

        // 2. Test Broadcast + Database (for real-time badge testing)
        Livewire::actingAs($admin)
            ->test(MaintenancePanel::class)
            ->set('testMessage', 'Pesan Uji Coba Pusher')
            ->call('sendTestNotification', 'broadcast')
            ->assertHasNoErrors();

        Notification::assertSentTo(
            $admin,
            TestNotification::class,
            function ($notification, $channels) {
                return in_array('database', $channels) && in_array('broadcast', $channels);
            }
        );
    }

    private function makeSuperadmin(): User
    {
        $this->seed(RolePermissionSeeder::class);

        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Superadmin');

        return $admin;
    }
}
