<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;

class SettingController extends Controller
{
    /**
     * GET /api/settings
     */
    public function index()
    {
        $settings = Setting::all()->groupBy('group')->map(fn($items) =>
        $items->pluck('value', 'key')
        );

        return response()->json(['data' => $settings]);
    }
}
