<?php

use App\Models\Core\Division;
use App\Models\Core\Position;
use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\CreativeMember;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $creative = Division::firstOrCreate(['name' => 'Creative']);
        $position = $creative->positions()->firstOrCreate(['name' => 'Content Creator']);

        User::query()
            ->whereHas('roles', fn ($query) => $query->where('name', 'Content Creator'))
            ->each(function (User $user) use ($position): void {
                $user->updateQuietly(['position_id' => $position->id]);

                CreativeMember::query()
                    ->where('user_id', $user->id)
                    ->update([
                        'position_id' => $position->id,
                        'position_name' => 'Content Creator',
                    ]);
            });
    }

    public function down(): void
    {
        // Position normalization is intentionally not reverted automatically.
    }
};
