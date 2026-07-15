<?php

namespace Database\Seeders;

use App\Models\Core\Division;
use App\Models\Core\Position;
use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\Assessment;
use App\SubApps\CreativeReport\Models\ReportGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CreativeReportDemoSeeder extends Seeder
{
    public function run(): void
    {
        $creative = Division::firstOrCreate(['name' => 'Creative']);
        $positions = ['SPV' => Position::firstOrCreate(['division_id' => $creative->id, 'name' => 'SPV']), 'Videographer' => Position::firstOrCreate(['division_id' => $creative->id, 'name' => 'Videographer']), 'Designer' => Position::firstOrCreate(['division_id' => $creative->id, 'name' => 'Designer'])];
        $staffGroups = [
            ['Supervisor Creative Production', 'SPV', ['Raka Pradana']],
            ['Creative Video Production', 'Videographer', ['Bagas Pratama', 'Dimas Saputra', 'Fajar Nugroho', 'Galang Mahendra', 'Yoga Firmansyah']],
            ['Creative Design Production', 'Designer', ['Alya Putri', 'Citra Lestari', 'Dinda Maharani', 'Farhan Akbar', 'Gita Savitri', 'Hanif Ramadhan', 'Intan Permata', 'Kevin Aditya', 'Laras Wulandari', 'Nadia Prameswari', 'Rafi Kurniawan', 'Salsa Azzahra', 'Tio Prasetyo']],
        ];
        $groups = collect($staffGroups)->mapWithKeys(fn ($item, $index) => [$item[0] => ReportGroup::updateOrCreate(['name' => $item[0]], ['sort_order' => $index + 1])]);
        $periods = collect(range(0, 2))->map(fn (int $monthsAgo) => now()->startOfMonth()->subMonths($monthsAgo));
        foreach ($staffGroups as [$groupName, $position, $staffNames]) {
            foreach ($staffNames as $index => $staffName) {
                $number = $index + 1;
                $username = 'creative-'.str($groupName)->slug()->append('-'.$number);
                $user = User::updateOrCreate(['username' => $username], ['name' => $staffName, 'email' => $username.'@creativeuniverse.test', 'password' => Hash::make('admin'), 'division_id' => $creative->id, 'position_id' => $positions[$position]->id, 'is_onboarded' => true]);
                $user->syncRoles([Role::findOrCreate($position)]);
                foreach ($periods as $period) {
                    $entropy = (int) sprintf('%u', crc32($username.'-'.$period->format('Y-m')));
                    $creativeScores = [
                        $entropy % 7, intdiv($entropy, 7) % 7, intdiv($entropy, 49) % 7, intdiv($entropy, 343) % 7, intdiv($entropy, 2401) % 7,
                        intdiv($entropy, 16807) % 11, intdiv($entropy, 184877) % 11, intdiv($entropy, 2033647) % 11, intdiv($entropy, 22370117) % 11, intdiv($entropy, 246071287) % 11,
                    ];
                    Assessment::updateOrCreate(['user_id' => $user->id, 'period' => $period->toDateString()], ['creative_report_group_id' => $groups[$groupName]->id, 'creative_scores' => $creativeScores, 'leave_count' => intdiv($entropy, 13) % 4, 'absence_count' => intdiv($entropy, 17) % 3, 'late_count' => intdiv($entropy, 23) % 4, 'status' => $number % 4 === 0 ? Assessment::STATUS_COMPLETED : Assessment::STATUS_DRAFT]);
                }
            }
        }
    }
}
