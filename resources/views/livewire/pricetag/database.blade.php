<div>
    <!-- Sub-App Tabs -->
    <div class="mb-6 border-b border-cu-line bg-cu-surface rounded-t-xl p-1 flex flex-wrap gap-2">
        <button wire:click="selectTab('categories')"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition {{ $activeTab === 'categories' ? 'bg-cu-panel-soft text-cu-ink font-semibold border-b-2 border-cu-focus' : 'text-cu-muted hover:text-cu-ink' }}">
            <x-material-icon class="cu-icon-category" size="sm" />
            Data Kategori
        </button>
        <button wire:click="selectTab('products')"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition {{ $activeTab === 'products' ? 'bg-cu-panel-soft text-cu-ink font-semibold border-b-2 border-cu-focus' : 'text-cu-muted hover:text-cu-ink' }}">
            <x-material-icon class="cu-icon-inventory-2" size="sm" />
            Data Produk
        </button>
        <button wire:click="selectTab('csv_import')"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition {{ $activeTab === 'csv_import' ? 'bg-cu-panel-soft text-cu-ink font-semibold border-b-2 border-cu-focus' : 'text-cu-muted hover:text-cu-ink' }}">
            <x-material-icon class="cu-icon-upload-file" size="sm" />
            Tambah Data Massal (CSV)
        </button>
    </div>

    <!-- Alert Success -->
    @if (session()->has('success_db'))
        <div class="mb-5">
            <x-app-alert type="success">
                {{ session('success_db') }}
            </x-app-alert>
        </div>
    @endif

    <!-- Alert Error -->
    @if (session()->has('error_db'))
        <div class="mb-5">
            <x-app-alert type="danger">
                {{ session('error_db') }}
            </x-app-alert>
        </div>
    @endif

    <!-- Search / Actions Header (Except CSV tab) -->
    @if ($activeTab !== 'csv_import')
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="relative flex-1 max-w-md">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cu-muted">
                    <x-material-icon class="cu-icon-search" size="sm" />
                </div>
                <input type="search" wire:model.live.debounce.300ms="dbSearch"
                    class="block w-full rounded-lg border border-cu-line bg-cu-surface py-2 pl-10 pr-4 text-sm text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-focus focus:outline-none"
                    placeholder="Cari data...">
            </div>

            <div>
                @if ($activeTab === 'categories')
                    <button wire:click="openCategoryModal()"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-cu-ink px-4 py-2 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover shadow-sm">
                        <x-material-icon class="cu-icon-add" size="sm" />
                        Tambah Kategori
                    </button>
                @elseif ($activeTab === 'products')
                    <button wire:click="openProductModal()"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-cu-ink px-4 py-2 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover shadow-sm">
                        <x-material-icon class="cu-icon-add" size="sm" />
                        Tambah Produk
                    </button>
                @endif
            </div>
        </div>
    @endif

    <!-- Data Tables -->
    @if ($activeTab === 'categories')
        <x-app-panel padding="none" class="overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="border-b border-cu-line bg-cu-panel-soft text-xs font-semibold uppercase tracking-wider text-cu-muted">
                            <th class="px-6 py-4">ID</th>
                            <th class="px-6 py-4">Nama Kategori</th>
                            <th class="px-6 py-4">Dibuat Oleh</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-cu-line bg-cu-surface">
                        @forelse ($categoriesList as $cat)
                            <tr class="hover:bg-cu-panel-soft/30 transition">
                                <td class="px-6 py-4 text-cu-muted font-medium">{{ $cat->id }}</td>
                                <td class="px-6 py-4 font-semibold text-cu-ink">{{ $cat->name }}</td>
                                <td class="px-6 py-4 text-xs text-cu-muted">{{ $cat->creator->name ?? 'System' }}</td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button wire:click="openCategoryModal({{ $cat->id }})"
                                            class="inline-flex size-8 items-center justify-center rounded-lg border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft transition">
                                            <x-material-icon class="cu-icon-edit" size="xs" />
                                        </button>
                                        <button onclick="confirmDelete({{ $cat->id }}, 'category')"
                                            class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent bg-cu-danger-soft text-cu-danger hover:bg-cu-danger hover:text-cu-surface transition">
                                            <x-material-icon class="cu-icon-delete" size="xs" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="px-6 py-10 text-center text-cu-muted">Tidak ada kategori.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            @if ($categoriesList->hasPages())
                <div class="border-t border-cu-line px-6 py-4">
                    {{ $categoriesList->links() }}
                </div>
            @endif
        </x-app-panel>
    @endif

    @if ($activeTab === 'products')
        <x-app-panel padding="none" class="overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="border-b border-cu-line bg-cu-panel-soft text-xs font-semibold uppercase tracking-wider text-cu-muted">
                            <th class="px-6 py-4">ID</th>
                            <th class="px-6 py-4">Nama Produk</th>
                            <th class="px-6 py-4">Varian</th>
                            <th class="px-6 py-4">Harga Normal</th>
                            <th class="px-6 py-4">Harga Diskon</th>
                            <th class="px-6 py-4">Kategori</th>
                            <th class="px-6 py-4">Dibuat Oleh</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-cu-line bg-cu-surface">
                        @forelse ($productsList as $prod)
                            <tr class="hover:bg-cu-panel-soft/30 transition">
                                <td class="px-6 py-4 text-cu-muted font-medium">{{ $prod->id }}</td>
                                <td class="px-6 py-4 font-semibold text-cu-ink">{{ $prod->name }}</td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center rounded-md bg-cu-panel-soft px-2 py-1 text-xs font-medium text-cu-ink">
                                        {{ $prod->variant_name }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-cu-ink">Rp {{ number_format($prod->normal_price, 0, ',', '.') }}</td>
                                <td class="px-6 py-4 text-cu-ink">Rp {{ number_format($prod->discount_price, 0, ',', '.') }}</td>
                                <td class="px-6 py-4 text-cu-muted">{{ $prod->category->name ?? '-' }}</td>
                                <td class="px-6 py-4 text-xs text-cu-muted">{{ $prod->creator->name ?? 'System' }}</td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button wire:click="openProductModal({{ $prod->id }})"
                                            class="inline-flex size-8 items-center justify-center rounded-lg border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft transition">
                                            <x-material-icon class="cu-icon-edit" size="xs" />
                                        </button>
                                        <button onclick="confirmDelete({{ $prod->id }}, 'product')"
                                            class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent bg-cu-danger-soft text-cu-danger hover:bg-cu-danger hover:text-cu-surface transition">
                                            <x-material-icon class="cu-icon-delete" size="xs" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-10 text-center text-cu-muted">Tidak ada produk.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            @if ($productsList->hasPages())
                <div class="border-t border-cu-line px-6 py-4">
                    {{ $productsList->links() }}
                </div>
            @endif
        </x-app-panel>
    @endif

    <!-- Import Massal CSV Tab -->
    @if ($activeTab === 'csv_import')
        <div class="max-w-xl">
            <x-app-panel padding="lg" class="shadow-sm">
                <div class="flex items-start justify-between border-b border-cu-line pb-4 mb-5">
                    <div>
                        <h2 class="text-lg font-semibold text-cu-ink">Tambah Data Massal via CSV</h2>
                        <p class="text-xs text-cu-muted mt-1">Unggah file CSV untuk menambahkan kategori, produk, varian, harga normal, dan harga promo secara massal ke sistem.</p>
                    </div>
                    <a href="#" onclick="downloadImportTemplate()"
                        class="inline-flex items-center gap-1 text-xs font-semibold text-cu-info hover:underline">
                        <x-material-icon class="cu-icon-download-for-offline" size="sm" />
                        Download Template CSV
                    </a>
                </div>

                <form wire:submit.prevent="importCsv" class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-cu-ink mb-1.5">File CSV</label>
                        <div class="flex items-center justify-center w-full">
                            <label class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-cu-line rounded-lg cursor-pointer bg-cu-surface hover:bg-cu-panel-soft transition duration-200">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <x-material-icon class="cu-icon-upload-file text-cu-soft mb-2" size="lg" />
                                    <p class="mb-1 text-sm text-cu-ink"><span class="font-semibold">Klik untuk memilih file</span></p>
                                    <p class="text-xs text-cu-muted">Kolom wajib: kategori, produk, harga_normal</p>
                                    <p class="text-[10px] text-cu-soft mt-0.5">Kolom opsional: varian (default "Default"), harga_diskon</p>

                                    @if ($updateCsvFile)
                                        <div class="mt-3 flex items-center gap-1.5 rounded-full bg-cu-info-soft border border-cu-info/20 px-3 py-1 text-xs text-cu-info font-medium">
                                            <x-material-icon class="cu-icon-insert-drive-file" size="xs" />
                                            {{ $updateCsvFile->getClientOriginalName() }}
                                        </div>
                                    @endif
                                </div>
                                <input type="file" wire:model="updateCsvFile" class="hidden" accept=".csv" />
                            </label>
                        </div>
                        @error('updateCsvFile')
                            <span class="text-xs text-cu-danger mt-2 block">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="pt-4 border-t border-cu-line flex items-center gap-3">
                        <button type="submit" wire:loading.attr="disabled"
                            class="inline-flex items-center justify-center gap-2 rounded-lg bg-cu-ink px-4 py-2 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover disabled:opacity-50">
                            <x-material-icon class="cu-icon-save" size="sm" wire:loading.remove wire:target="importCsv" />
                            <svg class="animate-spin h-4 w-4 text-cu-surface" wire:loading wire:target="importCsv" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Mulai Memasukkan Data</span>
                        </button>
                    </div>
                </form>
            </x-app-panel>
        </div>
    @endif

    <!-- --- Category CRUD Modal --- -->
    @if ($showCategoryModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-cu-overlay/50 backdrop-blur-sm p-4">
            <div class="relative w-full max-w-md rounded-xl border border-cu-line bg-cu-surface shadow-2xl p-6">
                <div class="flex items-center justify-between border-b border-cu-line pb-3 mb-4">
                    <h3 class="text-lg font-semibold text-cu-ink">
                        {{ $selectedCategoryId ? 'Edit Kategori' : 'Tambah Kategori' }}
                    </h3>
                    <button wire:click="$set('showCategoryModal', false)" class="text-cu-muted hover:text-cu-ink transition">
                        <x-material-icon class="cu-icon-close" size="sm" />
                    </button>
                </div>
                <form wire:submit.prevent="saveCategory" class="space-y-4">
                    <div>
                        <label for="catName" class="block text-sm font-medium text-cu-ink mb-1.5">Nama Kategori</label>
                        <input type="text" id="catName" wire:model="categoryName"
                            class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:outline-none">
                        @error('categoryName')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="pt-4 border-t border-cu-line flex justify-end gap-2">
                        <button type="button" wire:click="$set('showCategoryModal', false)"
                            class="rounded-lg border border-cu-line bg-cu-surface px-4 py-2 text-sm font-semibold text-cu-ink hover:bg-cu-panel-soft transition">
                            Batal
                        </button>
                        <button type="submit"
                            class="rounded-lg bg-cu-ink px-4 py-2 text-sm font-semibold text-cu-surface hover:bg-cu-ink-hover transition shadow-sm">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    @endif

    <!-- --- Product CRUD Modal --- -->
    @if ($showProductModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-cu-overlay/50 backdrop-blur-sm p-4">
            <div class="relative w-full max-w-md rounded-xl border border-cu-line bg-cu-surface shadow-2xl p-6">
                <div class="flex items-center justify-between border-b border-cu-line pb-3 mb-4">
                    <h3 class="text-lg font-semibold text-cu-ink">
                        {{ $selectedProductId ? 'Edit Produk' : 'Tambah Produk' }}
                    </h3>
                    <button wire:click="$set('showProductModal', false)" class="text-cu-muted hover:text-cu-ink transition">
                        <x-material-icon class="cu-icon-close" size="sm" />
                    </button>
                </div>
                <form wire:submit.prevent="saveProduct" class="space-y-4">
                    <!-- Toggle Category Mode (Existing vs New) -->
                    <div class="flex items-center gap-2 mb-2">
                        <input type="checkbox" id="isNewCategory" wire:model.live="isNewCategory"
                            class="rounded border-cu-line text-cu-focus focus:ring-cu-focus size-4">
                        <label for="isNewCategory" class="text-sm font-medium text-cu-ink cursor-pointer">Buat Kategori Baru</label>
                    </div>

                    @if ($isNewCategory)
                        <div>
                            <label for="newCatName" class="block text-sm font-medium text-cu-ink mb-1.5">Nama Kategori Baru</label>
                            <input type="text" id="newCatName" wire:model="newCategoryName" placeholder="Misal: Charger"
                                class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:outline-none focus:border-cu-focus">
                            @error('newCategoryName')
                                <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                            @enderror
                        </div>
                    @else
                        <div>
                            <label for="prodCatId" class="block text-sm font-medium text-cu-ink mb-1.5">Kategori</label>
                            <select id="prodCatId" wire:model="productCategoryId"
                                class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:outline-none focus:border-cu-focus">
                                <option value="">-- Pilih Kategori --</option>
                                @foreach ($allCategories as $cat)
                                    <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                                @endforeach
                            </select>
                            @error('productCategoryId')
                                <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                            @enderror
                        </div>
                    @endif

                    <div>
                        <label for="prodName" class="block text-sm font-medium text-cu-ink mb-1.5">Nama Produk</label>
                        <input type="text" id="prodName" wire:model="productName"
                            class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:outline-none focus:border-cu-focus">
                        @error('productName')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>

                    <div>
                        <label for="prodVariantName" class="block text-sm font-medium text-cu-ink mb-1.5">Varian (Bisa Kosong)</label>
                        <input type="text" id="prodVariantName" wire:model="productVariantName" placeholder="Misal: Black, White, 64GB"
                            class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:outline-none focus:border-cu-focus">
                        @error('productVariantName')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>

                    <div>
                        <label for="prodNormalPrice" class="block text-sm font-medium text-cu-ink mb-1.5">Harga Normal</label>
                        <input type="number" id="prodNormalPrice" wire:model="productNormalPrice" placeholder="Misal: 399000"
                            class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:outline-none focus:border-cu-focus">
                        @error('productNormalPrice')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>

                    <div>
                        <label for="prodDiscountPrice" class="block text-sm font-medium text-cu-ink mb-1.5">Harga Diskon</label>
                        <input type="number" id="prodDiscountPrice" wire:model="productDiscountPrice" placeholder="Misal: 199000"
                            class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:outline-none focus:border-cu-focus">
                        @error('productDiscountPrice')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="pt-4 border-t border-cu-line flex justify-end gap-2">
                        <button type="button" wire:click="$set('showProductModal', false)"
                            class="rounded-lg border border-cu-line bg-cu-surface px-4 py-2 text-sm font-semibold text-cu-ink hover:bg-cu-panel-soft transition">
                            Batal
                        </button>
                        <button type="submit"
                            class="rounded-lg bg-cu-ink px-4 py-2 text-sm font-semibold text-cu-surface hover:bg-cu-ink-hover transition shadow-sm">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    @endif

    <script>
        /**
         * Triggered when clicking delete button.
         */
        function confirmDelete(id, type) {
            if (confirm("Apakah Anda yakin ingin menghapus data ini secara permanen?")) {
                if (type === 'category') {
                    @this.call('deleteCategory', id);
                } else if (type === 'product') {
                    @this.call('deleteProduct', id);
                }
            }
        }

        /**
         * Download template CSV file for bulk imports.
         */
        function downloadImportTemplate() {
            const csvContent = "data:text/csv;charset=utf-8,kategori,produk,varian,harga_normal,harga_diskon\nAudio,JETE TWS T10,Black,399000,199000\nAudio,JETE TWS T10,White,399000,199000\nCharger,JETE Charger C1,White,149000,79000\n";
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "pricetag_database_import_template.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    </script>
</div>
