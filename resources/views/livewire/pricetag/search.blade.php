<div>
    <!-- Search & Control Header -->
    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
        <!-- Back Button / Title Context -->
        <div class="flex items-center gap-3">
            @if ($selectedCategory)
                <button type="button" wire:click="selectCategory(null)"
                    class="inline-flex size-9 items-center justify-center rounded-full border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft transition shadow-sm"
                    title="Kembali ke Kategori">
                    <x-material-icon class="cu-icon-arrow-back" size="sm" />
                </button>
                <div>
                    <h2 class="text-lg font-bold text-cu-ink leading-tight">{{ $selectedCategory->name }}</h2>
                    <p class="text-xs text-cu-muted">Daftar produk dan status pricetag</p>
                </div>
            @else
                <div>
                    <h2 class="text-lg font-bold text-cu-ink leading-tight">Cari Kategori</h2>
                    <p class="text-xs text-cu-muted">Pilih kategori untuk melihat detail pricetag produk</p>
                </div>
            @endif
        </div>

        <!-- Search Input & Loading indicator -->
        <div class="flex items-center gap-4 flex-1 max-w-md md:ml-auto">
            <div class="relative w-full">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-cu-muted">
                    <x-material-icon class="cu-icon-search" size="sm" />
                </div>
                <input type="search" wire:model.live.debounce.300ms="search"
                    class="block w-full rounded-full border border-cu-line bg-cu-surface py-2.5 pl-11 pr-4 text-sm text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                    placeholder="{{ $selectedCategory ? 'Cari produk...' : 'Cari kategori...' }}">
            </div>

            <div wire:loading class="text-xs text-cu-muted animate-pulse flex items-center gap-1.5 shrink-0">
                <svg class="animate-spin h-3.5 w-3.5 text-cu-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        </div>
    </div>

    <!-- Category Grid View (selectedCategory === null) -->
    @if (!$selectedCategory)
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            @forelse ($categories as $category)
                <div wire:click="selectCategory({{ $category->id }})"
                    class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-cu-line bg-cu-surface p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
                    <div class="flex items-center gap-3 w-full">
                        <!-- Icon on the left -->
                        <div class="size-8 rounded-lg bg-cu-panel-soft flex items-center justify-center text-cu-muted group-hover:text-cu-focus group-hover:bg-cu-focus/10 transition-colors shrink-0">
                            <x-material-icon class="cu-icon-category" size="xs" />
                        </div>
                        <!-- Group of text on the right (stacked vertically) -->
                        <div class="flex flex-col min-w-0">
                            <span class="text-[9px] font-bold text-cu-muted tracking-wide uppercase">
                                {{ $category->products_count }} Produk
                            </span>
                            <h3 class="text-sm font-extrabold text-cu-ink group-hover:text-cu-focus transition-colors line-clamp-1 leading-tight mt-0.5">
                                {{ $category->name }}
                            </h3>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-full">
                    <x-app-panel padding="lg" class="text-center text-cu-muted border-dashed py-12">
                        <div class="flex flex-col items-center justify-center gap-2">
                            <x-material-icon size="lg" class="cu-icon-search-off text-cu-soft" />
                            <h3 class="text-sm font-medium text-cu-ink">Kategori Tidak Ditemukan</h3>
                            <p class="text-xs text-cu-muted max-w-sm">Coba cari dengan kata kunci kategori yang lain.</p>
                        </div>
                    </x-app-panel>
                </div>
            @endforelse
        </div>

        <!-- Pagination Categories -->
        @if ($categories && $categories->hasPages())
            <div class="mt-6">
                {{ $categories->links() }}
            </div>
        @endif
    @else
        <!-- Product Grid View with Collapse & Expand System -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start">
            @forelse ($products as $product)
                @php
                    $viewLink = $product->assetLinks->firstWhere('label', 'Google Drive View Link');
                    $downloadLink = $product->assetLinks->firstWhere('label', 'Google Drive Download Link') ?? $viewLink;
                    $isReady = !empty($viewLink);
                @endphp
                <div x-data="{ expanded: false }"
                    class="relative flex flex-col overflow-hidden rounded-2xl border border-cu-line bg-cu-surface p-4 shadow-sm hover:shadow-md transition-all duration-200 group">
                    
                    <!-- Collapsed Top Header (Name and Variant Inline, Toggle Button right) -->
                    <div class="flex items-center justify-between gap-3 w-full cursor-pointer select-none" @click="expanded = !expanded">
                        <div class="flex items-center gap-2 flex-1 min-w-0">
                            <!-- Left status dot indicator -->
                            <div class="size-2 rounded-full shrink-0 transition-colors duration-200" :class="expanded ? 'bg-cu-focus' : 'bg-cu-muted'"></div>
                            <h3 class="text-sm font-bold text-cu-ink truncate" :class="expanded ? 'text-cu-focus' : ''">
                                {{ $product->name }}@if($product->variant_name && $product->variant_name !== 'Default') <span class="text-cu-muted font-normal text-xs ml-1">({{ $product->variant_name }})</span>@endif
                            </h3>
                        </div>
                        
                        <!-- Small Toggle Button -->
                        <button type="button" 
                            class="inline-flex size-6 items-center justify-center rounded-md border border-cu-line bg-cu-surface transition shadow-sm shrink-0">
                            <x-material-icon class="cu-icon-chevron-right transition-transform duration-200" size="xs" ::class="expanded ? 'rotate-90 text-cu-focus' : 'text-cu-muted'" />
                        </button>
                    </div>

                    <!-- Expanded Detailed Content -->
                    <div x-show="expanded" 
                        x-transition:enter="transition ease-out duration-200" 
                        x-transition:enter-start="opacity-0 -translate-y-2" 
                        x-transition:enter-end="opacity-100 translate-y-0"
                        class="mt-3 pt-3 border-t border-cu-line/50 space-y-3">
                        
                        <!-- Category Name & Status Badge -->
                        <div class="flex items-center justify-between">
                            <span class="text-[9px] font-bold text-cu-muted tracking-wider uppercase">
                                {{ $selectedCategory->name }}
                            </span>
                            @if ($isReady)
                                <span class="inline-flex items-center gap-1 rounded-full bg-cu-success-soft px-2 py-0.5 text-[9px] text-cu-success font-semibold border border-cu-success/20">
                                    <x-material-icon size="xs" class="cu-icon-check-circle text-cu-success" />
                                    Ready
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 rounded-full bg-cu-panel-soft px-2 py-0.5 text-[9px] text-cu-muted font-semibold border border-cu-line">
                                    <x-material-icon size="xs" class="cu-icon-info text-cu-muted" />
                                    Tidak Ready
                                </span>
                            @endif
                        </div>

                        <!-- Modern Price Sticker -->
                        <div class="flex items-baseline gap-2 p-2 rounded-xl bg-cu-surface-soft border border-cu-line/40">
                            <div class="flex flex-col">
                                <span class="text-[9px] uppercase tracking-wider text-cu-muted line-through">
                                    Rp{{ number_format($product->normal_price, 0, ',', '.') }}
                                </span>
                                <span class="text-xs font-extrabold text-cu-success">
                                    Rp{{ number_format($product->discount_price, 0, ',', '.') }}
                                </span>
                            </div>
                            <span class="ml-auto text-[8px] uppercase tracking-wider font-bold text-cu-success-hover bg-cu-success-soft px-1.5 py-0.5 rounded">
                                Promo
                            </span>
                        </div>

                        <!-- Last Update & 3 action buttons -->
                        <div class="flex items-center justify-between pt-1 text-[9px] text-cu-muted">
                            <div class="flex flex-col">
                                <span class="text-[8px] uppercase tracking-wider text-cu-muted">Update</span>
                                <span class="font-semibold text-cu-ink text-[9px]">
                                    @if($isReady && $viewLink->updated_at)
                                        {{ $viewLink->updated_at->setTimezone('Asia/Jakarta')->format('d M y, H:i') }}
                                    @else
                                        Belum digenerate
                                    @endif
                                </span>
                            </div>

                            <div class="flex items-center gap-1">
                                <!-- Preview Button -->
                                @if ($isReady && $viewLink)
                                    <a href="{{ $viewLink->url }}" target="_blank" rel="noopener noreferrer"
                                        class="inline-flex size-6 items-center justify-center rounded-md border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft transition shadow-sm"
                                        title="Lihat Gambar">
                                        <x-material-icon class="cu-icon-visibility" size="xs" />
                                    </a>
                                @else
                                    <span class="inline-flex size-6 items-center justify-center rounded-md border border-cu-line/40 bg-cu-panel-soft/50 text-cu-soft cursor-not-allowed shadow-none"
                                        title="Belum digenerate">
                                        <x-material-icon class="cu-icon-visibility" size="xs" />
                                    </span>
                                @endif

                                <!-- Download Button -->
                                @if ($isReady && $downloadLink)
                                    <a href="{{ $downloadLink->url }}" target="_blank" rel="noopener noreferrer"
                                        class="inline-flex size-6 items-center justify-center rounded-md border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft transition shadow-sm"
                                        title="Unduh Gambar">
                                        <x-material-icon class="cu-icon-download" size="xs" />
                                    </a>
                                @else
                                    <span class="inline-flex size-6 items-center justify-center rounded-md border border-cu-line/40 bg-cu-panel-soft/50 text-cu-soft cursor-not-allowed shadow-none"
                                        title="Belum digenerate">
                                        <x-material-icon class="cu-icon-download" size="xs" />
                                    </span>
                                @endif

                                <!-- Edit Button -->
                                <a href="{{ route('pricetag.generator', ['product_id' => $product->id]) }}" wire:navigate
                                    class="inline-flex size-6 items-center justify-center rounded-md bg-cu-ink text-cu-surface hover:bg-cu-ink-hover transition shadow-sm"
                                    title="Edit Harga Promo">
                                    <x-material-icon class="cu-icon-edit" size="xs" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-full">
                    <x-app-panel padding="lg" class="text-center text-cu-muted border-dashed py-12">
                        <div class="flex flex-col items-center justify-center gap-2">
                            <x-material-icon size="lg" class="cu-icon-search-off text-cu-soft" />
                            <h3 class="text-sm font-medium text-cu-ink">Tidak Ada Produk</h3>
                            <p class="text-xs text-cu-muted max-w-sm">Kategori ini belum memiliki produk, atau tidak ada produk yang cocok dengan pencarian Anda.</p>
                        </div>
                    </x-app-panel>
                </div>
            @endforelse
        </div>

        <!-- Pagination Products -->
        @if ($products && $products->hasPages())
            <div class="mt-6">
                {{ $products->links() }}
            </div>
        @endif
    @endif
</div>


