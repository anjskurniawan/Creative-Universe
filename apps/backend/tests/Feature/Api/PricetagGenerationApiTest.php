<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Jobs\Pricetag\GeneratePricetagChunkJob;
use App\Models\Core\AssetLink;
use App\Models\Core\User;
use App\Models\Pricetag\PricetagBatch;
use App\Models\Pricetag\PricetagCategory;
use App\Models\Pricetag\PricetagProduct;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PricetagGenerationApiTest extends TestCase
{
    use RefreshDatabase;

    private User $root;
    private User $designer1;
    private User $designer2;
    private PricetagCategory $category;
    private PricetagProduct $product;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup Spatie permissions
        Permission::firstOrCreate(['name' => 'access-core']);
        Permission::firstOrCreate(['name' => 'access-pricetag']);
        Permission::firstOrCreate(['name' => 'pricetag.manage']);

        $rootRole = Role::firstOrCreate(['name' => 'Root']);
        $rootRole->syncPermissions(['access-core', 'access-pricetag', 'pricetag.manage']);

        $designerRole = Role::firstOrCreate(['name' => 'Designer']);
        $designerRole->syncPermissions(['access-core', 'access-pricetag']);

        // Create users
        $this->root = User::create([
            'name' => 'Root User',
            'username' => 'root_api_test',
            'email' => 'root@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        $this->root->assignRole('Root');

        $this->designer1 = User::create([
            'name' => 'Designer One',
            'username' => 'designer1_api_test',
            'email' => 'des1@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        $this->designer1->assignRole('Designer');

        $this->designer2 = User::create([
            'name' => 'Designer Two',
            'username' => 'designer2_api_test',
            'email' => 'des2@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        $this->designer2->assignRole('Designer');

        // Create category and product
        $this->category = PricetagCategory::create([
            'name' => 'Audio',
            'created_by' => $this->root->id,
        ]);

        $this->product = PricetagProduct::create([
            'category_id' => $this->category->id,
            'name' => 'JETE TWS T10',
            'variant_name' => 'Default',
            'normal_price' => 399000,
            'discount_price' => 199000,
            'created_by' => $this->root->id,
        ]);
    }

    public function test_guest_cannot_access_generation_endpoints(): void
    {
        $this->postJson('/api/v1/pricetag/generations/single', [])->assertStatus(401);
        $this->postJson('/api/v1/pricetag/generations/checklist', [])->assertStatus(401);
        $this->postJson('/api/v1/pricetag/generations/csv', [])->assertStatus(401);
        $this->getJson('/api/v1/pricetag/batches')->assertStatus(401);
    }

    public function test_unauthorized_user_cannot_access_generation_endpoints(): void
    {
        $unauthorized = User::create([
            'name' => 'Pending User',
            'username' => 'pending_api_test',
            'email' => 'pending@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        // No roles, hence no access-pricetag
        $this->actingAs($unauthorized);

        $this->postJson('/api/v1/pricetag/generations/single', [])->assertStatus(403);
    }

    public function test_single_generation_success(): void
    {
        $this->actingAs($this->designer1);

        Http::fake([
            '*' => Http::response([
                'status' => 'success',
                'file_url' => 'https://drive.google.com/file/d/test_view_id/view',
                'download_url' => 'https://drive.google.com/uc?export=download&id=test_view_id',
            ], 200),
        ]);

        $response = $this->postJson('/api/v1/pricetag/generations/single', [
            'product_id' => $this->product->id,
            'discount_price' => 150000,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.discount_price', 150000)
            ->assertJsonPath('data.is_ready', true)
            ->assertJsonPath('data.preview_url', 'https://drive.google.com/file/d/test_view_id/view');

        $this->assertDatabaseHas('pricetag_batches', [
            'batch_name' => 'JETE TWS T10',
            'status' => 'completed',
            'total_items' => 1,
            'processed_items' => 1,
            'created_by' => $this->designer1->id,
        ]);

        $this->assertDatabaseHas('pricetag_batch_items', [
            'product_id' => $this->product->id,
            'status' => 'success',
        ]);
    }

    public function test_single_generation_validation_error(): void
    {
        $this->actingAs($this->designer1);

        $response = $this->postJson('/api/v1/pricetag/generations/single', [
            'product_id' => 99999, // Unknown
            'discount_price' => -100, // Invalid
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['product_id', 'discount_price']);
    }

    public function test_checklist_generation_creates_batch_and_dispatches_job(): void
    {
        $this->actingAs($this->designer1);
        Queue::fake();

        $response = $this->postJson('/api/v1/pricetag/generations/checklist', [
            'batch_name' => 'Checklist Batch Test',
            'items' => [
                ['product_id' => $this->product->id, 'discount_price' => 165000],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.batch_name', 'Pritag #1')
            ->assertJsonPath('data.total_items', 1)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('pricetag_batches', [
            'batch_name' => 'Pritag #1',
            'status' => 'pending',
            'created_by' => $this->designer1->id,
        ]);

        $this->assertDatabaseHas('pricetag_batch_items', [
            'product_id' => $this->product->id,
            'status' => 'pending',
        ]);

        Queue::assertPushed(GeneratePricetagChunkJob::class);
    }

    public function test_csv_generation_success(): void
    {
        $this->actingAs($this->designer1);
        Queue::fake();

        // Create CSV content matching our product
        $csvContent = "kategori,produk,variant,harga normal,harga diskon\n";
        $csvContent .= "{$this->category->name},{$this->product->name},{$this->product->variant_name},{$this->product->normal_price},145000\n";

        $file = UploadedFile::fake()->createWithContent('pricetags.csv', $csvContent);

        $response = $this->postJson('/api/v1/pricetag/generations/csv', [
            'batch_name' => 'CSV Batch Test',
            'file' => $file,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.batch_name', 'CSV #1')
            ->assertJsonPath('data.total_items', 1);

        Queue::assertPushed(GeneratePricetagChunkJob::class);
    }

    public function test_csv_generation_invalid_product_rejection(): void
    {
        $this->actingAs($this->designer1);

        $csvContent = "kategori,produk,variant,harga normal,harga diskon\n";
        $csvContent .= "Audio,Unknown Product,Default,199000,145000\n";

        $file = UploadedFile::fake()->createWithContent('pricetags.csv', $csvContent);

        $response = $this->postJson('/api/v1/pricetag/generations/csv', [
            'batch_name' => 'CSV Invalid Test',
            'file' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['file']]);
    }

    public function test_history_list_ownership_filtering(): void
    {
        // Create batch for designer 1
        $batch1 = PricetagBatch::create([
            'batch_name' => 'Batch Des 1',
            'status' => 'pending',
            'total_items' => 1,
            'created_by' => $this->designer1->id,
        ]);

        // Create batch for designer 2
        $batch2 = PricetagBatch::create([
            'batch_name' => 'Batch Des 2',
            'status' => 'pending',
            'total_items' => 1,
            'created_by' => $this->designer2->id,
        ]);

        // 1. Designer 1 should only see Batch 1
        $this->actingAs($this->designer1);
        $response1 = $this->getJson('/api/v1/pricetag/batches');
        $response1->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.batch_name', 'Batch Des 1');

        // 2. Root should see both batches
        $this->actingAs($this->root);
        $response2 = $this->getJson('/api/v1/pricetag/batches');
        $response2->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_batch_detail_authorization(): void
    {
        $batch = PricetagBatch::create([
            'batch_name' => 'Batch Des 1',
            'status' => 'pending',
            'total_items' => 1,
            'created_by' => $this->designer1->id,
        ]);

        // Designer 1 can access
        $this->actingAs($this->designer1);
        $this->getJson("/api/v1/pricetag/batches/{$batch->id}")->assertStatus(200);

        // Designer 2 cannot access
        $this->actingAs($this->designer2);
        $this->getJson("/api/v1/pricetag/batches/{$batch->id}")->assertStatus(403);

        // Root can access
        $this->actingAs($this->root);
        $this->getJson("/api/v1/pricetag/batches/{$batch->id}")->assertStatus(200);
    }

    public function test_broadcast_channel_authorization(): void
    {
        config([
            'broadcasting.default' => 'pusher',
            'broadcasting.connections.pusher.key' => 'test-key',
            'broadcasting.connections.pusher.secret' => 'test-secret',
            'broadcasting.connections.pusher.app_id' => 'test-app',
        ]);
        Broadcast::setDefaultDriver('pusher');
        Broadcast::purge('pusher');
        Broadcast::channel('pricetag-batch.{batchId}', function (User $user, int $batchId): bool {
            $batch = \App\Models\Pricetag\PricetagBatch::find($batchId);
            return $batch && ($user->id === (int) $batch->created_by || $user->hasRole('Root'));
        });

        $batch = PricetagBatch::create([
            'batch_name' => 'Batch Des 1',
            'status' => 'pending',
            'total_items' => 1,
            'created_by' => $this->designer1->id,
        ]);

        $channelName = "pricetag-batch.{$batch->id}";
        
        // Broadcast authorize route check
        $this->actingAs($this->designer1);
        $response1 = $this->postJson('/broadcasting/auth', [
            'channel_name' => "private-{$channelName}",
            'socket_id' => '123.456',
        ]);
        $response1->assertStatus(200);

        $this->actingAs($this->designer2);
        $response2 = $this->postJson('/broadcasting/auth', [
            'channel_name' => "private-{$channelName}",
            'socket_id' => '123.456',
        ]);
        $response2->assertStatus(403);

        $this->actingAs($this->root);
        $response3 = $this->postJson('/broadcasting/auth', [
            'channel_name' => "private-{$channelName}",
            'socket_id' => '123.456',
        ]);
        $response3->assertStatus(200);
    }

    public function test_batch_download_zip_success(): void
    {
        if (! class_exists('ZipArchive')) {
            $this->markTestSkipped('ZipArchive extension is not loaded.');
        }

        $this->actingAs($this->designer1);

        $batch = PricetagBatch::create([
            'batch_name' => 'Batch Des 1 ZIP',
            'status' => 'completed',
            'total_items' => 1,
            'processed_items' => 1,
            'created_by' => $this->designer1->id,
        ]);

        $batch->items()->create([
            'product_id' => $this->product->id,
            'status' => 'success',
        ]);

        AssetLink::create([
            'linkable_type' => PricetagProduct::class,
            'linkable_id' => $this->product->id,
            'provider' => 'google_drive',
            'label' => 'Google Drive View Link',
            'url' => 'https://drive.google.com/file/d/test_view_id/view',
            'created_by' => $this->designer1->id,
        ]);

        Http::fake([
            'https://drive.google.com/uc*' => Http::response('dummy image data', 200, [
                'Content-Type' => 'image/jpeg',
            ]),
        ]);

        $response = $this->get("/api/v1/pricetag/batches/{$batch->id}/download");
        $response->assertStatus(200);
        $this->assertTrue(str_contains($response->headers->get('Content-Type'), 'application/zip'));
    }

    public function test_batch_download_zip_authorization(): void
    {
        $batch = PricetagBatch::create([
            'batch_name' => 'Batch Des 1 ZIP Auth',
            'status' => 'completed',
            'total_items' => 1,
            'processed_items' => 1,
            'created_by' => $this->designer1->id,
        ]);

        // Designer 2 cannot download Designer 1's ZIP
        $this->actingAs($this->designer2);
        $this->get("/api/v1/pricetag/batches/{$batch->id}/download")
            ->assertStatus(403);
    }
}
