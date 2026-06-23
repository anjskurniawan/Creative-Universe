<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function getConversations()
    {
        $user = auth()->user();
        
        $conversations = $user->conversations()
            ->with(['users' => function($q) use ($user) {
                $q->where('users.id', '!=', $user->id);
            }])
            ->with(['messages' => function($q) {
                $q->latest()->limit(1);
            }])
            ->get()
            ->map(function ($conv) {
                $partner = $conv->users->first();
                $lastMessage = $conv->messages->first();
                return [
                    'id' => $conv->id,
                    'partner' => $partner ? [
                        'id' => $partner->id,
                        'name' => $partner->name,
                        'avatar' => $partner->avatar_path,
                        'roles' => $partner->roles->pluck('name'),
                    ] : null,
                    'last_message' => $lastMessage ? [
                        'body' => $lastMessage->body,
                        'created_at' => $lastMessage->created_at,
                        'is_read' => $lastMessage->read_at !== null,
                        'sender_id' => $lastMessage->sender_id,
                    ] : null,
                ];
            });

        // Sort by last message date descending
        $sorted = $conversations->sortByDesc(function ($c) {
            return $c['last_message']['created_at'] ?? '1970-01-01';
        })->values();

        return response()->json([
            'status' => 'success',
            'data' => $sorted,
        ]);
    }

    public function getMessages($id)
    {
        $user = auth()->user();
        $conversation = $user->conversations()->findOrFail($id);

        $messages = $conversation->messages()
            ->with('sender:id,name,avatar_path')
            ->oldest()
            ->get();

        // Mark unread messages as read
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'status' => 'success',
            'data' => $messages,
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'body' => 'required|string',
        ]);

        $user = auth()->user();
        $receiverId = $request->receiver_id;

        // Check if conversation exists
        $conversation = $user->conversations()
            ->whereHas('users', function ($q) use ($receiverId) {
                $q->where('users.id', $receiverId);
            })
            ->first();

        if (!$conversation) {
            // Check roles auth
            $allowedRoles = ['Manajer', 'SPV', 'Designer', 'Videographer', 'Root'];
            $isStaff = $user->hasAnyRole($allowedRoles);
            
            // For now, if not staff, we'll just allow creating if the receiver is Designer
            // Real odds checking can be implemented later
            if (!$isStaff) {
                $receiver = \App\Models\Core\User::findOrFail($receiverId);
                if (!$receiver->hasRole('Designer')) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Anda hanya diizinkan untuk mengirim pesan ke Designer terkait tiket Anda.',
                    ], 403);
                }
            }

            $conversation = \App\Models\Core\Conversation::create();
            $conversation->users()->attach([$user->id, $receiverId]);
        }

        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'body' => $request->body,
        ]);

        broadcast(new \App\Events\MessageSent($message))->toOthers();

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
            $contacts = \App\Models\Core\User::whereHas('roles', function($q) use ($allowedRoles) {
                $q->whereIn('name', $allowedRoles);
            })->where('id', '!=', $user->id)
            ->select('id', 'name', 'avatar_path')
            ->get();
        } else {
            // User biasa hanya melihat designer
            $contacts = \App\Models\Core\User::role('Designer')
                ->select('id', 'name', 'avatar_path')
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $contacts,
        ]);
    }
}
