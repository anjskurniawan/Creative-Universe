<div>
    <!-- Sub-App Tabs -->
    <div class="mb-8 flex justify-start sm:justify-center w-full max-w-full overflow-x-auto scrollbar-none px-4 sm:px-0">
        <div class="inline-flex p-1 rounded-full border border-cu-line bg-cu-surface-soft gap-1 md:gap-1.5 shadow-sm flex-nowrap">
            <button wire:click="selectTab('categories')"
                class="flex items-center justify-center px-3 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover whitespace-nowrap {{ $activeTab === 'categories' ? 'bg-cu-ink text-white shadow-sm font-extrabold' : 'text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/50' }}">
                Data Kategori
            </button>
            <button wire:click="selectTab('products')"
                class="flex items-center justify-center px-3 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover whitespace-nowrap {{ $activeTab === 'products' ? 'bg-cu-ink text-white shadow-sm font-extrabold' : 'text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/50' }}">
                Data Produk
            </button>
            <button wire:click="selectTab('csv_import')"
                class="flex items-center justify-center px-3 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover whitespace-nowrap {{ $activeTab === 'csv_import' ? 'bg-cu-ink text-white shadow-sm font-extrabold' : 'text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/50' }}">
                Tambah Data Massal (CSV)
            </button>
        </div>
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
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-cu-muted">
                    <x-material-icon class="cu-icon-search" size="sm" />
                </div>
                <input type="search" wire:model.live.debounce.300ms="dbSearch"
                    class="block w-full rounded-full border border-cu-line bg-cu-surface py-2.5 pl-11 pr-4 text-sm text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                    placeholder="Cari data...">
            </div>

            <div class="w-full sm:w-auto">
                @if ($activeTab === 'categories')
                    <button wire:click="openCategoryModal()"
                        class="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full bg-cu-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-cu-surface transition-all duration-300 hover:bg-cu-ink-hover shadow-md focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
                        <x-material-icon class="cu-icon-add" size="sm" />
                        <span>Tambah Kategori</span>
                    </button>
                @elseif ($activeTab === 'products')
                    <button wire:click="openProductModal()"
                        class="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full bg-cu-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-cu-surface transition-all duration-300 hover:bg-cu-ink-hover shadow-md focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
                        <x-material-icon class="cu-icon-add" size="sm" />
                        <span>Tambah Produk</span>
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
                            <th class="px-6 py-4 hidden sm:table-cell">ID</th>
                            <th class="px-6 py-4">Nama Kategori</th>
                            <th class="px-6 py-4 hidden sm:table-cell">Dibuat Oleh</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-cu-line bg-cu-surface">
                        @forelse ($categoriesList as $cat)
                            <tr class="hover:bg-cu-panel-soft/30 transition">
                                <td class="px-6 py-4 text-cu-muted font-medium hidden sm:table-cell">{{ $cat->id }}</td>
                                <td class="px-6 py-4">
                                    <div class="font-semibold text-cu-ink">{{ $cat->name }}</div>
                                    <div class="sm:hidden text-[10px] text-cu-muted mt-1 space-y-0.5">
                                        <span>ID: {{ $cat->id }}</span>
                                        <span>• Dibuat Oleh: {{ $cat->creator->name ?? 'System' }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-xs text-cu-muted hidden sm:table-cell">{{ $cat->creator->name ?? 'System' }}</td>
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
                            <th class="px-6 py-4 hidden sm:table-cell">ID</th>
                            <th class="px-6 py-4">Nama Produk</th>
                            <th class="px-6 py-4 hidden sm:table-cell">Varian</th>
                            <th class="px-6 py-4 hidden sm:table-cell">Harga Normal</th>
                            <th class="px-6 py-4">Harga Diskon</th>
                            <th class="px-6 py-4 hidden sm:table-cell">Kategori</th>
                            <th class="px-6 py-4 hidden sm:table-cell">Dibuat Oleh</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-cu-line bg-cu-surface">
                        @forelse ($productsList as $prod)
                            <tr class="hover:bg-cu-panel-soft/30 transition">
                                <td class="px-6 py-4 text-cu-muted font-medium hidden sm:table-cell">{{ $prod->id }}</td>
                                <td class="px-6 py-4">
                                    <div class="font-semibold text-cu-ink">{{ $prod->name }}</div>
                                    <div class="sm:hidden text-[10px] text-cu-muted mt-1 space-y-0.5">
                                        <span>ID: {{ $prod->id }}</span>
                                        <span>• Varian: {{ $prod->variant_name }}</span>
                                        <span>• Kategori: {{ $prod->category->name ?? '-' }}</span>
                                        <span class="block text-cu-ink">Normal: Rp {{ number_format($prod->normal_price, 0, ',', '.') }}</span>
                                        <span class="block">Dibuat Oleh: {{ $prod->creator->name ?? 'System' }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 hidden sm:table-cell">
                                    <span class="inline-flex items-center rounded-md bg-cu-panel-soft px-2 py-1 text-xs font-medium text-cu-ink">
                                        {{ $prod->variant_name }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-cu-ink hidden sm:table-cell">Rp {{ number_format($prod->normal_price, 0, ',', '.') }}</td>
                                <td class="px-6 py-4 text-cu-ink font-semibold">Rp {{ number_format($prod->discount_price, 0, ',', '.') }}</td>
                                <td class="px-6 py-4 text-cu-muted hidden sm:table-cell">{{ $prod->category->name ?? '-' }}</td>
                                <td class="px-6 py-4 text-xs text-cu-muted hidden sm:table-cell">{{ $prod->creator->name ?? 'System' }}</td>
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
                                <td colspan="8" class="px-6 py-10 text-center text-cu-muted">Tidak ada produk.</td>
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
                <div class="flex flex-col sm:flex-row sm:items-start justify-between border-b border-cu-line pb-4 mb-5 gap-3">
                    <div>
                        <h2 class="text-lg font-semibold text-cu-ink">Tambah Data Massal via CSV</h2>
                        <p class="text-xs text-cu-muted mt-1">Unggah file CSV untuk menambahkan kategori, produk, varian, harga normal, dan harga promo secara massal ke sistem.</p>
                    </div>
                    <a href="#" onclick="downloadImportTemplate()"
                        class="inline-flex items-center gap-1.5 text-xs font-bold text-cu-info hover:underline shrink-0">
                        <x-material-icon class="cu-icon-download-for-offline" size="sm" />
                        <span>Download Template CSV</span>
                    </a>
                </div>

                <form wire:submit.prevent="importCsv" class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-cu-ink mb-1.5">File CSV</label>
                        <div class="flex items-center justify-center w-full">
                            <label class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-cu-line rounded-2xl cursor-pointer bg-cu-surface hover:bg-cu-panel-soft transition duration-200">
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
                            class="inline-flex items-center justify-center gap-2 rounded-full bg-cu-ink px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover disabled:opacity-50 shadow-md">
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
            <div class="relative w-full max-w-md rounded-[2.5rem] border border-cu-line/60 bg-white text-cu-ink shadow-2xl p-6 md:p-8">
                <div class="flex items-center justify-between border-b border-cu-line/60 pb-3.5 mb-5">
                    <h3 class="text-base font-bold uppercase tracking-wider text-cu-ink">
                        {{ $selectedCategoryId ? 'Edit Kategori' : 'Tambah Kategori' }}
                    </h3>
                    <button wire:click="$set('showCategoryModal', false)" class="text-cu-muted hover:text-cu-ink transition">
                        <x-material-icon class="cu-icon-close" size="sm" />
                    </button>
                </div>
                <form wire:submit.prevent="saveCategory" class="space-y-4">
                    <div>
                        <label for="catName" class="block text-sm font-semibold text-cu-ink mb-1.5">Nama Kategori</label>
                        <input type="text" id="catName" wire:model="categoryName"
                            class="block w-full rounded-full border border-cu-line bg-cu-surface px-4 py-2.5 text-sm text-cu-ink focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
                        @error('categoryName')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="pt-5 border-t border-cu-line/60 flex justify-end gap-3">
                        <button type="button" wire:click="$set('showCategoryModal', false)"
                            class="rounded-full border border-cu-line bg-cu-surface px-5 py-2 text-xs font-bold uppercase tracking-wider text-cu-ink hover:bg-cu-panel-soft transition duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
                            Batal
                        </button>
                        <button type="submit"
                            class="rounded-full bg-cu-ink px-5 py-2 text-xs font-bold uppercase tracking-wider text-cu-surface hover:bg-cu-ink-hover transition duration-300 shadow-md focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
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
            <div class="relative w-full max-w-md rounded-[2.5rem] border border-cu-line/60 bg-white text-cu-ink shadow-2xl p-6 md:p-8">
                <div class="flex items-center justify-between border-b border-cu-line/60 pb-3.5 mb-5">
                    <h3 class="text-base font-bold uppercase tracking-wider text-cu-ink">
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
                            class="rounded border-cu-line text-cu-ink focus:ring-cu-border-hover focus:ring-1 size-4">
                        <label for="isNewCategory" class="text-sm font-semibold text-cu-ink cursor-pointer">Buat Kategori Baru</label>
                    </div>

                    @if ($isNewCategory)
                        <div>
                            <label for="newCatName" class="block text-sm font-semibold text-cu-ink mb-1.5">Nama Kategori Baru</label>
                            <input type="text" id="newCatName" wire:model="newCategoryName" placeholder="Misal: Charger"
                                class="block w-full rounded-full border border-cu-line bg-cu-surface px-4 py-2.5 text-sm text-cu-ink focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
                            @error('newCategoryName')
                                <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                            @enderror
                        </div>
                    @else
                        <div>
                            <label for="prodCatId" class="block text-sm font-semibold text-cu-ink mb-1.5">Kategori</label>
                            <select id="prodCatId" wire:model="productCategoryId"
                                class="block w-full rounded-full border border-cu-line bg-cu-surface px-4 py-2.5 text-sm text-cu-ink focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
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
                        <label for="prodName" class="block text-sm font-semibold text-cu-ink mb-1.5">Nama Produk</label>
                        <input type="text" id="prodName" wire:model="productName"
                            class="block w-full rounded-full border border-cu-line bg-cu-surface px-4 py-2.5 text-sm text-cu-ink focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
                        @error('productName')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>

                    <div>
                        <label for="prodVariantName" class="block text-sm font-semibold text-cu-ink mb-1.5">Varian (Bisa Kosong)</label>
                        <input type="text" id="prodVariantName" wire:model="productVariantName" placeholder="Misal: Black, White, 64GB"
                            class="block w-full rounded-full border border-cu-line bg-cu-surface px-4 py-2.5 text-sm text-cu-ink focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
                        @error('productVariantName')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>

                    <div>
                        <label for="prodNormalPrice" class="block text-sm font-semibold text-cu-ink mb-1.5">Harga Normal</label>
                        <input type="number" id="prodNormalPrice" wire:model="productNormalPrice" placeholder="Misal: 399000"
                            class="block w-full rounded-full border border-cu-line bg-cu-surface px-4 py-2.5 text-sm text-cu-ink focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
                        @error('productNormalPrice')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>

                    <div>
                        <label for="prodDiscountPrice" class="block text-sm font-semibold text-cu-ink mb-1.5">Harga Diskon</label>
                        <input type="number" id="prodDiscountPrice" wire:model="productDiscountPrice" placeholder="Misal: 199000"
                            class="block w-full rounded-full border border-cu-line bg-cu-surface px-4 py-2.5 text-sm text-cu-ink focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
                        @error('productDiscountPrice')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="pt-5 border-t border-cu-line/60 flex justify-end gap-3">
                        <button type="button" wire:click="$set('showProductModal', false)"
                            class="rounded-full border border-cu-line bg-cu-surface px-5 py-2 text-xs font-bold uppercase tracking-wider text-cu-ink hover:bg-cu-panel-soft transition duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
                            Batal
                        </button>
                        <button type="submit"
                            class="rounded-full bg-cu-ink px-5 py-2 text-xs font-bold uppercase tracking-wider text-cu-surface hover:bg-cu-ink-hover transition duration-300 shadow-md focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
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
