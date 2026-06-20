<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    /**
     * Test the health check endpoint returns 200 with standard response structure.
     */
    public function test_health_check_endpoint_returns_success(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Backend service is healthy.',
            'data' => [
                'status' => 'up',
                'environment' => config('app.env'),
                'version' => '1.0.0',
            ]
        ]);
    }

    /**
     * Test a non-existent API route returns standardized JSON HTTP 404 response.
     */
    public function test_non_existent_api_route_returns_json_404(): void
    {
        $response = $this->getJson('/api/v1/non-existent-route');

        $response->assertStatus(404);
        $response->assertJson([
            'success' => false,
            'message' => 'Resource tidak ditemukan.',
        ]);
    }
}
