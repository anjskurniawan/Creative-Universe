<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stored_files', function (Blueprint $table) {
            $table->id();
            $table->string('application_key', 80)->index();
            $table->string('context_type', 120);
            $table->string('context_id', 120)->nullable();
            $table->string('category', 80);
            $table->string('disk', 80);
            $table->string('visibility', 20)->default('public');
            $table->string('original_name', 500);
            $table->string('stored_name', 255);
            $table->string('path', 1000);
            $table->string('path_hash', 64)->unique();
            $table->string('mime_type', 255)->nullable();
            $table->string('extension', 30)->nullable();
            $table->unsignedBigInteger('size');
            $table->string('checksum_sha256', 64);
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['application_key', 'context_type', 'context_id'], 'stored_files_context_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stored_files');
    }
};
