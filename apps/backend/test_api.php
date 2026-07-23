<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/api/v1/odds/tasks', 'GET');
$user = App\Models\Core\User::find(1);
$app->make('auth')->guard('sanctum')->setUser($user);
$request->setUserResolver(function () use ($user) { return $user; });
$response = $kernel->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
