<?php

namespace App\Services\Core;

use App\Models\Core\StoredFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class FileStorageService
{
    /** @return array{relative_path: string, absolute_path: string} */
    public function temporaryLocalPath(
        string $applicationKey,
        string $contextType,
        string|int $contextId,
        string $category,
        string $extension,
    ): array {
        $directory = collect(['temporary', $applicationKey, $contextType, $contextId, $category])
            ->map(fn ($segment) => Str::slug((string) $segment))
            ->implode('/');
        $storedName = Str::ulid().'.'.strtolower(ltrim($extension, '.'));
        $relativePath = $directory.'/'.$storedName;
        $absolutePath = storage_path('app/private/'.$relativePath);

        if (! is_dir(dirname($absolutePath))) {
            mkdir(dirname($absolutePath), 0755, true);
        }

        return ['relative_path' => $relativePath, 'absolute_path' => $absolutePath];
    }

    public function store(
        UploadedFile $file,
        string $applicationKey,
        string $contextType,
        string|int|null $contextId,
        string $category,
        ?int $uploadedBy,
        ?string $visibility = null,
    ): StoredFile {
        $visibility ??= config('file-storage.default_visibility', 'public');
        $disk = $visibility === 'private'
            ? config('file-storage.private_disk', 'local')
            : config('file-storage.public_disk', 'public');
        $extension = strtolower($file->extension() ?: $file->getClientOriginalExtension());
        $storedName = (string) Str::ulid().($extension ? '.'.$extension : '');
        $directory = collect([$applicationKey, $contextType, $contextId, $category])
            ->filter(fn ($segment) => $segment !== null && $segment !== '')
            ->map(fn ($segment) => Str::slug((string) $segment))
            ->implode('/');
        $path = $directory.'/'.$storedName;
        $checksum = hash_file('sha256', $file->getRealPath());

        if (! Storage::disk($disk)->putFileAs($directory, $file, $storedName, ['visibility' => $visibility])) {
            throw new RuntimeException('File gagal disimpan.');
        }

        try {
            return DB::transaction(fn () => StoredFile::create([
                'application_key' => $applicationKey,
                'context_type' => $contextType,
                'context_id' => $contextId,
                'category' => $category,
                'disk' => $disk,
                'visibility' => $visibility,
                'original_name' => $file->getClientOriginalName(),
                'stored_name' => $storedName,
                'path' => $path,
                'path_hash' => hash('sha256', $path),
                'mime_type' => $file->getMimeType(),
                'extension' => $extension ?: null,
                'size' => $file->getSize(),
                'checksum_sha256' => $checksum,
                'uploaded_by' => $uploadedBy,
            ]));
        } catch (Throwable $exception) {
            Storage::disk($disk)->delete($path);
            throw $exception;
        }
    }

    public function deleteByPath(string $path, ?string $fallbackDisk = null): void
    {
        $metadata = StoredFile::where('path', $path)->first();
        $disk = $metadata?->disk ?? $fallbackDisk ?? config('file-storage.public_disk', 'public');

        Storage::disk($disk)->delete($path);
        $metadata?->delete();
    }

    public function relocate(
        string $path,
        string $applicationKey,
        string $contextType,
        string|int $contextId,
        string $category,
        ?int $uploadedBy,
        string $disk = 'public',
    ): string {
        $metadata = StoredFile::where('path', $path)->first();
        $disk = $metadata?->disk ?? $disk;
        $storedName = $metadata?->stored_name ?? basename($path);
        $directory = collect([$applicationKey, $contextType, $contextId, $category])
            ->map(fn ($segment) => Str::slug((string) $segment))
            ->implode('/');
        $newPath = $directory.'/'.$storedName;

        if ($path !== $newPath && ! Storage::disk($disk)->move($path, $newPath)) {
            throw new RuntimeException('File gagal dipindahkan ke konteks final.');
        }

        if ($metadata) {
            $metadata->update([
                'application_key' => $applicationKey,
                'context_type' => $contextType,
                'context_id' => $contextId,
                'category' => $category,
                'path' => $newPath,
                'path_hash' => hash('sha256', $newPath),
            ]);
        } else {
            $absolutePath = Storage::disk($disk)->path($newPath);
            StoredFile::create([
                'application_key' => $applicationKey,
                'context_type' => $contextType,
                'context_id' => $contextId,
                'category' => $category,
                'disk' => $disk,
                'visibility' => 'public',
                'original_name' => $storedName,
                'stored_name' => $storedName,
                'path' => $newPath,
                'path_hash' => hash('sha256', $newPath),
                'mime_type' => Storage::disk($disk)->mimeType($newPath) ?: null,
                'extension' => pathinfo($storedName, PATHINFO_EXTENSION) ?: null,
                'size' => Storage::disk($disk)->size($newPath),
                'checksum_sha256' => hash_file('sha256', $absolutePath),
                'uploaded_by' => $uploadedBy,
            ]);
        }

        return $newPath;
    }
}
