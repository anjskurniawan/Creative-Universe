<?php

namespace App\Actions\Odds;

use App\Models\Odds\Ticket;
use App\Enums\Odds\TicketStatusEnum;

class AssignTicketAction
{
    public function execute(Ticket $ticket, int $assigneeId): Ticket
    {
        $ticket->update([
            'assigned_to' => $assigneeId,
            'status' => TicketStatusEnum::ASSIGNED,
        ]);

        if ($ticket->assignedDesigner) {
            $ticket->assignedDesigner->notify(new \App\Notifications\Odds\OddsTicketNotification(
                $ticket,
                "Anda telah ditugaskan untuk mengerjakan tiket desain baru."
            ));
        }

        return $ticket;
    }
}
