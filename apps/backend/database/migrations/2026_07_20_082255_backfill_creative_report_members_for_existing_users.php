<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\CreativeMember;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ambil semua user_id yang sudah ada di tabel creative_report_members
        $existingUserIds = CreativeMember::pluck('user_id')->filter()->toArray();

        // Temukan user di divisi Creative yang belum ada di member list
        $users = User::whereHas('position.division', function ($query) {
            $query->where('name', 'Creative');
        })
        ->when(!empty($existingUserIds), function ($query) use ($existingUserIds) {
            $query->whereNotIn('id', $existingUserIds);
        })
        ->with('position')
        ->get();

        foreach ($users as $user) {
            $positionName = $user->position?->name ?? 'Staff';
            
            // Skip Manajer dari proses ini
            if ($positionName === 'Manajer') {
                continue;
            }

            // Masukkan ke daftar validasi (PENDING)
            CreativeMember::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'position_id' => $user->position_id,
                'position_name' => $positionName,
                'status' => CreativeMember::STATUS_PENDING,
                'joined_at' => null,
                'resigned_at' => null,
                'reviewed_by' => null,
                'reviewed_at' => null,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tidak perlu drop data pada proses rollback karena data ini adalah data migrasi validasi
    }
};
