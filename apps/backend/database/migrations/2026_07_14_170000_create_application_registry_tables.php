<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('name');
            $table->string('display_name');
            $table->string('type')->default('sub_app');
            $table->string('status')->default('active');
            $table->string('frontend_path')->nullable();
            $table->string('api_prefix')->nullable();
            $table->string('table_prefix')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('application_user', function (Blueprint $table) {
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('granted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->primary(['application_id', 'user_id']);
        });

        Schema::create('permission_metadata', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permission_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('application_id')->nullable()->constrained()->nullOnDelete();
            $table->string('display_name');
            $table->string('group_key')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->unsignedInteger('authority_level')->default(0)->after('guard_name');
        });
    }

    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('authority_level');
        });

        Schema::dropIfExists('permission_metadata');
        Schema::dropIfExists('application_user');
        Schema::dropIfExists('applications');
    }
};
