<?php

namespace Tests\Feature\Pricetag;

use App\Jobs\Pricetag\GeneratePricetagChunkJob;
use App\Livewire\Pricetag\Database;
use App\Livewire\Pricetag\Generator;
use App\Livewire\Pricetag\History;
use App\Models\Core\AssetLink;
use App\Models\Core\User;
use App\Models\Pricetag\PricetagBatch;
use App\Models\Pricetag\PricetagCategory;
use App\Models\Pricetag\PricetagProduct;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Livewire\Livewire;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PricetagGeneratorTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $desainer;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup Spatie permissions
        Permission::firstOrCreate(['name' => 'access-core']);
        Permission::firstOrCreate(['name' => 'access-pricetag']);
        Permission::firstOrCreate(['name' => 'pricetag.manage']);

        $superadmin = Role::firstOrCreate(['name' => 'Superadmin']);
        $superadmin->syncPermissions(['access-core', 'access-pricetag', 'pricetag.manage']);

        $desainerRole = Role::firstOrCreate(['name' => 'Desainer']);
        $desainerRole->syncPermissions(['access-core', 'access-pricetag']);

        // Create users using standard factory
        $this->admin = User::create([
            'name' => 'Super Admin',
            'username' => 'superadmin_test',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        $this->admin->assignRole('Superadmin');

        $this->desainer = User::create([
            'name' => 'Desainer User',
            'username' => 'desainer_test',
            'email' => 'desainer@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        $this->desainer->assignRole('Desainer');
    }

    public function test_guest_cannot_access_pricetag_pages()
    {
        $response = $this->get(route('pricetag.search'));
        $response->assertRedirect(route('login'));
    }

    public function test_unauthorized_user_cannot_access_pricetag_pages()
    {
        $user = User::create([
            'name' => 'Inactive User',
            'username' => 'inactive_test',
            'email' => 'inactive@test.com',
            'password' => bcrypt('password'),
            'is_active' => true, // Active, but no roles/permissions
        ]);
        $this->actingAs($user);

        $response = $this->get(route('pricetag.search'));
        $response->assertStatus(403);
    }

    public function test_authorized_user_can_access_search_page()
    {
        $this->actingAs($this->desainer);

        $response = $this->get(route('pricetag.search'));
        $response->assertStatus(200);
    }

    public function test_only_admin_can_access_database_management_page()
    {
        // Desainer cannot
        $this->actingAs($this->desainer);
        $response = $this->get(route('pricetag.database'));
        $response->assertStatus(403);

        // Admin can
        $this->actingAs($this->admin);
        $response = $this->get(route('pricetag.database'));
        $response->assertStatus(200);
    }

    public function test_admin_can_create_product_with_variant_and_prices_in_database()
    {
        $this->actingAs($this->admin);

        $category = PricetagCategory::create(['name' => 'Audio', 'created_by' => $this->admin->id]);

        Livewire::test(Database::class)
            ->set('activeTab', 'products')
            ->call('openProductModal')
            ->set('productCategoryId', $category->id)
            ->set('productName', 'JETE TWS T10')
            ->set('productVariantName', 'Blue')
            ->set('productNormalPrice', 399000)
            ->set('productDiscountPrice', 199000)
            ->call('saveProduct')
            ->assertHasNoErrors();

        $this->assertDatabaseHas('pricetag_products', [
            'category_id' => $category->id,
            'name' => 'JETE TWS T10',
            'variant_name' => 'Blue',
            'normal_price' => 399000,
            'discount_price' => 199000,
        ]);
    }

    public function test_product_price_update_logs_activity()
    {
        $this->actingAs($this->admin);

        $category = PricetagCategory::create(['name' => 'Audio', 'created_by' => $this->admin->id]);
        $product = PricetagProduct::create([
            'category_id' => $category->id,
            'name' => 'JETE TWS T10 Black',
            'normal_price' => 399000,
            'discount_price' => 199000,
            'created_by' => $this->admin->id,
        ]);

        // Enable activity logging explicitly
        activity()->enableLogging();

        // Update discount price
        $product->update(['discount_price' => 179000]);

        // Assert log was created
        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'pricetag',
            'subject_id' => $product->id,
            'subject_type' => PricetagProduct::class,
        ]);
    }

    public function test_checklist_generation_creates_batch_and_dispatches_jobs()
    {
        $this->actingAs($this->admin);

        $category = PricetagCategory::create(['name' => 'Audio', 'created_by' => $this->admin->id]);
        $product1 = PricetagProduct::create([
            'category_id' => $category->id,
            'name' => 'JETE TWS T10 Black',
            'normal_price' => 399000,
            'discount_price' => 199000,
            'created_by' => $this->admin->id,
        ]);
        $product2 = PricetagProduct::create([
            'category_id' => $category->id,
            'name' => 'JETE TWS T10 White',
            'normal_price' => 399000,
            'discount_price' => 199000,
            'created_by' => $this->admin->id,
        ]);

        Queue::fake();

        $component = Livewire::test(Generator::class)
            ->set('activeTab', 'checklist')
            ->set('checklistBatchName', 'Test Batch Checklist')
            ->set('selectedVariants', [$product1->id, $product2->id])
            ->call('generateChecklist');

        $component->assertHasNoErrors();

        $this->assertDatabaseHas('pricetag_batches', [
            'batch_name' => 'Test Batch Checklist',
            'status' => 'pending',
            'total_items' => 2,
        ]);

        Queue::assertPushed(GeneratePricetagChunkJob::class);
    }

    public function test_single_generation_creates_batch_with_item()
    {
        $this->actingAs($this->admin);

        $category = PricetagCategory::create(['name' => 'Audio', 'created_by' => $this->admin->id]);
        $product = PricetagProduct::create([
            'category_id' => $category->id,
            'name' => 'JETE TWS T10 Black',
            'normal_price' => 399000,
            'discount_price' => 199000,
            'created_by' => $this->admin->id,
            'variant_name' => 'Default',
        ]);

        // Fake Http requests to GAS URL
        Http::fake([
            '*' => Http::response([
                'status' => 'success',
                'file_url' => 'https://drive.google.com/file/d/test_view_id/view',
                'download_url' => 'https://drive.google.com/uc?export=download&id=test_view_id',
            ], 200),
        ]);

        Livewire::test(Generator::class)
            ->call('selectWizardCategory', $category->id)
            ->call('selectWizardProduct', $product->name)
            ->set('wizardDiscountPrice', 180000)
            ->call('generateSingleWizard')
            ->call('processSingleGeneration');

        $this->assertDatabaseHas('pricetag_batches', [
            'batch_name' => 'Single: JETE TWS T10 Black',
            'status' => 'completed',
            'total_items' => 1,
            'processed_items' => 1,
        ]);

        $this->assertDatabaseHas('pricetag_batch_items', [
            'product_id' => $product->id,
            'status' => 'success',
        ]);
    }

    public function test_history_download_zip()
    {
        if (! class_exists('ZipArchive')) {
            $this->markTestSkipped('ZipArchive extension is not loaded.');
        }

        $this->actingAs($this->admin);

        $batch = PricetagBatch::create([
            'batch_name' => 'Test Batch Download',
            'status' => 'completed',
            'total_items' => 1,
            'processed_items' => 1,
            'created_by' => $this->admin->id,
        ]);

        $category = PricetagCategory::create(['name' => 'Audio', 'created_by' => $this->admin->id]);
        $product = PricetagProduct::create([
            'category_id' => $category->id,
            'name' => 'JETE TWS T10 Black',
            'normal_price' => 399000,
            'discount_price' => 199000,
            'created_by' => $this->admin->id,
        ]);

        $batch->items()->create([
            'product_id' => $product->id,
            'status' => 'success',
        ]);

        AssetLink::create([
            'linkable_type' => PricetagProduct::class,
            'linkable_id' => $product->id,
            'provider' => 'google_drive',
            'label' => 'Google Drive View Link',
            'url' => 'https://drive.google.com/file/d/test_view_id/view',
            'created_by' => $this->admin->id,
        ]);

        // Fake the direct download response returning image content
        Http::fake([
            'https://drive.google.com/uc*' => Http::response('dummy image data', 200, [
                'Content-Type' => 'image/jpeg',
            ]),
        ]);

        $response = Livewire::test(History::class)
            ->call('downloadZip', $batch->id);

        $response->assertStatus(200);
        $this->assertNotNull($response->effects['download'] ?? null);
    }
}
