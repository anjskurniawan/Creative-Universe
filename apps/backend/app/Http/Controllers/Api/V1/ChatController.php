<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Core\Conversation;
use App\Models\Core\User;
use App\Services\Odds\OddsTaskConversationService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ChatController extends Controller
{
    public function __construct(private OddsTaskConversationService $oddsConversations) {}

    public function getConversations()
    {
        $user = auth()->user();

        $conversations = $user->conversations()
            ->with('users.roles')
            ->with(['messages' => function ($q) {
                $q->latest()->limit(1);
            }])
            ->get()
            ->map(fn (Conversation $conv) => $this->oddsConversations->payload($conv, $user));

        // Sort by last message date descending
        $sorted = $conversations->sortByDesc(function ($c) {
            return $c['last_message']['created_at'] ?? $c['updated_at'] ?? '1970-01-01';
        })->values();

        return response()->json([
            'status' => 'success',
            'data' => $sorted,
        ]);
    }

    public function getMessages($id)
    {
        $user = auth()->user();
        $conversation = Conversation::query()->findOrFail($id);

        abort_unless($this->oddsConversations->userCanRead($user, $conversation), 403);

        $messages = $conversation->messages()
            ->with('sender:id,name,avatar_path')
            ->oldest()
            ->get();

        // Mark unread messages as read
        if ($conversation->users()->whereKey($user->id)->exists()) {
            $conversation->messages()
                ->where('sender_id', '!=', $user->id)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $messages,
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required_without:receiver_id|integer|exists:conversations,id',
            'receiver_id' => 'required_without:conversation_id|integer|exists:users,id',
            'body' => 'required|string',
        ]);

        $user = auth()->user();
        $conversationId = $request->integer('conversation_id');

        if ($conversationId) {
            $conversation = Conversation::query()->findOrFail($conversationId);

            if (! $this->oddsConversations->userCanSend($user, $conversation)) {
                throw ValidationException::withMessages([
                    'conversation_id' => 'Room chat ini tidak bisa menerima pesan dari user ini.',
                ]);
            }

            return $this->storeAndBroadcast($conversation, $user->id, $request->string('body')->toString());
        }

        $receiverId = $request->receiver_id;

        // Check if conversation exists
        $conversation = $user->conversations()
            ->where('context_type', Conversation::CONTEXT_DIRECT)
            ->whereHas('users', function ($q) use ($receiverId) {
                $q->where('users.id', $receiverId);
            })
            ->first();

        if (! $conversation) {
            // Check roles auth
            $allowedRoles = ['Manajer', 'SPV', 'Designer', 'Videographer', 'Root'];
            $isStaff = $user->hasAnyRole($allowedRoles);

            // For now, if not staff, we'll just allow creating if the receiver is Designer
            // Real odds checking can be implemented later
            if (! $isStaff) {
                $receiver = User::findOrFail($receiverId);
                if (! $receiver->hasRole('Designer')) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Anda hanya diizinkan untuk mengirim pesan ke Designer terkait tiket Anda.',
                    ], 403);
                }
            }

            $conversation = Conversation::create([
                'context_type' => Conversation::CONTEXT_DIRECT,
                'status' => Conversation::STATUS_OPEN,
            ]);
            $conversation->users()->attach([$user->id, $receiverId]);
        }

        return $this->storeAndBroadcast($conversation, $user->id, $request->string('body')->toString());
    }

    private function storeAndBroadcast(Conversation $conversation, int $senderId, string $body)
    {
        $message = $conversation->messages()->create([
            'sender_id' => $senderId,
            'body' => $body,
        ]);

        broadcast(new MessageSent($message->load('sender:id,name,avatar_path')))->toOthers();

        return response()->json([
            'status' => 'success',
            'data' => $message->load('sender:id,name,avatar_path'),
        ]);
    }

    public function getContacts()
    {
        $user = auth()->user();
        $allowedRoles = ['Manajer', 'SPV', 'Designer', 'Videographer', 'Root'];

        if ($user->hasAnyRole($allowedRoles)) {
            $contacts = User::whereHas('roles', function ($q) use ($allowedRoles) {
                $q->whereIn('name', $allowedRoles);
            })->where('id', '!=', $user->id)
                ->select('id', 'name', 'avatar_path')
                ->get();
        } else {
            // User biasa hanya melihat designer
            $contacts = User::role('Designer')
                ->select('id', 'name', 'avatar_path')
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $contacts,
        ]);
    }
}
