<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\Request;

class AppSettingController extends Controller
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
        return response()->json($settings);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string'
        ]);

        foreach ($data['settings'] as $key => $value) {
            AppSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
