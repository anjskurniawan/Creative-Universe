<?php

namespace App\SubApps\Odds\Contracts;

use App\Models\Core\Conversation;
use App\Models\Core\User;

interface OddsConversationPresenter
{
    /** @return array<string, mixed> */
    public function payload(Conversation $conversation, User $user): array;
}
