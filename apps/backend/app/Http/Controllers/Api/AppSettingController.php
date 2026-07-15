<?php

namespace App\Http\Controllers\Api;

use App\Models\AppSetting;
use Illuminate\Http\Request;

class AppSettingController extends BaseApiController
{
    public function index(Request $request)
    {
        $keys = $request->query('keys');
        $query = AppSetting::query();

        if ($keys) {
            $keyArray = explode(',', $keys);
            $query->whereIn('key', $keyArray);
        }

        $settings = $query->get()->pluck('value', 'key');

        return $this->sendResponse($settings, 'Pengaturan aplikasi berhasil diambil.');
    }

    public function store(Request $request)
    {
        abort_unless($request->user()?->hasRole(['Root', 'Manajer']), 403);

        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string',
        ]);

        foreach ($data['settings'] as $key => $value) {
            AppSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return $this->sendResponse(null, 'Pengaturan aplikasi berhasil diperbarui.');
    }
}
