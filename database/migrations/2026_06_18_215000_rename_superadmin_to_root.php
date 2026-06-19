<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('roles')) {
            DB::table('roles')
                ->where('name', 'Superadmin')
                ->update(['name' => 'Root']);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('roles')) {
            DB::table('roles')
                ->where('name', 'Root')
                ->update(['name' => 'Superadmin']);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
