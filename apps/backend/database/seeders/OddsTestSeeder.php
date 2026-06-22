<?php

namespace Database\Seeders;

use App\Enums\Odds\ImportantMatrixEnum;
use App\Enums\Odds\SlaStatusEnum;
use App\Enums\Odds\TicketStatusEnum;
use App\Models\Core\User;
use App\Models\Odds\DesignCategory;
use App\Models\Odds\Ticket;
use App\Models\Odds\TicketBrief;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OddsTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Dapatkan Kategori
        $category = DesignCategory::where('name', 'FEED IG')->first() ?? DesignCategory::first();

        // 2. Dapatkan Requester & Designer
        $requester = User::role(['Client', 'PIC Retail', 'Manajer'])->first() ?? User::first();
        $designer = User::role(['Designer'])->first();

        if (! $category || ! $requester) {
            return;
        }

        // 3. Buat Ticket
        $ticket = Ticket::create([
            'ticket_number' => 'ODDS-'.Carbon::now()->format('dmy').'-001',
            'design_purpose' => 'Promosi Diskon 50% Akhir Tahun',
            'requester_id' => $requester->id,
            'assigned_to' => $designer ? $designer->id : null,
            'category_id' => $category->id,
            'brand' => 'JETE',
            'channel' => 'Instagram',
            'important_matrix' => ImportantMatrixEnum::QUADRANT_1,
            'deadline' => Carbon::now()->addDays($category->sla_days),
            'status' => $designer ? TicketStatusEnum::ASSIGNED : TicketStatusEnum::SUBMITTED,
            'brief_score' => 85,
            'sla_status' => SlaStatusEnum::ON_TRACK,
            'created_by' => $requester->id,
        ]);

        // 4. Buat Brief
        TicketBrief::create([
            'ticket_id' => $ticket->id,
            'description' => 'Tolong buatkan 3 slide feed Instagram untuk promo akhir tahun. Highlight diskon up to 50% untuk produk TWS dan Headphone.',
            'target_audience' => 'Anak muda, mahasiswa, pekerja kantoran',
            'key_message' => 'Diskon terbesar tahun ini, jangan sampai kehabisan!',
            'required_outputs' => ['3 Feed Post (1080x1080)', 'Source file (PSD)'],
            'ai_summary' => 'Permintaan desain feed IG (3 slide) untuk promo diskon 50% TWS dan Headphone. Audiens: Anak muda/pekerja.',
        ]);
    }
}
