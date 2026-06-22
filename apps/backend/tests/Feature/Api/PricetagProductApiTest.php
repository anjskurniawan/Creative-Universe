<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Core\AssetLink;
use App\Models\Core\User;
use App\Models\Pricetag\PricetagCategory;
use App\Models\Pricetag\PricetagProduct;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PricetagProductApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private PricetagCategory $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->user = User::factory()->create([]);
        $this->user->givePermissionTo('access-pricetag');
        $this->category = PricetagCategory::create([
            'name' => 'Audio',
            'created_by' => $this->user->id,
        ]);
    }

    public function test_catalog_lists_products_for_selected_category_and_search(): void
    {
        $matching = $this->product('Headset Pro', 'Hitam');
        $this->product('Speaker Mini', 'Putih');

        $response = $this->actingAs($this->user)->getJson(
            "/api/v1/pricetag/products?category_id={$this->category->id}&search=Hitam"
        );

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $matching->id)
            ->assertJsonPath('data.0.category.name', 'Audio')
            ->assertJsonPath('data.0.is_ready', false)
            ->assertJsonPath('data.0.generator_path', "/pricetag/generator?product_id={$matching->id}");
    }

    public function test_ready_filter_returns_preview_and_download_from_polymorphic_asset_links(): void
    {
        $ready = $this->product('Headset Ready', 'Default');
        $this->product('Headset Pending', 'Default');

        AssetLink::create([
            'linkable_type' => PricetagProduct::class,
            'linkable_id' => $ready->id,
            'provider' => 'google_drive',
            'label' => 'Google Drive View Link',
            'url' => 'https://drive.google.com/view-ready',
            'created_by' => $this->user->id,
        ]);
        AssetLink::create([
            'linkable_type' => PricetagProduct::class,
            'linkable_id' => $ready->id,
            'provider' => 'google_drive',
            'label' => 'Google Drive Download Link',
            'url' => 'https://drive.google.com/download-ready',
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/pricetag/products?status=ready');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $ready->id)
            ->assertJsonPath('data.0.is_ready', true)
            ->assertJsonPath('data.0.preview_url', 'https://drive.google.com/view-ready')
            ->assertJsonPath('data.0.download_url', 'https://drive.google.com/download-ready');
    }

    public function test_user_without_access_pricetag_cannot_read_products(): void
    {
        $unauthorized = User::factory()->create([]);

        $this->actingAs($unauthorized)
            ->getJson('/api/v1/pricetag/products')
            ->assertForbidden();
    }

    private function product(string $name, string $variant): PricetagProduct
    {
        return PricetagProduct::create([
            'category_id' => $this->category->id,
            'name' => $name,
            'variant_name' => $variant,
            'normal_price' => 100000,
            'discount_price' => 80000,
            'created_by' => $this->user->id,
        ]);
    }
}
