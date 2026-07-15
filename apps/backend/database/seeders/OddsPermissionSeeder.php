<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class OddsPermissionSeeder extends Seeder
{
    public const PERMISSIONS = [
        'access-odds',
        'manage-odds-config',
        'create-odds-tasks',
        'view-own-odds-tasks',
        'view-assigned-odds-tasks',
        'view-all-odds-tasks',
        'review-odds-briefs',
        'manage-odds-queue',
        'request-odds-queue-skip',
        'review-odds-queue-skip',
        'start-odds-tasks',
        'submit-odds-results',
        'review-odds-spv',
        'review-odds-client',
        'request-odds-revisions',
        'approve-odds-extra-revisions',
        'approve-odds-urgent-revisions',
        'cancel-odds-tasks',
        'manage-odds-escalations',
        'view-odds-reports',
        'view-odds-rankings',
        'use-odds-ai',
    ];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (self::PERMISSIONS as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        Role::firstOrCreate(['name' => 'Root'])->givePermissionTo(self::PERMISSIONS);

        foreach (['Manajer', 'Supervisor', 'SPV'] as $roleName) {
            Role::firstOrCreate(['name' => $roleName])->givePermissionTo([
                'access-odds',
                'manage-odds-config',
                'view-all-odds-tasks',
                'review-odds-briefs',
                'manage-odds-queue',
                'review-odds-queue-skip',
                'review-odds-spv',
                'approve-odds-extra-revisions',
                'approve-odds-urgent-revisions',
                'cancel-odds-tasks',
                'manage-odds-escalations',
                'view-odds-reports',
                'view-odds-rankings',
                'use-odds-ai',
            ]);
        }

        foreach (['Designer', 'Videographer'] as $roleName) {
            Role::firstOrCreate(['name' => $roleName])->givePermissionTo([
                'access-odds',
                'view-assigned-odds-tasks',
                'review-odds-briefs',
                'manage-odds-queue',
                'request-odds-queue-skip',
                'start-odds-tasks',
                'submit-odds-results',
                'request-odds-revisions',
                'use-odds-ai',
            ]);
        }

        Role::firstOrCreate(['name' => 'Client'])->givePermissionTo([
            'access-odds',
            'create-odds-tasks',
            'view-own-odds-tasks',
            'review-odds-client',
            'request-odds-revisions',
            'cancel-odds-tasks',
        ]);
    }
}
