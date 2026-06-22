<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use App\Models\Pricetag\PricetagCategory;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PricetagCategoryApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->user = User::factory()->create([]);
        $this->user->givePermissionTo('access-pricetag');
    }

    /**
     * Test categories listing with standardized pagination layout.
     */
    public function test_can_get_paginated_categories(): void
    {
        PricetagCategory::create(['name' => 'Elektronik', 'created_by' => $this->user->id]);
        PricetagCategory::create(['name' => 'Fashion', 'created_by' => $this->user->id]);
        PricetagCategory::create(['name' => 'Makanan', 'created_by' => $this->user->id]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/pricetag/categories?per_page=2');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => ['id', 'name', 'products_count', 'created_at', 'updated_at'],
            ],
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        ]);

        $this->assertCount(2, $response->json('data'));
        $this->assertEquals(3, $response->json('meta.total'));
    }

    /**
     * Test filtering categories by name query.
     */
    public function test_can_filter_categories_by_name(): void
    {
        PricetagCategory::create(['name' => 'Gadget Murah', 'created_by' => $this->user->id]);
        PricetagCategory::create(['name' => 'Sepatu Olahraga', 'created_by' => $this->user->id]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/pricetag/categories?name=Gadget');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('Gadget Murah', $response->json('data.0.name'));
    }

    /**
     * Test sorting categories list.
     */
    public function test_can_sort_categories(): void
    {
        PricetagCategory::create(['name' => 'Apel', 'created_by' => $this->user->id]);
        PricetagCategory::create(['name' => 'Ceri', 'created_by' => $this->user->id]);
        PricetagCategory::create(['name' => 'Belimbing', 'created_by' => $this->user->id]);

        // Descending sort by name
        $response = $this->actingAs($this->user)->getJson('/api/v1/pricetag/categories?sort_by=name&sort_order=desc');

        $response->assertStatus(200);
        $this->assertEquals('Ceri', $response->json('data.0.name'));
        $this->assertEquals('Belimbing', $response->json('data.1.name'));
        $this->assertEquals('Apel', $response->json('data.2.name'));
    }

    /**
     * Test retrieving a single category detail.
     */
    public function test_can_get_single_category(): void
    {
        $category = PricetagCategory::create(['name' => 'Otomotif', 'created_by' => $this->user->id]);

        $response = $this->actingAs($this->user)->getJson("/api/v1/pricetag/categories/{$category->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Detail kategori berhasil diambil.',
            'data' => [
                'id' => $category->id,
                'name' => 'Otomotif',
            ],
        ]);
    }

    /**
     * Test retrieving non-existent category returns standardized HTTP 404 JSON.
     */
    public function test_get_non_existent_category_returns_404(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/v1/pricetag/categories/999');

        $response->assertStatus(404);
        $response->assertJson([
            'success' => false,
            'message' => 'Resource tidak ditemukan.',
        ]);
    }

    public function test_can_sort_categories_by_products_count(): void
    {
        $c1 = PricetagCategory::create(['name' => 'Kategori A', 'created_by' => $this->user->id]);
        $c2 = PricetagCategory::create(['name' => 'Kategori B', 'created_by' => $this->user->id]);

        \App\Models\Pricetag\PricetagProduct::create([
            'category_id' => $c2->id,
            'name' => 'Produk B1',
            'variant_name' => 'Default',
            'normal_price' => 1000,
            'discount_price' => 900,
            'created_by' => $this->user->id,
        ]);
        \App\Models\Pricetag\PricetagProduct::create([
            'category_id' => $c2->id,
            'name' => 'Produk B2',
            'variant_name' => 'Default',
            'normal_price' => 1000,
            'discount_price' => 900,
            'created_by' => $this->user->id,
        ]);
        \App\Models\Pricetag\PricetagProduct::create([
            'category_id' => $c1->id,
            'name' => 'Produk A1',
            'variant_name' => 'Default',
            'normal_price' => 1000,
            'discount_price' => 900,
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/pricetag/categories?sort_by=products_count&sort_order=desc');

        $response->assertStatus(200);
        $this->assertEquals('Kategori B', $response->json('data.0.name'));
        $this->assertEquals(2, $response->json('data.0.products_count'));
        $this->assertEquals('Kategori A', $response->json('data.1.name'));
        $this->assertEquals(1, $response->json('data.1.products_count'));
    }

    public function test_user_without_access_pricetag_cannot_read_catalog(): void
    {
        $unauthorized = User::factory()->create([]);

        $this->actingAs($unauthorized)
            ->getJson('/api/v1/pricetag/categories')
            ->assertForbidden();
    }
}
