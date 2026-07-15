<?php

namespace App\Http\Resources\Core;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = is_array($this->data) ? $this->data : [];
        $url = $this->normalizeUrl($data['url'] ?? null);

        return [
            'id' => $this->id,
            'type' => class_basename($this->type),
            'message' => (string) ($data['message'] ?? 'Notifikasi baru.'),
            'url' => $url,
            'is_read' => $this->read_at !== null,
            'read_at' => $this->read_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }

    private function normalizeUrl(mixed $url): ?string
    {
        if (! is_string($url) || $url === '') {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH);
        $query = parse_url($url, PHP_URL_QUERY);

        if (! is_string($path) || ! str_starts_with($path, '/')) {
            return null;
        }

        return is_string($query) && $query !== '' ? "{$path}?{$query}" : $path;
    }
}
