<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Core\User;
use App\Models\Pricetag\PricetagCategory;
use App\Models\Pricetag\PricetagProduct;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PricetagCatalogMutationApiTest extends TestCase
{
    use RefreshDatabase;

    private User $manager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->manager = User::factory()->create(['is_active' => true]);
        $this->manager->assignRole('Manajer');
    }

    public function test_manager_can_create_update_and_soft_delete_category_with_ownership(): void
    {
        $created = $this->actingAs($this->manager)->postJson('/api/v1/pricetag/categories', [
            'name' => 'Smart Home',
        ]);

        $created->assertCreated()->assertJsonPath('data.name', 'Smart Home');
        $categoryId = $created->json('data.id');
        $this->assertDatabaseHas('pricetag_categories', [
            'id' => $categoryId,
            'created_by' => $this->manager->id,
        ]);

        $this->actingAs($this->manager)
            ->patchJson("/api/v1/pricetag/categories/{$categoryId}", ['name' => 'Rumah Pintar'])
            ->assertOk();

        $this->assertDatabaseHas('pricetag_categories', [
            'id' => $categoryId,
            'updated_by' => $this->manager->id,
        ]);

        $this->actingAs($this->manager)
            ->deleteJson("/api/v1/pricetag/categories/{$categoryId}")
            ->assertOk();

        $this->assertSoftDeleted('pricetag_categories', ['id' => $categoryId]);
        $this->assertDatabaseHas('pricetag_categories', [
            'id' => $categoryId,
            'deleted_by' => $this->manager->id,
        ]);
        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'pricetag',
            'description' => '[PRICETAG] Category deleted',
            'subject_id' => $categoryId,
        ]);
    }

    public function test_category_with_active_products_cannot_be_deleted(): void
    {
        [$category] = $this->catalogFixture();

        $this->actingAs($this->manager)
            ->deleteJson("/api/v1/pricetag/categories/{$category->id}")
            ->assertStatus(422)
            ->assertJsonPath('message', "Kategori {$category->name} masih memiliki produk aktif dan tidak dapat dihapus.");

        $this->assertNotSoftDeleted('pricetag_categories', ['id' => $category->id]);
    }

    public function test_manager_can_create_update_and_soft_delete_product_with_price_audit(): void
    {
        $category = PricetagCategory::create([
            'name' => 'Wearable',
            'created_by' => $this->manager->id,
        ]);

        $created = $this->actingAs($this->manager)->postJson('/api/v1/pricetag/products', [
            'category_id' => $category->id,
            'name' => 'Smart Watch',
            'variant_name' => '',
            'normal_price' => 1500000,
            'discount_price' => 1250000,
        ]);

        $created->assertCreated()
            ->assertJsonPath('data.variant_name', 'Default');
        $productId = $created->json('data.id');

        $this->actingAs($this->manager)->patchJson("/api/v1/pricetag/products/{$productId}", [
            'category_id' => $category->id,
            'name' => 'Smart Watch',
            'variant_name' => 'Default',
            'normal_price' => 1500000,
            'discount_price' => 1100000,
        ])->assertOk();

        $this->assertDatabaseHas('pricetag_products', [
            'id' => $productId,
            'created_by' => $this->manager->id,
            'updated_by' => $this->manager->id,
            'discount_price' => 1100000,
        ]);
        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'pricetag',
            'description' => '[PRICETAG] Product updated',
            'subject_id' => $productId,
            'causer_id' => $this->manager->id,
        ]);

        $this->actingAs($this->manager)
            ->deleteJson("/api/v1/pricetag/products/{$productId}")
            ->assertOk();

        $this->assertSoftDeleted('pricetag_products', ['id' => $productId]);
        $this->assertDatabaseHas('pricetag_products', [
            'id' => $productId,
            'deleted_by' => $this->manager->id,
        ]);
    }

    public function test_product_combination_must_be_unique_and_prices_must_be_non_negative(): void
    {
        [$category, $product] = $this->catalogFixture();

        $this->actingAs($this->manager)->postJson('/api/v1/pricetag/products', [
            'category_id' => $category->id,
            'name' => $product->name,
            'variant_name' => $product->variant_name,
            'normal_price' => -1,
            'discount_price' => -1,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'normal_price', 'discount_price']);
    }

    public function test_user_without_pricetag_manage_cannot_mutate_catalog(): void
    {
        [$category, $product] = $this->catalogFixture();
        $reader = User::factory()->create(['is_active' => true]);
        $reader->givePermissionTo('access-pricetag');

        $this->actingAs($reader)->postJson('/api/v1/pricetag/categories', ['name' => 'Ditolak'])
            ->assertForbidden();
        $this->actingAs($reader)->patchJson("/api/v1/pricetag/categories/{$category->id}", ['name' => 'Ditolak'])
            ->assertForbidden();
        $this->actingAs($reader)->deleteJson("/api/v1/pricetag/products/{$product->id}")
            ->assertForbidden();
    }

    /** @return array{PricetagCategory, PricetagProduct} */
    private function catalogFixture(): array
    {
        $category = PricetagCategory::create([
            'name' => 'Audio',
            'created_by' => $this->manager->id,
        ]);
        $product = PricetagProduct::create([
            'category_id' => $category->id,
            'name' => 'Headset Pro',
            'variant_name' => 'Hitam',
            'normal_price' => 100000,
            'discount_price' => 80000,
            'created_by' => $this->manager->id,
        ]);

        return [$category, $product];
    }
}
