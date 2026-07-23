<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$token = config('services.fonnte.token', '');
$sender = config('services.fonnte.sender', '');

$target = '0895809462040'; // the one user asked
$message = 'Test from script with 08 prefix';

$response = Illuminate\Support\Facades\Http::withHeaders([
    'Authorization' => $token,
])->post("https://api.fonnte.com/send", [
    'target' => $target,
    'message' => $message,
    'sender' => $sender,
]);

echo "Response Body: " . $response->body() . "\n";
