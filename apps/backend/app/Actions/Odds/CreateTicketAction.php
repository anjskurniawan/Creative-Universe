<?php

namespace App\Actions\Odds;

use App\Models\Odds\DesignCategory;
use App\Models\Odds\Ticket;
use App\Models\Odds\TicketBrief;
use App\Enums\Odds\TicketStatusEnum;
use App\Enums\Odds\SlaStatusEnum;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CreateTicketAction
{
    public function execute(array $data, int $userId): Ticket
    {
        return DB::transaction(function () use ($data, $userId) {
            $category = DesignCategory::findOrFail($data['category_id']);
            
            // Generate ticket number
            $ticketNumber = 'ODDS-' . Carbon::now()->format('dmy') . '-' . str_pad(random_int(1, 999), 3, '0', STR_PAD_LEFT);

            // Determine deadline
            $deadline = isset($data['deadline']) ? Carbon::parse($data['deadline']) : Carbon::now()->addDays($category->sla_days);

            $ticket = Ticket::create([
                'ticket_number' => $ticketNumber,
                'design_purpose' => $data['design_purpose'],
                'requester_id' => $userId,
                'category_id' => $category->id,
                'brand' => $data['brand'],
                'channel' => $data['channel'],
                'important_matrix' => $data['important_matrix'],
                'deadline' => $deadline,
                'status' => TicketStatusEnum::SUBMITTED,
                'sla_status' => SlaStatusEnum::ON_TRACK,
                'created_by' => $userId,
            ]);

            $ticket->brief()->create([
                'description' => $data['description'],
                'target_audience' => $data['target_audience'],
                'key_message' => $data['key_message'],
                'required_outputs' => $data['required_outputs'],
            ]);

            // TODO: Trigger Event/Job for AI Brief Check

            return $ticket->load('brief');
        });
    }
}
