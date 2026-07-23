<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$u = App\Models\Core\User::find(4);
$u->notify(new App\Notifications\Odds\OddsWorkflowNotification('test', 'Test', 'This is a test from Antigravity.'));
echo "Sent\n";
