<?php

namespace Database\Seeders;

use App\Models\Core\Application;
use App\Models\Core\User;
use Illuminate\Database\Seeder;

class ApplicationAccessSeeder extends Seeder
{
    public function run(): void
    {
        $applicationIds = Application::query()->pluck('id', 'key');

        User::query()->with('roles')->each(function (User $user) use ($applicationIds): void {
            $roles = $user->getRoleNames();
            $keys = [];

            if ($roles->contains('Root')) {
                $keys = $applicationIds->keys()->all();
            } else {
                if ($roles->intersect(['Manajer', 'SPV', 'Designer', 'Videographer', 'Client'])->isNotEmpty()) {
                    $keys[] = 'odds';
                }
                if ($roles->intersect(['Manajer', 'SPV', 'Leader Retail', 'PIC Retail'])->isNotEmpty()
                    || $user->kvRetailTasks()->exists()) {
                    $keys[] = 'kv-retail';
                }
                if ($roles->intersect(['Manajer', 'SPV'])->isNotEmpty()) {
                    $keys[] = 'creative-report';
                }
                if ($user->can('access-pricetag')) {
                    $keys[] = 'generator';
                }
            }

            $assignments = collect($keys)
                ->unique()
                ->map(fn (string $key) => $applicationIds->get($key))
                ->filter()
                ->mapWithKeys(fn ($id) => [$id => ['granted_by' => $user->id]])
                ->all();

            $user->applications()->syncWithoutDetaching($assignments);
        });
    }
}
