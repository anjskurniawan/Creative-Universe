<?php

/**
 * Pusher Private Channel Authorization — SRD v6.3 Seksi 11.2
 *
 * Private channel membutuhkan otorisasi server agar
 * hanya user yang berhak dapat subscribe.
 */

use App\Models\Core\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.Core.User.{id}', function (User $user, int $id): bool {
    return (int) $user->id === $id;
});

Broadcast::channel('admin.notifications', function (User $user): bool {
    return $user->is_active && $user->can('approve-users');
});

Broadcast::channel('pricetag-batch.{batchId}', function (User $user, int $batchId): bool {
    $batch = \App\Models\Pricetag\PricetagBatch::find($batchId);
    return $batch && ($user->id === (int) $batch->created_by || $user->hasRole('Root'));
});
