<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StoredFile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'application_key', 'context_type', 'context_id', 'category',
        'disk', 'visibility', 'original_name', 'stored_name', 'path', 'path_hash',
        'mime_type', 'extension', 'size', 'checksum_sha256', 'uploaded_by',
    ];

    protected $casts = [
        'context_id' => 'integer',
        'size' => 'integer',
        'uploaded_by' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saving(function (StoredFile $file): void {
            if ($file->isDirty('path') || blank($file->path_hash)) {
                $file->path_hash = hash('sha256', (string) $file->path);
            }
        });
    }
}
