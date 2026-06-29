<?php
use App\Models\Core\User;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$count = User::whereNull('division_id')->whereHas('roles', function($q) { 
    $q->where('name', 'Client'); 
})->update(['is_onboarded' => false]);

echo "Updated $count users to is_onboarded = false.\n";
