<?php

namespace Database\Seeders;

use App\Models\Core\User;
use App\SubApps\KvRetail\Models\KvRetailTask;
use Illuminate\Database\Seeder;

class KvRetailTaskDemoSeeder extends Seeder
{
    /**
     * Seed repeatable task data for the mobile task-card states.
     */
    public function run(): void
    {
        $manager = User::where('username', 'manajer')->firstOrFail();
        $designer = User::where('username', 'designer')->firstOrFail();
        $spv = User::where('username', 'spv')->firstOrFail();
        $thisMonth = now()->startOfMonth();
        $lastMonth = $thisMonth->copy()->subMonthNoOverflow();

        // Seeder ini sengaja mereset data task agar skenario QA selalu konsisten.
        KvRetailTask::query()->delete();

        $tasks = [
            [
                'task_name' => 'KV Payday Marketplace',
                'pic_vendor' => 'Fushion',
                'task_given_date' => $lastMonth->copy()->addDays(2),
                'deadline_date' => $lastMonth->copy()->addDays(10),
                'status' => 'Done',
                'task_timestamps' => [
                    'ACC Draft' => $lastMonth->copy()->addDays(2)->setTime(10, 0)->format('d/m/Y H:i'),
                    'Progress' => $lastMonth->copy()->addDays(3)->setTime(9, 30)->format('d/m/Y H:i'),
                    'Approve' => $lastMonth->copy()->addDays(4)->setTime(16, 0)->format('d/m/Y H:i'),
                    'Email' => $lastMonth->copy()->addDays(9)->setTime(11, 0)->format('d/m/Y H:i'),
                ],
                'file_link' => 'https://example.com/files/kv-payday-marketplace',
            ],
            [
                'task_name' => 'Hoarding Opening Store Bekasi',
                'pic_vendor' => 'Mireco',
                'task_given_date' => $lastMonth->copy()->addDays(5),
                'deadline_date' => $lastMonth->copy()->addDays(13),
                'status' => 'Done',
                'task_timestamps' => [
                    'ACC Draft' => $lastMonth->copy()->addDays(7)->setTime(10, 0)->format('d/m/Y H:i'),
                    'Progress' => $lastMonth->copy()->addDays(8)->setTime(12, 0)->format('d/m/Y H:i'),
                    'Approve' => $lastMonth->copy()->addDays(10)->setTime(13, 0)->format('d/m/Y H:i'),
                    'Email' => $lastMonth->copy()->addDays(14)->setTime(9, 0)->format('d/m/Y H:i'),
                ],
                'file_link' => 'https://example.com/files/hoarding-bekasi',
                'delay_reasons' => [
                    'ACC Draft' => ['reason' => 'Materi promosi dari vendor terlambat diterima.'],
                    'Kirim Email' => ['reason' => 'Menunggu persetujuan final dari pihak mall.'],
                ],
            ],
            [
                'task_name' => 'Poster Event Komunitas Surabaya',
                'pic_vendor' => 'Fushion',
                'task_given_date' => $lastMonth->copy()->addDays(18),
                'deadline_date' => $lastMonth->copy()->addDays(28),
                'status' => 'ACC Draft',
                'task_timestamps' => ['ACC Draft' => $lastMonth->copy()->addDays(20)->setTime(14, 0)->format('d/m/Y H:i')],
            ],
            [
                'task_name' => 'Mockup Display Retail Semarang',
                'pic_vendor' => 'Mireco',
                'task_given_date' => $lastMonth->copy()->addDays(20),
                'deadline_date' => $thisMonth->copy()->addDays(4),
                'status' => 'Progress Design',
                'task_timestamps' => [
                    'ACC Draft' => $lastMonth->copy()->addDays(20)->setTime(11, 0)->format('d/m/Y H:i'),
                    'Progress' => $lastMonth->copy()->addDays(22)->setTime(15, 0)->format('d/m/Y H:i'),
                ],
                'delay_reasons' => [
                    'ACC Draft' => ['reason' => 'Menunggu aset produk dari tim retail.'],
                ],
            ],
            [
                'task_name' => 'Key Visual Promo Akhir Pekan',
                'pic_vendor' => 'Mireco',
                'task_given_date' => $thisMonth->copy()->addDays(1),
                'deadline_date' => $thisMonth->copy()->addDays(9),
                'status' => '0',
                'task_timestamps' => [],
            ],
            [
                'task_name' => 'Banner Flash Sale Juli',
                'pic_vendor' => 'Fushion',
                'task_given_date' => $thisMonth->copy()->addDays(4),
                'deadline_date' => $thisMonth->copy()->addDays(15),
                'status' => 'ACC Draft',
                'task_timestamps' => ['ACC Draft' => $thisMonth->copy()->addDays(5)->setTime(9, 0)->format('d/m/Y H:i')],
            ],
            [
                'task_name' => 'Konten Sosial Media Anniversary',
                'pic_vendor' => 'Mireco',
                'task_given_date' => $thisMonth->copy()->addDays(6),
                'deadline_date' => $thisMonth->copy()->addDays(18),
                'status' => 'Progress Design',
                'task_timestamps' => [
                    'ACC Draft' => $thisMonth->copy()->addDays(6)->setTime(13, 0)->format('d/m/Y H:i'),
                    'Progress' => $thisMonth->copy()->addDays(7)->setTime(11, 0)->format('d/m/Y H:i'),
                ],
            ],
            [
                'task_name' => 'Final Artwork Booth Jakarta Fair',
                'pic_vendor' => 'Fushion',
                'task_given_date' => $thisMonth->copy()->addDays(8),
                'deadline_date' => $thisMonth->copy()->addDays(20),
                'status' => 'Approval Design',
                'task_timestamps' => [
                    'ACC Draft' => $thisMonth->copy()->addDays(8)->setTime(10, 0)->format('d/m/Y H:i'),
                    'Progress' => $thisMonth->copy()->addDays(9)->setTime(10, 0)->format('d/m/Y H:i'),
                    'Approve' => $thisMonth->copy()->addDays(10)->setTime(15, 0)->format('d/m/Y H:i'),
                ],
            ],
            [
                'task_name' => 'Katalog Produk Agustus',
                'pic_vendor' => 'Mireco',
                'task_given_date' => $thisMonth->copy()->addDays(10),
                'deadline_date' => $thisMonth->copy()->addDays(22),
                'status' => 'Kirim Email',
                'task_timestamps' => [
                    'ACC Draft' => $thisMonth->copy()->addDays(10)->setTime(9, 0)->format('d/m/Y H:i'),
                    'Progress' => $thisMonth->copy()->addDays(11)->setTime(9, 0)->format('d/m/Y H:i'),
                    'Approve' => $thisMonth->copy()->addDays(12)->setTime(10, 0)->format('d/m/Y H:i'),
                ],
            ],
            [
                'task_name' => 'Signage Store Cirebon',
                'pic_vendor' => 'Fushion',
                'task_given_date' => $thisMonth->copy()->addDays(3),
                'deadline_date' => $thisMonth->copy()->addDays(12),
                'status' => '0',
                'task_timestamps' => [],
            ],
        ];

        foreach ($tasks as $attributes) {
            $task = KvRetailTask::create(array_merge([
                'created_by' => $manager->id,
                'support_file_path' => [null, null, null],
                'draft_file_path' => [null, null, null],
                'file_link' => null,
            ], $attributes));

            $task->users()->sync([$designer->id, $spv->id]);
        }
    }
}
