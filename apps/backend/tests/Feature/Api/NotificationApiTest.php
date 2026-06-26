<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use App\Notifications\Odds\OddsWorkflowNotification;
use App\Notifications\Core\TestNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_only_their_latest_notifications(): void
    {
        $user = User::factory()->create([]);
        $other = User::factory()->create([]);

        $ownId = $this->insertNotification($user, 'Notifikasi milik user');
        $this->insertNotification($other, 'Notifikasi milik user lain');

        $response = $this->actingAs($user)->getJson('/api/v1/notifications');

        $response->assertOk()
            ->assertJsonPath('data.unread_count', 1)
            ->assertJsonCount(1, 'data.notifications')
            ->assertJsonPath('data.notifications.0.id', $ownId)
            ->assertJsonPath('data.notifications.0.url', '/dashboard');

        $response->assertJsonMissing(['message' => 'Notifikasi milik user lain']);
    }

    public function test_odds_notification_is_stored_immediately_and_preserves_task_url(): void
    {
        $user = User::factory()->create([]);

        $user->notify(new OddsWorkflowNotification(
            'task_created',
            'Brief baru perlu diperiksa',
            'Client mengirim brief ODDS baru untuk Anda.',
            null,
            '/odds/detail?id=123'
        ));

        $this->assertSame(1, $user->notifications()->count());

        $this->actingAs($user)
            ->getJson('/api/v1/notifications')
            ->assertOk()
            ->assertJsonPath('data.notifications.0.message', 'Client mengirim brief ODDS baru untuk Anda.')
            ->assertJsonPath('data.notifications.0.url', '/odds/detail?id=123');
    }

    public function test_user_can_mark_owned_notification_as_read(): void
    {
        $user = User::factory()->create([]);
        $notificationId = $this->insertNotification($user, 'Perlu dibaca');

        $this->actingAs($user)
            ->patchJson("/api/v1/notifications/{$notificationId}/read")
            ->assertOk()
            ->assertJsonPath('data.is_read', true);

        $this->assertDatabaseMissing('notifications', [
            'id' => $notificationId,
            'read_at' => null,
        ]);
    }

    public function test_user_cannot_read_another_users_notification(): void
    {
        $user = User::factory()->create([]);
        $other = User::factory()->create([]);
        $notificationId = $this->insertNotification($other, 'Milik user lain');

        $this->actingAs($user)
            ->patchJson("/api/v1/notifications/{$notificationId}/read")
            ->assertNotFound();

        $this->assertDatabaseHas('notifications', [
            'id' => $notificationId,
            'read_at' => null,
        ]);
    }

    public function test_user_can_mark_all_owned_notifications_as_read(): void
    {
        $user = User::factory()->create([]);
        $other = User::factory()->create([]);
        $this->insertNotification($user, 'Satu');
        $this->insertNotification($user, 'Dua');
        $otherId = $this->insertNotification($other, 'Tetap unread');

        $this->actingAs($user)
            ->patchJson('/api/v1/notifications/read-all')
            ->assertOk()
            ->assertJsonPath('data.updated_count', 2);

        $this->assertSame(0, $user->unreadNotifications()->count());
        $this->assertDatabaseHas('notifications', [
            'id' => $otherId,
            'read_at' => null,
        ]);
    }

    public function test_user_can_only_authorize_their_private_notification_channel(): void
    {
        config([
            'broadcasting.default' => 'pusher',
            'broadcasting.connections.pusher.key' => 'test-key',
            'broadcasting.connections.pusher.secret' => 'test-secret',
            'broadcasting.connections.pusher.app_id' => 'test-app',
        ]);
        Broadcast::setDefaultDriver('pusher');
        Broadcast::purge('pusher');
        Broadcast::channel(
            'App.Models.Core.User.{id}',
            fn (User $authenticatedUser, int $id): bool => $authenticatedUser->id === $id
        );

        $user = User::factory()->create([]);
        $other = User::factory()->create([]);

        $this->actingAs($user)
            ->postJson('/broadcasting/auth', [
                'socket_id' => '1234.5678',
                'channel_name' => "private-App.Models.Core.User.{$user->id}",
            ])
            ->assertOk();

        $this->actingAs($user)
            ->postJson('/broadcasting/auth', [
                'socket_id' => '1234.5678',
                'channel_name' => "private-App.Models.Core.User.{$other->id}",
            ])
            ->assertForbidden();
    }

    private function insertNotification(User $user, string $message): string
    {
        $id = (string) Str::uuid();

        DB::table('notifications')->insert([
            'id' => $id,
            'type' => TestNotification::class,
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => json_encode([
                'message' => $message,
                'url' => 'https://creative.doran.id/dashboard',
            ], JSON_THROW_ON_ERROR),
            'read_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $id;
    }
}
