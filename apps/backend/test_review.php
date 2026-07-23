<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();
$request = Illuminate\Http\Request::create('/', 'GET');
$app->instance('request', $request);

$task = App\SubApps\Odds\Models\Task::find(37);
$service = app(App\SubApps\Odds\Services\OddsWorkReviewService::class);
try {
    $service->clientReview($task, ['decision' => 'approved', 'notes' => 'Test'], 1);
    $service->rate($task, ['rating' => 5, 'feedback' => 'Test'], 1);
    echo "SUCCESS\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
