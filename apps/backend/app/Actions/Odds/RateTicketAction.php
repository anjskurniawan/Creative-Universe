<?php

namespace App\Actions\Odds;

use App\Models\Odds\Ticket;
use App\Enums\Odds\TicketStatusEnum;
use Illuminate\Support\Facades\DB;

class RateTicketAction
{
    public function execute(Ticket $ticket, array $data, int $raterId): Ticket
    {
        return DB::transaction(function () use ($ticket, $data, $raterId) {
            $overall = ($data['quality_score'] + $data['speed_score'] + $data['communication_score']) / 3.0;

            $ticket->rating()->create([
                'rater_id' => $raterId,
                'quality_score' => $data['quality_score'],
                'speed_score' => $data['speed_score'],
                'communication_score' => $data['communication_score'],
                'overall_score' => $overall,
                'feedback' => $data['feedback'] ?? null,
            ]);

            $ticket->update(['status' => TicketStatusEnum::COMPLETED]);

            if ($ticket->assignedDesigner) {
                $ticket->assignedDesigner->notify(new \App\Notifications\Odds\OddsTicketNotification(
                    $ticket,
                    "Tiket telah diberi rating ({$overall} bintang). Tiket Selesai."
                ));
            }

            return $ticket->load('rating');
        });
    }
}
