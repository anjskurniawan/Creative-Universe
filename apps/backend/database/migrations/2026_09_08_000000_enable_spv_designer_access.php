<?php

use Database\Seeders\SpvDesignerAccessSeeder;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        (new SpvDesignerAccessSeeder)->run();
    }

    public function down(): void
    {
        // Preserve permissions and profiles that may already own assigned work.
    }
};
