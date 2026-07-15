<?php

namespace Tests\Feature\Core;

use App\Models\Core\User;
use App\Services\Core\FileStorageService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileStorageServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_renames_files_and_records_complete_metadata(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $upload = UploadedFile::fake()->createWithContent('Brief Campaign Juli.pdf', 'creative universe');

        $stored = app(FileStorageService::class)->store(
            $upload, 'kv-retail', 'tasks', 42, 'references', $user->id, 'public'
        );

        Storage::disk('public')->assertExists($stored->path);
        $this->assertSame('Brief Campaign Juli.pdf', $stored->original_name);
        $this->assertNotSame($stored->original_name, $stored->stored_name);
        $this->assertStringStartsWith('kv-retail/tasks/42/references/', $stored->path);
        $this->assertSame(hash('sha256', 'creative universe'), $stored->checksum_sha256);
        $this->assertDatabaseHas('stored_files', ['path' => $stored->path, 'uploaded_by' => $user->id]);
    }
}
