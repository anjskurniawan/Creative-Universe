<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Core\User;
use App\Models\Pricetag\PricetagCategory;
use App\Models\Pricetag\PricetagProduct;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class PricetagCatalogImportApiTest extends TestCase
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

    public function test_comma_csv_creates_catalog_and_accepts_indonesian_price_format(): void
    {
        $file = UploadedFile::fake()->createWithContent(
            'catalog.csv',
            "kategori,produk,varian,harga_normal,harga_diskon\nAudio,Headset Pro,Hitam,1.500.000,1.250.000\n"
        );

        $response = $this->actingAs($this->manager)->post('/api/v1/pricetag/imports/products', [
            'file' => $file,
        ], ['Accept' => 'application/json']);

        $response->assertOk()
            ->assertJsonPath('data.total', 1)
            ->assertJsonPath('data.created', 1)
            ->assertJsonPath('data.categories_created', 1);
        $this->assertDatabaseHas('pricetag_products', [
            'name' => 'Headset Pro',
            'variant_name' => 'Hitam',
            'normal_price' => 1500000,
            'discount_price' => 1250000,
            'created_by' => $this->manager->id,
        ]);
        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'pricetag',
            'description' => '[PRICETAG] Catalog CSV imported',
            'causer_id' => $this->manager->id,
        ]);
    }

    public function test_semicolon_csv_with_english_headers_updates_existing_product(): void
    {
        [$category, $product] = $this->catalogFixture();
        $file = UploadedFile::fake()->createWithContent(
            'catalog.txt',
            "category_name;product_name;variant_name;normal_price;discount_price\nAudio;Headset Pro;Hitam;100000;70000\n"
        );

        $this->actingAs($this->manager)->post('/api/v1/pricetag/imports/products', [
            'file' => $file,
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.updated', 1)
            ->assertJsonPath('data.created', 0);

        $this->assertDatabaseHas('pricetag_products', [
            'id' => $product->id,
            'category_id' => $category->id,
            'discount_price' => 70000,
            'updated_by' => $this->manager->id,
        ]);
    }

    public function test_import_restores_soft_deleted_category_and_product(): void
    {
        [$category, $product] = $this->catalogFixture();
        $product->delete();
        $category->delete();
        $file = UploadedFile::fake()->createWithContent(
            'restore.csv',
            "kategori,produk,varian,harga_normal,harga_diskon\nAudio,Headset Pro,Hitam,120000,90000\n"
        );

        $this->actingAs($this->manager)->post('/api/v1/pricetag/imports/products', [
            'file' => $file,
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.restored', 1)
            ->assertJsonPath('data.categories_restored', 1);

        $this->assertDatabaseHas('pricetag_categories', [
            'id' => $category->id,
            'deleted_at' => null,
            'deleted_by' => null,
        ]);
        $this->assertDatabaseHas('pricetag_products', [
            'id' => $product->id,
            'deleted_at' => null,
            'deleted_by' => null,
            'normal_price' => 120000,
        ]);
    }

    public function test_invalid_row_rejects_entire_file_without_partial_writes(): void
    {
        $file = UploadedFile::fake()->createWithContent(
            'invalid.csv',
            "kategori,produk,varian,harga_normal,harga_diskon\nAudio,Valid Product,Default,100000,90000\nAudio,Broken Product,Default,bukan-angka,50000\n"
        );

        $this->actingAs($this->manager)->post('/api/v1/pricetag/imports/products', [
            'file' => $file,
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonPath('errors.rows.0.row', 3);

        $this->assertDatabaseCount('pricetag_categories', 0);
        $this->assertDatabaseCount('pricetag_products', 0);
    }

    public function test_duplicate_product_variant_inside_file_is_rejected(): void
    {
        $file = UploadedFile::fake()->createWithContent(
            'duplicate.csv',
            "kategori,produk,varian,harga_normal\nAudio,Headset Pro,Hitam,100000\nAudio,headset pro,HITAM,120000\n"
        );

        $this->actingAs($this->manager)->post('/api/v1/pricetag/imports/products', [
            'file' => $file,
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonPath('errors.rows.0.row', 3)
            ->assertJsonPath('errors.rows.0.errors.0', 'Duplikat produk/varian dengan baris 2.');

        $this->assertDatabaseCount('pricetag_products', 0);
    }

    public function test_missing_required_headers_and_empty_file_are_rejected(): void
    {
        $missingHeader = UploadedFile::fake()->createWithContent(
            'missing.csv',
            "kategori,produk\nAudio,Headset\n"
        );
        $empty = UploadedFile::fake()->createWithContent('empty.csv', '');

        $this->actingAs($this->manager)->post('/api/v1/pricetag/imports/products', [
            'file' => $missingHeader,
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Header CSV wajib memuat kategori, produk, dan harga_normal.');

        $this->actingAs($this->manager)->post('/api/v1/pricetag/imports/products', [
            'file' => $empty,
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable();
    }

    public function test_user_without_pricetag_manage_cannot_import(): void
    {
        $reader = User::factory()->create(['is_active' => true]);
        $reader->givePermissionTo('access-pricetag');
        $file = UploadedFile::fake()->createWithContent(
            'catalog.csv',
            "kategori,produk,harga_normal\nAudio,Headset,100000\n"
        );

        $this->actingAs($reader)->post('/api/v1/pricetag/imports/products', [
            'file' => $file,
        ], ['Accept' => 'application/json'])
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
