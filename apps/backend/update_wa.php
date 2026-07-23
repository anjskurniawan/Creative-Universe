<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$u = App\Models\Core\User::where('username', 'anjas-designer')->first();
if ($u) {
    $u->whatsapp_number = '0895809462040';
    $u->save();
    echo "Updated number to: " . $u->whatsapp_number . "\n";
} else {
    echo "User not found.\n";
}
