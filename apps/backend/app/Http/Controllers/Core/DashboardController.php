<?php

namespace App\Http\Controllers\Core;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * DashboardController — SRD v6.2
 *
 * Data statistik dikelola oleh Livewire DashboardStats component.
 */
class DashboardController extends Controller
{
    public function index(Request $request): View
    {
        return view('pages.core.dashboard');
    }
}
