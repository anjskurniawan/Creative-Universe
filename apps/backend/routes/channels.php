<?php

/**
 * Pusher Private Channel Authorization — SRD v6.3 Seksi 11.2
 *
 * Private channel membutuhkan otorisasi server agar
 * hanya user yang berhak dapat subscribe.
 */

use App\Models\Core\User;
use App\Models\Pricetag\PricetagBatch;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.Core.User.{id}', function (User $user, int $id): bool {
    return (int) $user->id === $id;
});

Broadcast::channel('admin.notifications', function (User $user): bool {
    return $user->can('approve-users');
});

Broadcast::channel('pricetag-batch.{batchId}', function (User $user, int $batchId): bool {
    $batch = PricetagBatch::find($batchId);

    return $batch && ($user->id === (int) $batch->created_by || $user->hasRole('Root'));
});

Broadcast::channel('conversation.{conversationId}', function (User $user, int $conversationId): bool {
    return $user->conversations()->where('conversation_id', $conversationId)->exists();
});
