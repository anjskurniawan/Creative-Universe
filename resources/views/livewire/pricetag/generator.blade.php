<div>
    <!-- Tabs Header -->
    <div class="mb-6 border-b border-cu-line bg-cu-surface rounded-t-xl p-1 flex gap-2">
        <button wire:click="selectTab('single')"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition duration-200 {{ $activeTab === 'single' ? 'bg-cu-panel-soft text-cu-ink font-semibold border-b-2 border-cu-focus' : 'text-cu-muted hover:text-cu-ink' }}">
            <x-material-icon name="edit_note" size="sm" />
            Buat Label Satuan
        </button>
        <button wire:click="selectTab('checklist')"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition duration-200 {{ $activeTab === 'checklist' ? 'bg-cu-panel-soft text-cu-ink font-semibold border-b-2 border-cu-focus' : 'text-cu-muted hover:text-cu-ink' }}">
            <x-material-icon name="checklist" size="sm" />
            Buat Label Sekaligus (Pilihan)
        </button>
        <button wire:click="selectTab('bulk')"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition duration-200 {{ $activeTab === 'bulk' ? 'bg-cu-panel-soft text-cu-ink font-semibold border-b-2 border-cu-focus' : 'text-cu-muted hover:text-cu-ink' }}">
            <x-material-icon name="upload_file" size="sm" />
            Buat Label Massal (Upload CSV)
        </button>
    </div>

    <!-- Buat Label Satuan Panel -->
    @if ($activeTab === 'single')
        <!-- Modern Stepper Indicator -->
        <div class="mb-8 bg-cu-surface border border-cu-line rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between max-w-xl mx-auto">
                <!-- Step 1 Category -->
                <div class="flex flex-col items-center gap-1.5">
                    <div class="size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 {{ $wizardStep >= 1 ? 'bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10' : 'bg-cu-panel-soft text-cu-muted border border-cu-line' }}">
                        1
                    </div>
                    <span class="text-[10px] uppercase font-bold tracking-wider {{ $wizardStep >= 1 ? 'text-cu-ink' : 'text-cu-muted' }}">Kategori</span>
                </div>

                <div class="h-0.5 flex-1 mx-2 transition-all duration-300 {{ $wizardStep >= 2 ? 'bg-cu-ink' : 'bg-cu-line' }}"></div>

                <!-- Step 2 Product -->
                <div class="flex flex-col items-center gap-1.5">
                    <div class="size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 {{ $wizardStep >= 2 ? 'bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10' : 'bg-cu-panel-soft text-cu-muted border border-cu-line' }}">
                        2
                    </div>
                    <span class="text-[10px] uppercase font-bold tracking-wider {{ $wizardStep >= 2 ? 'text-cu-ink' : 'text-cu-muted' }}">Produk</span>
                </div>

                <div class="h-0.5 flex-1 mx-2 transition-all duration-300 {{ $wizardStep >= 3 ? 'bg-cu-ink' : 'bg-cu-line' }}"></div>

                <!-- Step 3 Variant -->
                <div class="flex flex-col items-center gap-1.5">
                    <div class="size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 {{ $wizardStep >= 3 ? 'bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10' : 'bg-cu-panel-soft text-cu-muted border border-cu-line' }}">
                        3
                    </div>
                    <span class="text-[10px] uppercase font-bold tracking-wider {{ $wizardStep >= 3 ? 'text-cu-ink' : 'text-cu-muted' }}">Varian</span>
                </div>

                <div class="h-0.5 flex-1 mx-2 transition-all duration-300 {{ $wizardStep >= 4 ? 'bg-cu-ink' : 'bg-cu-line' }}"></div>

                <!-- Step 4 Price -->
                <div class="flex flex-col items-center gap-1.5">
                    <div class="size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 {{ $wizardStep >= 4 ? 'bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10' : 'bg-cu-panel-soft text-cu-muted border border-cu-line' }}">
                        4
                    </div>
                    <span class="text-[10px] uppercase font-bold tracking-wider {{ $wizardStep >= 4 ? 'text-cu-ink' : 'text-cu-muted' }}">Harga</span>
                </div>

                <div class="h-0.5 flex-1 mx-2 transition-all duration-300 {{ $wizardStep >= 6 ? 'bg-cu-ink' : 'bg-cu-line' }}"></div>

                <!-- Step 5 Result -->
                <div class="flex flex-col items-center gap-1.5">
                    <div class="size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 {{ $wizardStep >= 6 ? 'bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10' : 'bg-cu-panel-soft text-cu-muted border border-cu-line' }}">
                        <x-material-icon name="check" size="xs" />
                    </div>
                    <span class="text-[10px] uppercase font-bold tracking-wider {{ $wizardStep >= 6 ? 'text-cu-ink' : 'text-cu-muted' }}">Selesai</span>
                </div>
            </div>
        </div>

        <!-- Step 1: Kategori Selection -->
        @if ($wizardStep === 1)
            <x-app-panel padding="lg" class="shadow-sm max-w-xl mx-auto">
                <h3 class="text-base font-bold text-cu-ink mb-4">Pilih Kategori Produk</h3>
                
                <!-- Search Bar -->
                <div class="relative mb-4">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-cu-muted">
                        <x-material-icon name="search" size="sm" />
                    </span>
                    <input type="text" wire:model.live="wizardCategorySearch"
                        class="block w-full rounded-xl border border-cu-line bg-cu-surface py-3 pl-10 pr-4 text-sm text-cu-ink placeholder:text-cu-muted/70 focus:border-cu-focus focus:outline-none focus:ring-1 focus:ring-cu-focus transition"
                        placeholder="Cari kategori...">
                </div>

                <!-- Category List -->
                <div class="divide-y divide-cu-line/60 border border-cu-line rounded-2xl overflow-hidden bg-cu-surface shadow-sm">
                    @forelse ($wizardCategoriesList as $cat)
                        <button type="button" wire:click="selectWizardCategory({{ $cat->id }})"
                            class="w-full flex items-center justify-between p-4 hover:bg-cu-panel-soft/50 transition text-left group">
                            <span class="text-sm font-semibold text-cu-ink group-hover:text-cu-focus transition-colors">{{ $cat->name }}</span>
                            <div class="text-cu-muted group-hover:text-cu-ink transition">
                                <x-material-icon name="chevron_right" size="sm" />
                            </div>
                        </button>
                    @empty
                        <div class="p-8 text-center text-xs text-cu-muted">
                            Tidak menemukan kategori "{{ $wizardCategorySearch }}"
                        </div>
                    @endforelse
                </div>
            </x-app-panel>
        @endif

        <!-- Step 2: Produk Selection -->
        @if ($wizardStep === 2)
            <x-app-panel padding="lg" class="shadow-sm max-w-xl mx-auto">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-base font-bold text-cu-ink">Pilih Produk</h3>
                    <button type="button" wire:click="$set('wizardStep', 1)" class="inline-flex items-center gap-1 text-xs text-cu-muted hover:text-cu-ink transition">
                        <x-material-icon name="arrow_back" size="xs" /> Kembali
                    </button>
                </div>

                <!-- Search Bar -->
                <div class="relative mb-4">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-cu-muted">
                        <x-material-icon name="search" size="sm" />
                    </span>
                    <input type="text" wire:model.live="wizardProductSearch"
                        class="block w-full rounded-xl border border-cu-line bg-cu-surface py-3 pl-10 pr-4 text-sm text-cu-ink placeholder:text-cu-muted/70 focus:border-cu-focus focus:outline-none focus:ring-1 focus:ring-cu-focus transition"
                        placeholder="Cari produk...">
                </div>

                <!-- Product List -->
                <div class="divide-y divide-cu-line/60 border border-cu-line rounded-2xl overflow-hidden bg-cu-surface shadow-sm">
                    @forelse ($wizardProductsList as $prodName)
                        <button type="button" wire:click="selectWizardProduct('{{ addslashes($prodName) }}')"
                            class="w-full flex items-center justify-between p-4 hover:bg-cu-panel-soft/50 transition text-left group">
                            <span class="text-sm font-semibold text-cu-ink group-hover:text-cu-focus transition-colors">{{ $prodName }}</span>
                            <div class="text-cu-muted group-hover:text-cu-ink transition">
                                <x-material-icon name="chevron_right" size="sm" />
                            </div>
                        </button>
                    @empty
                        <div class="p-8 text-center text-xs text-cu-muted">
                            Tidak menemukan produk "{{ $wizardProductSearch }}"
                        </div>
                    @endforelse
                </div>
            </x-app-panel>
        @endif

        <!-- Step 3: Varian Selection -->
        @if ($wizardStep === 3)
            <x-app-panel padding="lg" class="shadow-sm max-w-xl mx-auto">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-base font-bold text-cu-ink">Pilih Varian</h3>
                    <button type="button" wire:click="$set('wizardStep', 2)" class="inline-flex items-center gap-1 text-xs text-cu-muted hover:text-cu-ink transition">
                        <x-material-icon name="arrow_back" size="xs" /> Kembali
                    </button>
                </div>

                <!-- Search Bar -->
                <div class="relative mb-4">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-cu-muted">
                        <x-material-icon name="search" size="sm" />
                    </span>
                    <input type="text" wire:model.live="wizardVariantSearch"
                        class="block w-full rounded-xl border border-cu-line bg-cu-surface py-3 pl-10 pr-4 text-sm text-cu-ink placeholder:text-cu-muted/70 focus:border-cu-focus focus:outline-none focus:ring-1 focus:ring-cu-focus transition"
                        placeholder="Cari varian...">
                </div>

                <!-- Variant List -->
                <div class="divide-y divide-cu-line/60 border border-cu-line rounded-2xl overflow-hidden bg-cu-surface shadow-sm">
                    @forelse ($wizardVariantsList as $v)
                        <button type="button" wire:click="selectWizardVariant({{ $v->id }})"
                            class="w-full flex items-center justify-between p-4 hover:bg-cu-panel-soft/50 transition text-left group">
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-cu-ink group-hover:text-cu-focus transition-colors">{{ $v->variant_name }}</span>
                                </div>
                                <span class="text-xs text-cu-muted">Harga Normal: Rp{{ number_format($v->normal_price, 0, ',', '.') }}</span>
                            </div>
                            <div class="text-cu-muted group-hover:text-cu-ink transition">
                                <x-material-icon name="chevron_right" size="sm" />
                            </div>
                        </button>
                    @empty
                        <div class="p-8 text-center text-xs text-cu-muted">
                            Tidak menemukan varian "{{ $wizardVariantSearch }}"
                        </div>
                    @endforelse
                </div>
            </x-app-panel>
        @endif

        <!-- Step 4: Harga Promo -->
        @if ($wizardStep === 4)
            <x-app-panel padding="lg" class="shadow-sm max-w-xl mx-auto">
                <div class="flex items-center justify-between mb-5 border-b border-cu-line pb-3">
                    <h3 class="text-base font-bold text-cu-ink">Atur Harga Promo</h3>
                    <button type="button" wire:click="backFromStep4()" class="inline-flex items-center gap-1 text-xs text-cu-muted hover:text-cu-ink transition">
                        <x-material-icon name="arrow_back" size="xs" /> Kembali
                    </button>
                </div>

                @if (session()->has('error_single'))
                    <div class="mb-5">
                        <x-app-alert type="danger">
                            {{ session('error_single') }}
                        </x-app-alert>
                    </div>
                @endif

                <form wire:submit.prevent="generateSingleWizard" class="space-y-5">
                    <!-- Product Info Card inside form -->
                    <div class="p-4 rounded-xl bg-cu-surface-soft border border-cu-line/60 space-y-2.5">
                        <div class="grid grid-cols-2 gap-y-2 text-xs">
                            <span class="text-cu-muted">Kategori</span>
                            <span class="font-bold text-cu-ink text-right">{{ $selectedProductModel->category->name }}</span>

                            <span class="text-cu-muted">Produk</span>
                            <span class="font-bold text-cu-ink text-right">{{ $selectedProductModel->name }}</span>

                            <span class="text-cu-muted">Varian</span>
                            <span class="font-semibold text-cu-ink text-right font-mono">{{ $selectedProductModel->variant_name }}</span>

                            <span class="text-cu-muted">Harga Normal</span>
                            <span class="font-bold text-cu-ink text-right">Rp{{ number_format($selectedProductModel->normal_price, 0, ',', '.') }}</span>
                        </div>
                    </div>

                    <!-- Harga Diskon -->
                    <div>
                        <label for="wizardDiscountPrice" class="block text-sm font-medium text-cu-ink mb-1.5">Harga Promo / Diskon</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-cu-muted">Rp</span>
                            <input type="number" id="wizardDiscountPrice" wire:model="wizardDiscountPrice"
                                class="block w-full rounded-lg border border-cu-line bg-cu-surface py-2.5 pl-9 pr-3 text-sm text-cu-ink focus:border-cu-focus focus:outline-none focus:ring-1 focus:ring-cu-focus"
                                placeholder="0">
                        </div>
                        @error('wizardDiscountPrice')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="pt-4 border-t border-cu-line flex items-center gap-3">
                        <button type="submit"
                            class="inline-flex items-center justify-center gap-2 rounded-lg bg-cu-ink px-5 py-2.5 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover shadow-sm">
                            <x-material-icon name="photo_filter" size="sm" />
                            <span>Buat Gambar Label</span>
                        </button>
                    </div>
                </form>
            </x-app-panel>
        @endif

        <!-- Step 5: Loading Bar -->
        @if ($wizardStep === 5)
            <x-app-panel padding="lg" class="shadow-sm max-w-xl mx-auto text-center py-12" wire:init="processSingleGeneration">
                <div class="flex flex-col items-center justify-center space-y-6">
                    <!-- Custom Spinner/Pulse ring -->
                    <div class="relative flex items-center justify-center">
                        <span class="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-cu-info opacity-20"></span>
                        <div class="size-16 rounded-full bg-cu-info-soft flex items-center justify-center text-cu-info shadow-sm">
                            <x-material-icon name="cloud_sync" size="md" class="animate-pulse" />
                        </div>
                    </div>

                    <div class="space-y-2 max-w-sm">
                        <h3 class="text-base font-bold text-cu-ink">Sedang Menyusun Gambar Label</h3>
                        <p class="text-xs text-cu-muted">Sistem Creative Universe sedang menyusun layout promo dan menghasilkan gambar. Harap tunggu...</p>
                    </div>

                    <div class="w-full space-y-2">
                        <div class="cu-loading-bar">
                            <div class="cu-loading-bar-value"></div>
                        </div>
                    </div>
                </div>
            </x-app-panel>
        @endif

        <!-- Step 6: Hasil / Result -->
        @if ($wizardStep === 6)
            <x-app-panel padding="lg" class="shadow-sm max-w-xl mx-auto text-center py-12">
                <div class="flex flex-col items-center justify-center space-y-5">
                    <div class="size-16 rounded-full bg-cu-success-soft text-cu-success flex items-center justify-center shadow-sm">
                        <x-material-icon name="check_circle" size="lg" />
                    </div>

                    <div class="space-y-1">
                        <h3 class="text-lg font-bold text-cu-ink">Label Berhasil Dibuat!</h3>
                        <p class="text-xs text-cu-muted">Label promo untuk produk <span class="font-bold">{{ $selectedProductModel->name }}</span> telah siap.</p>
                    </div>

                    <!-- Preview Actions -->
                    <div class="flex flex-col sm:flex-row gap-3 w-full justify-center pt-4 border-t border-cu-line/40">
                        @if ($generatedViewUrl)
                            <a href="{{ $generatedViewUrl }}" target="_blank" rel="noopener noreferrer"
                                class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cu-line bg-cu-surface px-4 py-2 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft">
                                <x-material-icon name="visibility" size="xs" />
                                Lihat Label
                            </a>
                        @endif
                        @if ($generatedDownloadUrl)
                            <a href="{{ $generatedDownloadUrl }}" target="_blank" rel="noopener noreferrer"
                                class="flex items-center justify-center gap-1.5 rounded-lg bg-cu-ink px-4 py-2 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover shadow-sm">
                                <x-material-icon name="download" size="xs" />
                                Unduh Gambar
                            </a>
                        @endif
                    </div>

                    <div class="pt-4">
                        <button type="button" wire:click="resetWizard"
                            class="inline-flex items-center gap-1 text-xs font-semibold text-cu-info hover:underline">
                            <x-material-icon name="replay" size="xs" /> Buat Label Lainnya
                        </button>
                    </div>
                </div>
            </x-app-panel>
        @endif
    @endif

    <!-- Checklist Multi Generate Panel -->
    @if ($activeTab === 'checklist')
        <div class="space-y-6">
            <x-app-panel padding="lg" class="shadow-sm">
                <div class="flex items-start justify-between border-b border-cu-line pb-4 mb-5">
                    <div>
                        <h2 class="text-lg font-semibold text-cu-ink">Buat Banyak Label Sekaligus</h2>
                        <p class="text-xs text-cu-muted mt-1">Pilih beberapa produk di bawah untuk dibuat label harganya secara bersamaan lewat antrean sistem.</p>
                    </div>
                </div>

                @if (session()->has('success_checklist'))
                    <div class="mb-6">
                        <x-app-alert type="success">
                            {{ session('success_checklist') }}
                        </x-app-alert>
                    </div>
                @endif

                @if (session()->has('error_checklist'))
                    <div class="mb-6">
                        <x-app-alert type="danger">
                            {{ session('error_checklist') }}
                        </x-app-alert>
                    </div>
                @endif

                <!-- Loading Bar Sedang Memproses Checklist -->
                <div wire:loading wire:target="generateChecklist" class="w-full space-y-2 mb-6">
                    <div class="flex items-center justify-between text-xs text-cu-info font-medium">
                        <span>Sedang memasukkan data ke antrean sistem, mohon tunggu sejenak...</span>
                        <span class="animate-pulse">Memuat</span>
                    </div>
                    <div class="cu-loading-bar">
                        <div class="cu-loading-bar-value"></div>
                    </div>
                </div>

                <form wire:submit.prevent="generateChecklist" class="space-y-5">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <!-- Nama Batch -->
                        <div>
                            <label for="checklistBatchName" class="block text-sm font-medium text-cu-ink mb-1.5">Nama Kelompok Promo</label>
                            <input type="text" id="checklistBatchName" wire:model="checklistBatchName"
                                class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink placeholder-cu-muted focus:border-cu-focus focus:outline-none focus:ring-1 focus:ring-cu-focus"
                                placeholder="Contoh: Promo Akhir Tahun Audio">
                            @error('checklistBatchName')
                                <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                            @enderror
                        </div>

                        <!-- Pencarian Varian -->
                        <div>
                            <label for="checklistSearch" class="block text-sm font-medium text-cu-ink mb-1.5">Cari Produk</label>
                            <div class="relative">
                                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cu-muted">
                                    <x-material-icon name="search" size="sm" />
                                </div>
                                <input type="search" id="checklistSearch" wire:model.live.debounce.300ms="checklistSearch"
                                    class="block w-full rounded-lg border border-cu-line bg-cu-surface py-2 pl-10 pr-4 text-sm text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-focus focus:outline-none"
                                    placeholder="Cari nama produk...">
                            </div>
                        </div>
                    </div>

                    <!-- Checklist Table -->
                    <div class="border border-cu-line rounded-lg overflow-hidden bg-cu-surface">
                        <div class="bg-cu-panel-soft px-4 py-3 flex items-center justify-between border-b border-cu-line text-xs font-semibold text-cu-muted">
                            <div class="flex items-center gap-3">
                                <span>Pilihan: {{ count($selectedVariants) }} Produk Terpilih</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <button type="button" wire:click="$set('selectedVariants', {{ json_encode($checklistVariants->pluck('id')->toArray()) }})"
                                    class="text-cu-info hover:text-cu-info-hover transition">
                                    Pilih Semua di Halaman Ini
                                </button>
                                <span class="text-cu-line">|</span>
                                <button type="button" wire:click="$set('selectedVariants', [])"
                                    class="text-cu-muted hover:text-cu-ink transition">
                                    Bersihkan Pilihan
                                </button>
                            </div>
                        </div>
                        
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr class="border-b border-cu-line bg-cu-panel-soft/50 text-xs font-semibold uppercase tracking-wider text-cu-muted">
                                        <th class="px-6 py-3 text-center w-12">Pilih</th>
                                        <th class="px-6 py-3">Varian</th>
                                        <th class="px-6 py-3">Nama Produk</th>
                                        <th class="px-6 py-3">Kategori</th>
                                        <th class="px-6 py-3 text-right">Harga Normal</th>
                                        <th class="px-6 py-3 text-right text-cu-success">Harga Diskon</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-cu-line">
                                    @forelse ($checklistVariants as $var)
                                        <tr class="hover:bg-cu-panel-soft/30 transition-colors">
                                            <td class="px-6 py-4 text-center">
                                                <input type="checkbox" wire:model.live="selectedVariants" value="{{ $var->id }}"
                                                    class="rounded border-cu-line text-cu-focus focus:ring-cu-focus size-4">
                                            </td>
                                            <td class="px-6 py-4 font-medium text-cu-ink">{{ $var->variant_name }}</td>
                                            <td class="px-6 py-4">
                                                <div class="font-semibold text-cu-ink">{{ $var->name }}</div>
                                            </td>
                                            <td class="px-6 py-4 text-cu-muted">{{ $var->category->name ?? '-' }}</td>
                                            <td class="px-6 py-4 text-right font-medium text-cu-ink">
                                                Rp{{ number_format($var->normal_price, 0, ',', '.') }}
                                            </td>
                                            <td class="px-6 py-4 text-right">
                                                <div class="relative max-w-[150px] ml-auto">
                                                    <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs font-semibold text-cu-muted">Rp</span>
                                                    <input type="number" wire:model="checklistPrices.{{ $var->id }}" placeholder="{{ $var->discount_price }}"
                                                        class="block w-full rounded-lg border border-cu-line bg-cu-surface py-1 pl-8 pr-2 text-right text-sm text-cu-ink focus:border-cu-focus focus:outline-none">
                                                </div>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="6" class="px-6 py-8 text-center text-cu-muted">
                                                Tidak ada produk yang ditemukan.
                                            </td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>

                        @if ($checklistVariants->hasPages())
                            <div class="border-t border-cu-line px-6 py-4 bg-cu-panel-soft/20">
                                {{ $checklistVariants->links() }}
                            </div>
                        @endif
                    </div>

                    @error('selectedVariants')
                        <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                    @enderror

                    <!-- Submit Section -->
                    <div class="pt-4 border-t border-cu-line flex items-center gap-3">
                        <button type="submit" wire:loading.attr="disabled"
                            class="inline-flex items-center justify-center gap-2 rounded-lg bg-cu-ink px-4 py-2 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:opacity-50">
                            <x-material-icon name="playlist_play" size="sm" wire:loading.remove wire:target="generateChecklist" />
                            <svg class="animate-spin h-4 w-4 text-cu-surface" wire:loading wire:target="generateChecklist" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Buat Label Terpilih</span>
                        </button>
                    </div>

                </form>
            </x-app-panel>
        </div>
    @endif

    <!-- Bulk Upload Panel -->
    @if ($activeTab === 'bulk')
        <div class="max-w-3xl">
            <x-app-panel padding="lg" class="shadow-sm">
                <div class="flex items-start justify-between border-b border-cu-line pb-4 mb-5">
                    <div>
                        <h2 class="text-lg font-semibold text-cu-ink">Buat Label Massal via File CSV</h2>
                        <p class="text-xs text-cu-muted mt-1">Buat label harga dalam jumlah besar secara otomatis dengan mengunggah file daftar produk.</p>
                    </div>
                    <a href="#" onclick="downloadCSVTemplate()"
                        class="inline-flex items-center gap-1 text-xs font-semibold text-cu-info hover:underline">
                        <x-material-icon name="download_for_offline" size="sm" />
                        Download Template CSV
                    </a>
                </div>

                @if (session()->has('success_bulk'))
                    <div class="mb-6">
                        <x-app-alert type="success">
                            {{ session('success_bulk') }}
                        </x-app-alert>
                    </div>
                @endif

                @if (session()->has('error_bulk'))
                    <div class="mb-6">
                        <x-app-alert type="danger">
                            {{ session('error_bulk') }}
                        </x-app-alert>
                    </div>
                @endif

                <!-- Loading Bar Sedang Memproses Bulk -->
                <div wire:loading wire:target="generateBulk" class="w-full space-y-2 mb-6">
                    <div class="flex items-center justify-between text-xs text-cu-info font-medium">
                        <span>Mengunggah daftar produk dan memasukkan ke antrean sistem...</span>
                        <span class="animate-pulse">Memuat</span>
                    </div>
                    <div class="cu-loading-bar">
                        <div class="cu-loading-bar-value"></div>
                    </div>
                </div>

                <form wire:submit.prevent="generateBulk" class="space-y-5">
                    <!-- Nama Batch -->
                    <div>
                        <label for="batchName" class="block text-sm font-medium text-cu-ink mb-1.5">Nama Kelompok Promo</label>
                        <input type="text" id="batchName" wire:model="bulkForm.batchName"
                            class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink placeholder-cu-muted focus:border-cu-focus focus:outline-none focus:ring-1 focus:ring-cu-focus"
                            placeholder="Misal: Promo Harbolnas 12.12">
                        @error('bulkForm.batchName')
                            <span class="text-xs text-cu-danger mt-1 block">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Upload File CSV -->
                    <div>
                        <label class="block text-sm font-medium text-cu-ink mb-1.5">File CSV</label>
                        <div class="flex items-center justify-center w-full">
                            <label class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-cu-line rounded-lg cursor-pointer bg-cu-surface hover:bg-cu-panel-soft transition duration-200">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <x-material-icon name="cloud_upload" class="text-cu-soft mb-2" size="lg" />
                                    <p class="mb-1 text-sm text-cu-ink"><span class="font-semibold">Klik untuk memilih file</span> atau tarik file ke sini</p>
                                    <p class="text-xs text-cu-muted">File CSV (Maks. 2MB)</p>
                                    
                                    @if ($bulkForm->csvFile)
                                        <div class="mt-3 flex items-center gap-1.5 rounded-full bg-cu-info-soft border border-cu-info/20 px-3 py-1 text-xs text-cu-info font-medium">
                                            <x-material-icon name="insert_drive_file" size="xs" />
                                            {{ $bulkForm->csvFile->getClientOriginalName() }}
                                        </div>
                                    @endif
                                </div>
                                <input type="file" wire:model="bulkForm.csvFile" class="hidden" accept=".csv" />
                            </label>
                        </div>
                        @error('bulkForm.csvFile')
                            <span class="text-xs text-cu-danger mt-2 block">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Warning limitations -->
                    <div class="rounded-lg bg-cu-warning-soft border border-cu-warning/20 p-4 flex gap-3">
                        <x-material-icon name="info" class="text-cu-warning shrink-0" size="sm" />
                        <div class="text-xs text-cu-warning-hover leading-relaxed">
                            <span class="font-bold">Informasi Antrean Pemrosesan:</span>
                            Sistem Creative Universe akan memproses daftar produk Anda secara bertahap dalam antrean untuk menjamin kestabilan dan kecepatan pembuatan gambar.
                        </div>
                    </div>

                    <div class="pt-4 border-t border-cu-line flex items-center gap-3">
                        <button type="submit" wire:loading.attr="disabled"
                            class="inline-flex items-center justify-center gap-2 rounded-lg bg-cu-ink px-4 py-2 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:opacity-50">
                            <x-material-icon name="queue" size="sm" wire:loading.remove wire:target="generateBulk" />
                            <svg class="animate-spin h-4 w-4 text-cu-surface" wire:loading wire:target="generateBulk" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Mulai Membuat Label Massal</span>
                        </button>
                    </div>

                </form>
            </x-app-panel>
        </div>
    @endif

    <script>
        /**
         * Download client-side generated CSV template.
         */
        function downloadCSVTemplate() {
            const csvContent = "data:text/csv;charset=utf-8,produk,varian,harga_diskon\nJETE TWS T10,Black,199000\nJETE TWS T10,White,199000\nJETE Powerbank H1,Black,149000\n";
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "pricetag_bulk_generate_template.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    </script>
</div>
