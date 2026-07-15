<?php

namespace Database\Seeders;

use App\Models\Core\Application;
use App\Models\Core\PermissionMetadata;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ApplicationRegistrySeeder extends Seeder
{
    public function run(): void
    {
        $applications = [
            ['key' => 'core', 'name' => 'Core', 'display_name' => 'Core', 'type' => 'core', 'status' => 'active', 'frontend_path' => '/dashboard', 'api_prefix' => '/api/v1', 'table_prefix' => null, 'sort_order' => 10],
            ['key' => 'kv-retail', 'name' => 'KV Retail Task', 'display_name' => 'KV Retail Task', 'type' => 'sub_app', 'status' => 'active', 'frontend_path' => '/kv-retail', 'api_prefix' => '/api/v1/kv-retail', 'table_prefix' => 'kv_retail_', 'sort_order' => 20],
            ['key' => 'creative-report', 'name' => 'Creative Report', 'display_name' => 'Creative Report', 'type' => 'sub_app', 'status' => 'active', 'frontend_path' => '/creative-report', 'api_prefix' => '/api/v1/creative-reports', 'table_prefix' => 'creative_report_', 'sort_order' => 30],
            ['key' => 'odds', 'name' => 'One Dashboard Design System', 'display_name' => 'One Dashboard Design System', 'type' => 'sub_app', 'status' => 'active', 'frontend_path' => '/odds', 'api_prefix' => '/api/v1/odds', 'table_prefix' => 'odds_', 'sort_order' => 40],
            ['key' => 'generator', 'name' => 'Generator', 'display_name' => 'Generator', 'type' => 'sub_app', 'status' => 'active', 'frontend_path' => '/generator', 'api_prefix' => '/api/v1/generator', 'table_prefix' => 'generator_', 'sort_order' => 50],
            ['key' => 'cai', 'name' => 'Creative Artificial Intelligence', 'display_name' => 'Creative AI', 'type' => 'sub_app', 'status' => 'experimental', 'frontend_path' => '/creative-ai', 'api_prefix' => '/api/v1/cai', 'table_prefix' => 'cai_', 'sort_order' => 60],
            ['key' => 'design-assets', 'name' => 'Design Assets', 'display_name' => 'Design Assets', 'type' => 'sub_app', 'status' => 'experimental', 'frontend_path' => '/design-assets', 'api_prefix' => '/api/v1/design-assets', 'table_prefix' => 'design_assets_', 'sort_order' => 70],
        ];

        foreach ($applications as $application) {
            Application::updateOrCreate(['key' => $application['key']], $application);
        }

        Role::where('name', 'Root')->update(['authority_level' => 100]);
        Role::where('name', 'Manajer')->update(['authority_level' => 80]);
        Role::where('name', 'SPV')->update(['authority_level' => 60]);

        $this->seedPermissionMetadata();
    }

    private function seedPermissionMetadata(): void
    {
        $aliases = [
            'access-core' => ['core', 'Akses Core', 'access'],
            'manage-users' => ['core', 'Kelola Pengguna', 'users'],
            'manage-roles' => ['core', 'Kelola Role & Permission', 'roles'],
            'approve-users' => ['core', 'Setujui Pengguna', 'users'],
            'view-logs' => ['core', 'Lihat Log Aktivitas', 'audit'],
            'run-artisan' => ['core', 'Jalankan Maintenance', 'maintenance'],
            'access-cai' => ['cai', 'Akses Creative AI', 'access'],
            'access-pricetag' => ['generator', 'Akses Pricetag Generator', 'pricetag'],
            'pricetag.manage' => ['generator', 'Kelola Pricetag Generator', 'pricetag'],
            'kv-retail.tasks.view' => ['kv-retail', 'Melihat Tugas KV Retail', 'tasks'],
            'kv-retail.tasks.create' => ['kv-retail', 'Membuat Tugas KV Retail', 'tasks'],
            'kv-retail.tasks.update-status' => ['kv-retail', 'Memperbarui Status Tugas KV Retail', 'tasks'],
            'kv-retail.tasks.delete' => ['kv-retail', 'Menghapus Tugas KV Retail', 'tasks'],
            'kv-retail.settings.manage' => ['kv-retail', 'Mengelola Pengaturan KV Retail', 'settings'],
            'creative-report.assessments.view' => ['creative-report', 'Melihat Penilaian Creative', 'assessments'],
            'creative-report.assessments.update' => ['creative-report', 'Mengisi Penilaian Creative', 'assessments'],
        ];

        foreach (OddsPermissionSeeder::PERMISSIONS as $permissionName) {
            $displayNames = [
                'request-odds-queue-skip' => 'Mengajukan Skip Antrean ODDS',
                'review-odds-queue-skip' => 'Meninjau Skip Antrean ODDS',
            ];
            $aliases[$permissionName] = [
                'odds',
                $displayNames[$permissionName] ?? str($permissionName)->replace('-', ' ')->title()->toString(),
                'odds',
            ];
        }

        foreach ($aliases as $permissionName => [$applicationKey, $displayName, $groupKey]) {
            $permission = Permission::where('name', $permissionName)->first();
            $application = Application::where('key', $applicationKey)->first();

            if (! $permission || ! $application) {
                continue;
            }

            PermissionMetadata::updateOrCreate(
                ['permission_id' => $permission->id],
                [
                    'application_id' => $application->id,
                    'display_name' => $displayName,
                    'group_key' => $groupKey,
                ],
            );
        }
    }
}
