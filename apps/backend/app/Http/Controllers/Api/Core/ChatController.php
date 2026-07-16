<?php

namespace App\Http\Controllers\Api\Core;

use App\Events\Core\MessageSent;
use App\Http\Controllers\Api\BaseApiController;
use App\Models\Core\Conversation;
use App\Models\Core\Message;
use App\Models\Core\MessageRead;
use App\Models\Core\StoredFile;
use App\Models\Core\User;
use App\Notifications\Core\MessageMentionNotification;
use App\Services\Core\FileStorageService;
use App\SubApps\Odds\Contracts\OddsConversationPresenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ChatController extends BaseApiController
{
    public function __construct(private OddsConversationPresenter $oddsConversations) {}

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

        return $this->sendResponse($sorted, 'Percakapan berhasil diambil.');
    }

    public function getMessages(Request $request, $id)
    {
        $user = auth()->user();
        $conversation = Conversation::query()->findOrFail($id);

        Gate::authorize('view', $conversation);

        $perPage = min(max($request->integer('per_page', 40), 1), 80);
        $page = $conversation->messages()
            ->with(['sender:id,name,avatar_path', 'replyTo.sender:id,name,avatar_path'])
            ->latest('id')
            ->paginate($perPage);
        $messages = $page->getCollection()->reverse()->values();

        $unreadIds = $messages
            ->where('sender_id', '!=', $user->id)
            ->pluck('id');
        if ($unreadIds->isNotEmpty()) {
            MessageRead::upsert(
                $unreadIds->map(fn (int $messageId) => [
                    'message_id' => $messageId,
                    'user_id' => $user->id,
                    'read_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ])->all(),
                ['message_id', 'user_id'],
                ['read_at', 'updated_at'],
            );
        }

        return $this->sendResponse(
            $messages->map(fn (Message $message) => $this->messagePayload($message, $user->id)),
            'Pesan berhasil diambil.',
            200,
            ['current_page' => $page->currentPage(), 'last_page' => $page->lastPage(), 'has_more' => $page->hasMorePages()],
        );
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required_without:receiver_id|integer|exists:conversations,id',
            'receiver_id' => 'required_without:conversation_id|integer|exists:users,id',
            'body' => 'nullable|string|max:5000|required_without:attachment_ids',
            'attachment_ids' => 'nullable|array|max:8',
            'attachment_ids.*' => 'integer|exists:stored_files,id',
            'reply_to_id' => 'nullable|integer|exists:messages,id',
        ]);

        $user = auth()->user();
        if (blank($request->input('body')) && $request->input('attachment_ids', []) === []) {
            throw ValidationException::withMessages(['body' => 'Pesan atau lampiran wajib diisi.']);
        }
        $conversationId = $request->integer('conversation_id');

        if ($conversationId) {
            $conversation = Conversation::query()->findOrFail($conversationId);

            if (! $user->can('sendMessage', $conversation)) {
                throw ValidationException::withMessages([
                    'conversation_id' => 'Room chat ini tidak bisa menerima pesan dari user ini.',
                ]);
            }

            return $this->storeAndBroadcast($conversation, $user, $request->string('body')->toString(), $request->integer('reply_to_id') ?: null, $request->input('attachment_ids', []));
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
                    return $this->sendError('Anda hanya diizinkan untuk mengirim pesan ke Designer terkait tiket Anda.', [], 403);
                }
            }

            $conversation = Conversation::create([
                'context_type' => Conversation::CONTEXT_DIRECT,
                'status' => Conversation::STATUS_OPEN,
            ]);
            $conversation->users()->attach([$user->id, $receiverId]);
        }

        return $this->storeAndBroadcast($conversation, $user, $request->string('body')->toString(), $request->integer('reply_to_id') ?: null, $request->input('attachment_ids', []));
    }

    public function uploadAttachment(Request $request, FileStorageService $storage)
    {
        $request->validate([
            'file' => 'required|file|max:10240|mimes:jpg,jpeg,png,webp,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,zip',
        ]);

        $file = $storage->store(
            $request->file('file'), 'core', 'message_draft', auth()->id(), 'attachments', auth()->id(), 'public',
        );

        return $this->sendResponse($this->attachmentPayload($file), 'Lampiran siap dikirim.', 201);
    }

    private function storeAndBroadcast(Conversation $conversation, User $sender, string $body, ?int $replyToId, array $attachmentIds)
    {
        if ($replyToId && ! $conversation->messages()->whereKey($replyToId)->exists()) {
            throw ValidationException::withMessages(['reply_to_id' => 'Pesan balasan harus berasal dari room yang sama.']);
        }

        $attachments = StoredFile::query()
            ->whereIn('id', $attachmentIds)
            ->where('uploaded_by', $sender->id)
            ->where('application_key', 'core')
            ->where('context_type', 'message_draft')
            ->get();
        if ($attachments->count() !== count(array_unique($attachmentIds))) {
            throw ValidationException::withMessages(['attachment_ids' => 'Satu atau lebih lampiran tidak valid.']);
        }

        $mentionedUserIds = $this->mentionedUserIds($body, $conversation, $sender->id);
        $message = DB::transaction(function () use ($conversation, $sender, $body, $replyToId, $attachments, $mentionedUserIds) {
            $message = $conversation->messages()->create([
                'sender_id' => $sender->id,
                'reply_to_id' => $replyToId,
                'body' => $body,
                'mentioned_user_ids' => $mentionedUserIds,
            ]);
            $storage = app(FileStorageService::class);
            $payload = $attachments->map(function (StoredFile $file) use ($storage, $message, $sender) {
                $path = $storage->relocate($file->path, 'core', 'message', $message->id, 'attachments', $sender->id, $file->disk);
                $file->refresh();
                return $this->attachmentPayload($file->setAttribute('path', $path));
            })->values()->all();
            $message->update(['attachments' => $payload]);

            activity('messages')
                ->causedBy($sender)
                ->performedOn($message)
                ->event('message_sent')
                ->withProperties(['conversation_id' => $conversation->id, 'attachment_count' => count($payload)])
                ->log('Message sent');

            return $message;
        });

        $message->load(['sender:id,name,avatar_path', 'replyTo.sender:id,name,avatar_path']);
        $this->notifyMentions($message, $mentionedUserIds);

        broadcast(new MessageSent($message))->toOthers();

        return $this->sendResponse($this->messagePayload($message, $sender->id), 'Pesan berhasil dikirim.');
    }

    private function mentionedUserIds(string $body, Conversation $conversation, int $senderId): array
    {
        preg_match_all('/@([a-zA-Z0-9._-]+)/', $body, $matches);
        $usernames = array_unique($matches[1] ?? []);
        if ($usernames === []) return [];

        return $conversation->users()
            ->where('users.id', '!=', $senderId)
            ->whereIn('username', $usernames)
            ->pluck('users.id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    private function notifyMentions(Message $message, array $mentionedUserIds): void
    {
        if ($mentionedUserIds === []) return;
        User::whereIn('id', $mentionedUserIds)->get()->each(function (User $user) use ($message) {
            if ($user->getSetting('notification_in_app', true) !== false && $user->getSetting('notification_mentions', true) !== false) {
                $user->notify(new MessageMentionNotification($message));
            }
        });
    }

    private function attachmentPayload(StoredFile $file): array
    {
        return [
            'id' => $file->id,
            'name' => $file->original_name,
            'path' => $file->path,
            'mime_type' => $file->mime_type,
            'size' => $file->size,
        ];
    }

    private function messagePayload(Message $message, int $viewerId): array
    {
        $payload = $message->toArray();
        $payload['read_at'] = $message->sender_id === $viewerId ? null : MessageRead::query()
            ->where('message_id', $message->id)->where('user_id', $viewerId)->value('read_at');
        $payload['read_state'] = $message->sender_id === $viewerId
            ? (MessageRead::query()->where('message_id', $message->id)->exists() ? 'read' : 'sent')
            : 'read';
        return $payload;
    }

    public function getContacts()
    {
        $user = auth()->user();
        $allowedRoles = ['Manajer', 'SPV', 'Designer', 'Videographer', 'Root'];

        if ($user->hasAnyRole($allowedRoles)) {
            $contacts = User::whereHas('roles', function ($q) use ($allowedRoles) {
                $q->whereIn('name', $allowedRoles);
            })->where('id', '!=', $user->id)
                ->select('id', 'name', 'username', 'avatar_path')
                ->get();
        } else {
            // User biasa hanya melihat designer
            $contacts = User::role('Designer')
                ->select('id', 'name', 'username', 'avatar_path')
                ->get();
        }

        return $this->sendResponse($contacts, 'Kontak berhasil diambil.');
    }
}
