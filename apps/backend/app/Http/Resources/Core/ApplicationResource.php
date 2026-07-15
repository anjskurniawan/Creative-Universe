<?php

namespace App\Http\Resources\Core;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'key' => $this->key,
            'name' => $this->name,
            'display_name' => $this->display_name,
            'type' => $this->type,
            'status' => $this->status,
            'frontend_path' => $this->frontend_path,
            'sort_order' => $this->sort_order,
        ];
    }
}
