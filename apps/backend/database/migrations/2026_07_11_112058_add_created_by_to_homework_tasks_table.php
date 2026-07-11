<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('homework_tasks', function (Blueprint $table) {
            $table->foreignId('created_by')->nullable()->constrained('users')->cascadeOnDelete();
        });

        // Backfill existing tasks with a Manajer user
        $managerId = \DB::table('users')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->where('roles.name', 'Manajer')
            ->where('model_has_roles.model_type', \App\Models\Core\User::class)
            ->value('users.id') ?? 1;

        \DB::table('homework_tasks')->update(['created_by' => $managerId]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('homework_tasks', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn('created_by');
        });
    }
};
