<?php

namespace Tests\Unit\Events;

use App\Events\PendingUserRegistered;
use App\Models\Core\User;
use Illuminate\Broadcasting\PrivateChannel;
use Tests\TestCase;

class PendingUserRegisteredTest extends TestCase
{
    public function test_event_uses_private_admin_channel_and_minimal_payload(): void
    {
        $user = new User(['email' => 'pending@example.com']);
        $user->id = 42;
        $user->created_at = now();

        $event = new PendingUserRegistered($user);
        $channel = $event->broadcastOn();

        $this->assertInstanceOf(PrivateChannel::class, $channel);
        $this->assertSame('private-admin.notifications', $channel->name);
        $this->assertSame('PendingUserRegistered', $event->broadcastAs());
        $this->assertSame(42, $event->broadcastWith()['user_id']);
        $this->assertArrayNotHasKey('email', $event->broadcastWith());
    }
}
