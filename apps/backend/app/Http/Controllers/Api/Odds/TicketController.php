<?php

namespace App\Http\Controllers\Api\Odds;

use App\Actions\Odds\AssignTicketAction;
use App\Actions\Odds\CreateTicketAction;
use App\Actions\Odds\RateTicketAction;
use App\Actions\Odds\ReviewTicketAction;
use App\Actions\Odds\SubmitOutputAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Odds\AssignTicketRequest;
use App\Http\Requests\Odds\RateTicketRequest;
use App\Http\Requests\Odds\ReviewTicketRequest;
use App\Http\Requests\Odds\StoreTicketRequest;
use App\Http\Requests\Odds\SubmitOutputRequest;
use App\Http\Requests\Odds\UpdateTicketRequest;
use App\Http\Requests\Odds\UpdateTicketStatusRequest;
use App\Models\Odds\Ticket;
use Illuminate\Http\JsonResponse;

class TicketController extends Controller
{
    public function index(): JsonResponse
    {
        // Add basic filtering/pagination here
        $query = Ticket::with(['category', 'requester', 'assignedDesigner']);

        // Only show tickets relevant to the user if not manager/supervisor/root
        if (!auth()->user()->hasRole(['Root', 'Manajer', 'Supervisor', 'CEO'])) {
            if (auth()->user()->hasRole('Designer') || auth()->user()->hasRole('Videographer')) {
                $query->where('assigned_to', auth()->id());
            } else {
                $query->where('requester_id', auth()->id());
            }
        }

        $tickets = $query->latest()->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $tickets
        ]);
    }

    public function store(StoreTicketRequest $request, CreateTicketAction $action): JsonResponse
    {
        $ticket = $action->execute($request->validated(), auth()->id());

        return response()->json([
            'status' => 'success',
            'message' => 'Ticket created successfully',
            'data' => $ticket
        ], 201);
    }

    public function show(Ticket $ticket): JsonResponse
    {
        // Prevent unauthorized access
        if (!auth()->user()->hasRole(['Root', 'Manajer', 'Supervisor', 'CEO'])) {
            if (auth()->user()->hasRole('Designer') || auth()->user()->hasRole('Videographer')) {
                if ($ticket->assigned_to !== auth()->id()) abort(403);
            } else {
                if ($ticket->requester_id !== auth()->id()) abort(403);
            }
        }

        $ticket->load([
            'category', 
            'requester', 
            'assignedDesigner', 
            'brief', 
            'versions.assetLinks', 
            'revisions', 
            'rating',
            'assetLinks'
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $ticket
        ]);
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket): JsonResponse
    {
        $ticket->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Ticket updated successfully',
            'data' => $ticket
        ]);
    }

    public function assign(AssignTicketRequest $request, Ticket $ticket, AssignTicketAction $action): JsonResponse
    {
        $ticket = $action->execute($ticket, $request->assigned_to);

        return response()->json([
            'status' => 'success',
            'message' => 'Ticket assigned successfully',
            'data' => $ticket
        ]);
    }

    public function updateStatus(UpdateTicketStatusRequest $request, Ticket $ticket): JsonResponse
    {
        $ticket->update(['status' => $request->status]);

        return response()->json([
            'status' => 'success',
            'message' => 'Ticket status updated successfully',
            'data' => $ticket
        ]);
    }

    public function submitOutput(SubmitOutputRequest $request, Ticket $ticket, SubmitOutputAction $action): JsonResponse
    {
        $ticket = $action->execute($ticket, $request->validated(), auth()->id());

        return response()->json([
            'status' => 'success',
            'message' => 'Output submitted successfully',
            'data' => $ticket
        ]);
    }

    public function review(ReviewTicketRequest $request, Ticket $ticket, ReviewTicketAction $action): JsonResponse
    {
        $role = auth()->user()->hasRole(['Manajer', 'Supervisor']) ? 'spv' : 'client';
        $ticket = $action->execute($ticket, $request->validated(), auth()->id(), $role);

        return response()->json([
            'status' => 'success',
            'message' => 'Review submitted successfully',
            'data' => $ticket
        ]);
    }

    public function rate(RateTicketRequest $request, Ticket $ticket, RateTicketAction $action): JsonResponse
    {
        if ($ticket->requester_id !== auth()->id()) {
            abort(403, 'Only requester can rate this ticket.');
        }

        $ticket = $action->execute($ticket, $request->validated(), auth()->id());

        return response()->json([
            'status' => 'success',
            'message' => 'Ticket rated successfully',
            'data' => $ticket
        ]);
    }

    public function aiBriefAnalyze(Ticket $ticket, \App\Services\GeminiService $gemini): JsonResponse
    {
        $brief = $ticket->brief;
        if (!$brief) {
            return response()->json(['status' => 'error', 'message' => 'No brief found'], 404);
        }

        $prompt = "Tolong analisis brief tiket ini:\n\n" .
                  "Tujuan Desain: {$ticket->design_purpose}\n" .
                  "Deskripsi Detail: {$brief->description}\n" .
                  "Target Audiens: {$brief->target_audience}\n" .
                  "Pesan Utama (Key Message): {$brief->key_message}\n\n" .
                  "Berikan ringkasan dan saran visual untuk desainer.";

        try {
            $analysis = $gemini->generateResponse($prompt, 'odds-brief-analyzer');

            $brief->update([
                'ai_summary' => $analysis
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'AI Analysis completed',
                'data' => $analysis
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
