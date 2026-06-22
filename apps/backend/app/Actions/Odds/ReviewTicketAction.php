<?php

namespace App\Actions\Odds;

use App\Models\Odds\Ticket;
use App\Enums\Odds\TicketStatusEnum;
use App\Enums\Odds\RevisionTypeEnum;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReviewTicketAction
{
    public function execute(Ticket $ticket, array $data, int $reviewerId, string $reviewerRole = 'spv'): Ticket
    {
        return DB::transaction(function () use ($ticket, $data, $reviewerId, $reviewerRole) {
            $latestVersion = $ticket->versions()->latest('version_number')->first();

            if ($data['action'] === 'approve') {
                if ($reviewerRole === 'spv') {
                    $ticket->update(['status' => TicketStatusEnum::WAITING_CLIENT]);
                    if ($latestVersion) {
                        $latestVersion->update(['status' => TicketStatusEnum::WAITING_CLIENT]);
                    }
                    if ($ticket->requester) {
                        $ticket->requester->notify(new \App\Notifications\Odds\OddsTicketNotification(
                            $ticket,
                            "Desain telah disetujui oleh Supervisor. Menunggu review akhir dari Anda."
                        ));
                    }
                } else {
                    $ticket->update([
                        'status' => TicketStatusEnum::DELIVERED,
                        'approved_at' => Carbon::now(),
                    ]);
                    if ($latestVersion) {
                        $latestVersion->update(['status' => TicketStatusEnum::DELIVERED]);
                    }
                    if ($ticket->assignedDesigner) {
                        $ticket->assignedDesigner->notify(new \App\Notifications\Odds\OddsTicketNotification(
                            $ticket,
                            "Desain telah disetujui (Delivered) oleh Client. Kerja bagus!"
                        ));
                    }
                }
            } else {
                // Reject / Request Revision
                $ticket->revisions()->create([
                    'version_id' => $latestVersion->id ?? null,
                    'requested_by' => $reviewerId,
                    'revision_type' => $reviewerRole === 'spv' ? RevisionTypeEnum::SPV : RevisionTypeEnum::CLIENT,
                    'notes' => $data['notes'],
                    'revision_deadline' => Carbon::parse($data['revision_deadline']),
                    'status' => 'open',
                ]);

                $ticket->update(['status' => TicketStatusEnum::REVISION]);
                if ($latestVersion) {
                    $latestVersion->update(['status' => TicketStatusEnum::REVISION]);
                }
                if ($ticket->assignedDesigner) {
                    $ticket->assignedDesigner->notify(new \App\Notifications\Odds\OddsTicketNotification(
                        $ticket,
                        "Revisi diminta oleh " . ($reviewerRole === 'spv' ? 'Supervisor' : 'Client') . "."
                    ));
                }
            }

            return $ticket->load('revisions');
        });
    }
}
