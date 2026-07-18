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
            // 3 DONE
            [
                'task_name' => 'Done Task 1',
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
                'file_link' => 'https://example.com/files/1',
            ],
            [
                'task_name' => 'Done Task 2',
                'pic_vendor' => 'Mireco',
                'task_given_date' => $lastMonth->copy()->addDays(5),
                'deadline_date' => $lastMonth->copy()->addDays(13),
                'status' => 'Done',
                'task_timestamps' => [
                    'ACC Draft' => $lastMonth->copy()->addDays(5)->setTime(10, 0)->format('d/m/Y H:i'),
                    'Progress' => $lastMonth->copy()->addDays(6)->setTime(12, 0)->format('d/m/Y H:i'),
                    'Approve' => $lastMonth->copy()->addDays(7)->setTime(13, 0)->format('d/m/Y H:i'),
                    'Email' => $lastMonth->copy()->addDays(12)->setTime(9, 0)->format('d/m/Y H:i'),
                ],
                'file_link' => 'https://example.com/files/2',
            ],
            [
                'task_name' => 'Done Task 3',
                'pic_vendor' => 'Fushion',
                'task_given_date' => $lastMonth->copy()->addDays(10),
                'deadline_date' => $lastMonth->copy()->addDays(20),
                'status' => 'Done',
                'task_timestamps' => [
                    'ACC Draft' => $lastMonth->copy()->addDays(10)->setTime(10, 0)->format('d/m/Y H:i'),
                    'Progress' => $lastMonth->copy()->addDays(11)->setTime(12, 0)->format('d/m/Y H:i'),
                    'Approve' => $lastMonth->copy()->addDays(12)->setTime(13, 0)->format('d/m/Y H:i'),
                    'Email' => $lastMonth->copy()->addDays(19)->setTime(9, 0)->format('d/m/Y H:i'),
                ],
                'file_link' => 'https://example.com/files/3',
            ],
            
            // 2 OVERDUE (Progress, deadline_date in the past)
            [
                'task_name' => 'Overdue Task 1',
                'pic_vendor' => 'Mireco',
                'task_given_date' => $lastMonth->copy()->addDays(20),
                'deadline_date' => now()->subDays(2),
                'status' => 'Progress Design',
                'task_timestamps' => [
                    'ACC Draft' => $lastMonth->copy()->addDays(20)->setTime(11, 0)->format('d/m/Y H:i'),
                    'Progress' => $lastMonth->copy()->addDays(21)->setTime(15, 0)->format('d/m/Y H:i'),
                ],
            ],
            [
                'task_name' => 'Overdue Task 2',
                'pic_vendor' => 'Fushion',
                'task_given_date' => $lastMonth->copy()->addDays(22),
                'deadline_date' => now()->subDays(1),
                'status' => 'Approval Design',
                'task_timestamps' => [
                    'ACC Draft' => $lastMonth->copy()->addDays(22)->setTime(10, 0)->format('d/m/Y H:i'),
                    'Progress' => $lastMonth->copy()->addDays(23)->setTime(10, 0)->format('d/m/Y H:i'),
                    'Approve' => $lastMonth->copy()->addDays(24)->setTime(15, 0)->format('d/m/Y H:i'),
                ],
            ],

            // 5 PROGRESS (Not overdue, deadline_date >= now)
            // 3 of these are Bottleneck (ACC Draft late => task_given_date to ACC Draft > 1 day)
            [
                'task_name' => 'Progress Bottleneck 1',
                'pic_vendor' => 'Mireco',
                'task_given_date' => $thisMonth->copy()->addDays(1),
                'deadline_date' => now()->addDays(10),
                'status' => 'Progress Design',
                'task_timestamps' => [
                    'ACC Draft' => $thisMonth->copy()->addDays(4)->setTime(11, 0)->format('d/m/Y H:i'), // > 1 day from task_given
                    'Progress' => $thisMonth->copy()->addDays(4)->setTime(15, 0)->format('d/m/Y H:i'),
                ],
                'delay_reasons' => [
                    'ACC Draft' => ['reason' => 'Vendor lambat merespon.'],
                ],
            ],
            [
                'task_name' => 'Progress Bottleneck 2',
                'pic_vendor' => 'Fushion',
                'task_given_date' => $thisMonth->copy()->addDays(2),
                'deadline_date' => now()->addDays(12),
                'status' => 'Approval Design',
                'task_timestamps' => [
                    'ACC Draft' => $thisMonth->copy()->addDays(5)->setTime(11, 0)->format('d/m/Y H:i'), // > 1 day
                    'Progress' => $thisMonth->copy()->addDays(5)->setTime(15, 0)->format('d/m/Y H:i'),
                    'Approve' => $thisMonth->copy()->addDays(6)->setTime(15, 0)->format('d/m/Y H:i'),
                ],
                'delay_reasons' => [
                    'ACC Draft' => ['reason' => 'Menunggu revisi berkali-kali.'],
                ],
            ],
            [
                'task_name' => 'Progress Bottleneck 3',
                'pic_vendor' => 'Mireco',
                'task_given_date' => $thisMonth->copy()->addDays(3),
                'deadline_date' => now()->addDays(15),
                'status' => 'Kirim Email',
                'task_timestamps' => [
                    'ACC Draft' => $thisMonth->copy()->addDays(6)->setTime(11, 0)->format('d/m/Y H:i'), // > 1 day
                    'Progress' => $thisMonth->copy()->addDays(6)->setTime(15, 0)->format('d/m/Y H:i'),
                    'Approve' => $thisMonth->copy()->addDays(7)->setTime(15, 0)->format('d/m/Y H:i'),
                ],
                'delay_reasons' => [
                    'ACC Draft' => ['reason' => 'Kendala internal tim kreatif.'],
                ],
            ],
            
            // 2 of these are Normal Progress
            [
                'task_name' => 'Progress Normal 1',
                'pic_vendor' => 'Fushion',
                'task_given_date' => now()->subDays(1),
                'deadline_date' => now()->addDays(8),
                'status' => 'ACC Draft',
                'task_timestamps' => [
                    'ACC Draft' => now()->subDays(1)->setTime(10, 0)->format('d/m/Y H:i'), // Same day, not bottleneck
                ],
            ],
            [
                'task_name' => 'Progress Normal 2',
                'pic_vendor' => 'Mireco',
                'task_given_date' => now(),
                'deadline_date' => now()->addDays(14),
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
