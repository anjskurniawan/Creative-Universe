<?php

namespace App\Actions\Odds;

use App\Models\Odds\Ticket;
use App\Enums\Odds\TicketStatusEnum;
use Illuminate\Support\Facades\DB;

class SubmitOutputAction
{
    public function execute(Ticket $ticket, array $data, int $userId): Ticket
    {
        return DB::transaction(function () use ($ticket, $data, $userId) {
            $currentVersion = $ticket->versions()->max('version_number') ?? 0;

            $version = $ticket->versions()->create([
                'version_number' => $currentVersion + 1,
                'submitted_by' => $userId,
                'status' => TicketStatusEnum::WAITING_SPV,
                'notes' => $data['notes'] ?? null,
            ]);

            // Save asset link using morphMany relationship
            $version->assetLinks()->create([
                'url' => $data['asset_url'],
                'type' => 'output_design',
            ]);

            $ticket->update([
                'status' => TicketStatusEnum::WAITING_SPV,
            ]);

            // Notify SPV
            $supervisors = \App\Models\Core\User::role(['Supervisor', 'Manajer'])->get();
            foreach ($supervisors as $spv) {
                $spv->notify(new \App\Notifications\Odds\OddsTicketNotification(
                    $ticket,
                    "Hasil desain telah disubmit oleh Designer. Menunggu review Anda."
                ));
            }

            return $ticket->load('versions.assetLinks');
        });
    }
}
