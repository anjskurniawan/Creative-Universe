<?php

use App\Models\Core\User;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$count = User::whereNull('division_id')->whereHas('roles', function ($q) {
    $q->where('name', 'Client');
})->update(['is_onboarded' => false]);

echo "Updated $count users to is_onboarded = false.\n";
