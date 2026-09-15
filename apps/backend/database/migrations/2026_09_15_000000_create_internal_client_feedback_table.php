<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('internal_client_feedback', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('division');
            $table->text('problems')->nullable();
            $table->text('suggestions')->nullable();
            $table->unsignedTinyInteger('satisfaction');
            $table->timestamps();
            $table->index('division');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internal_client_feedback');
    }
};
