<?php

declare(strict_types=1);

namespace Tests\Feature\Database;

use App\Models\Core\Application;
use App\Models\Core\Division;
use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\Assessment;
use App\SubApps\Generator\Pricetag\Models\PricetagProduct;
use App\SubApps\KvRetail\Models\KvRetailTask;
use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Models\SystemRule;
use Database\Seeders\ProductionDatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProductionDatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_seeds_only_the_hosting_foundation_and_root_account(): void
    {
        Config::set('auth.root_user.password', 'production-test-password');

        $this->seed(ProductionDatabaseSeeder::class);

        $this->assertSame(1, User::count());
        $root = User::firstOrFail();
        $this->assertSame('root', $root->username);
        $this->assertTrue($root->hasRole('Root'));

        $this->assertSame(10, Role::count());
        $this->assertSame(38, Permission::count());
        $this->assertSame(32, Division::count());
        $this->assertSame(12, Category::count());
        $this->assertSame(6, SystemRule::count());
        $this->assertSame(7, Application::count());

        $this->assertSame(0, PricetagProduct::count());
        $this->assertSame(0, Assessment::count());
        $this->assertSame(0, KvRetailTask::count());
    }
}
