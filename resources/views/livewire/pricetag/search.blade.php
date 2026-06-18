<div x-data="{ viewType: 'grid' }">

    <!-- Search & Control Header -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cu-muted">
                <x-material-icon class="cu-icon-search" size="sm" />
            </div>
            <input type="search" wire:model.live.debounce.300ms="search"
                class="block w-full rounded-lg border border-cu-line bg-cu-surface py-2 pl-10 pr-4 text-sm text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-focus focus:outline-none focus:ring-1 focus:ring-cu-focus"
                placeholder="Cari nama produk, kategori...">
        </div>

        <!-- Interactive Controls (View Switcher) -->
        <div class="flex items-center justify-between gap-4">
            <div wire:loading class="text-xs text-cu-muted animate-pulse flex items-center gap-1.5">
                <svg class="animate-spin h-3.5 w-3.5 text-cu-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memfilter...
            </div>
            
            <div class="inline-flex rounded-lg border border-cu-line bg-cu-surface p-1 shadow-sm">
                <!-- Grid Button -->
                <button type="button" @click="viewType = 'grid'"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                    :class="viewType === 'grid' ? 'bg-cu-ink text-cu-surface shadow-sm' : 'text-cu-muted hover:text-cu-ink'">
                    <x-material-icon class="cu-icon-grid-view" size="xs" />
                    Grid
                </button>
                <!-- List Button -->
                <button type="button" @click="viewType = 'list'"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                    :class="viewType === 'list' ? 'bg-cu-ink text-cu-surface shadow-sm' : 'text-cu-muted hover:text-cu-ink'">
                    <x-material-icon class="cu-icon-view-list" size="xs" />
                    Tabel
                </button>
            </div>
        </div>
    </div>

    <!-- Grid Layout View -->
    <div x-show="viewType === 'grid'" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 scale-95" x-transition:enter-end="opacity-100 scale-100" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        @forelse ($products as $product)
            @php
                $viewLink = $product->assetLinks->firstWhere('label', 'Google Drive View Link');
                $downloadLink = $product->assetLinks->firstWhere('label', 'Google Drive Download Link') ?? $viewLink;
            @endphp
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-cu-line bg-cu-surface p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <!-- Background decoration overlay -->
                <div class="absolute -right-16 -bottom-16 w-32 h-32 bg-cu-info/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

                <div>
                    <!-- Category Badge -->
                    <div class="flex items-center justify-between mb-3.5">
                        <span class="inline-flex items-center rounded-full bg-cu-panel-soft px-2.5 py-0.5 text-[10px] font-semibold text-cu-muted tracking-wide uppercase border border-cu-line/30">
                            {{ $product->category->name ?? 'General' }}
                        </span>
                        
                        <span class="flex items-center gap-1 text-[10px] text-cu-success font-medium">
                            <x-material-icon size="xs" class="cu-icon-check-circle text-cu-success" />
                            Ready
                        </span>
                    </div>

                    <!-- Product & Varian Details -->
                    <h3 class="text-sm font-bold text-cu-ink group-hover:text-cu-info transition-colors line-clamp-2 min-h-[40px]">
                        {{ $product->name ?? '-' }} @if($product->variant_name && $product->variant_name !== 'Default') ({{ $product->variant_name }}) @endif
                    </h3>
                    
                    <!-- Modern Price Sticker -->
                    <div class="mt-4 flex items-baseline gap-2 p-2.5 rounded-lg bg-cu-surface-soft border border-cu-line/40">
                        <div class="flex flex-col">
                            <span class="text-[9px] uppercase tracking-wider text-cu-muted line-through">
                                Rp{{ number_format($product->normal_price, 0, ',', '.') }}
                            </span>
                            <span class="text-sm font-extrabold text-cu-success">
                                Rp{{ number_format($product->discount_price, 0, ',', '.') }}
                            </span>
                        </div>
                        <span class="ml-auto text-[9px] uppercase tracking-wider font-bold text-cu-success-hover bg-cu-success-soft px-1.5 py-0.5 rounded">
                            Promo
                        </span>
                    </div>
                </div>

                <!-- Last generated time -->
                <div class="mt-4 border-t border-cu-line/40 pt-3 flex items-center justify-between text-[10px] text-cu-muted">
                    <span class="flex items-center gap-1">
                        <x-material-icon class="cu-icon-schedule" size="xs" />
                        @if($viewLink && $viewLink->updated_at)
                            {{ $viewLink->updated_at->setTimezone('Asia/Jakarta')->format('d M, H:i') }}
                        @else
                            -
                        @endif
                    </span>

                    <!-- Action Links inside Grid Card -->
                    <div class="flex items-center gap-1.5">
                        @if ($viewLink)
                            <a href="{{ $viewLink->url }}" target="_blank" rel="noopener noreferrer"
                                class="inline-flex size-7 items-center justify-center rounded-md border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft transition shadow-sm"
                                title="Buka Drive">
                                <x-material-icon class="cu-icon-visibility" size="xs" />
                            </a>
                        @endif

                        @if ($downloadLink)
                            <a href="{{ $downloadLink->url }}" target="_blank" rel="noopener noreferrer"
                                class="inline-flex size-7 items-center justify-center rounded-md bg-cu-ink text-cu-surface hover:bg-cu-ink-hover transition shadow-sm"
                                title="Unduh">
                                <x-material-icon class="cu-icon-download" size="xs" />
                            </a>
                        @endif
                    </div>
                </div>
            </div>
        @empty
            <div class="col-span-full">
                <x-app-panel padding="lg" class="text-center text-cu-muted border-dashed py-12">
                    <div class="flex flex-col items-center justify-center gap-2">
                        <x-material-icon size="lg" class="cu-icon-search-off text-cu-soft" />
                        <h3 class="text-sm font-medium text-cu-ink">Belum Ada Pricetag</h3>
                        <p class="text-xs text-cu-muted max-w-sm">Gunakan menu Generator untuk membuat pricetag baru terlebih dahulu.</p>
                    </div>
                </x-app-panel>
            </div>
        @endforelse
    </div>

    <!-- Table List Layout View -->
    <div x-show="viewType === 'list'" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 scale-95" x-transition:enter-end="opacity-100 scale-100">
        <x-app-panel padding="none" class="overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="border-b border-cu-line bg-cu-panel-soft text-xs font-semibold uppercase tracking-wider text-cu-muted">
                            <th class="px-6 py-4">Varian</th>
                            <th class="px-6 py-4">Produk</th>
                            <th class="px-6 py-4">Kategori</th>
                            <th class="px-6 py-4 text-right">Harga Normal</th>
                            <th class="px-6 py-4 text-right text-cu-success">Harga Diskon</th>
                            <th class="px-6 py-4">Terakhir Generate</th>
                            <th class="px-6 py-4 text-center">Aksi Link</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-cu-line bg-cu-surface">
                        @forelse ($products as $product)
                            <tr class="hover:bg-cu-panel-soft/30 transition-colors">
                                <td class="px-6 py-4 font-medium text-cu-ink">
                                    {{ $product->variant_name }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="font-semibold text-cu-ink">{{ $product->name ?? '-' }}</div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center rounded bg-cu-panel-soft px-2.5 py-0.5 text-xs font-semibold text-cu-muted border border-cu-line/30">
                                        {{ $product->category->name ?? '-' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right font-medium text-cu-ink line-through">
                                    Rp{{ number_format($product->normal_price, 0, ',', '.') }}
                                </td>
                                <td class="px-6 py-4 text-right font-bold text-cu-success">
                                    Rp{{ number_format($product->discount_price, 0, ',', '.') }}
                                </td>
                                @php
                                    $viewLink = $product->assetLinks->firstWhere('label', 'Google Drive View Link');
                                    $downloadLink = $product->assetLinks->firstWhere('label', 'Google Drive Download Link') ?? $viewLink;
                                    $hasViewLink = !empty($viewLink);
                                @endphp
                                <td class="px-6 py-4 text-cu-muted text-xs whitespace-nowrap">
                                    @if($hasViewLink && $viewLink->updated_at)
                                        {{ $viewLink->updated_at->setTimezone('Asia/Jakarta')->format('d M Y, H:i') }}
                                    @else
                                        -
                                    @endif
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center justify-center gap-2">
                                        @if ($viewLink)
                                            <a href="{{ $viewLink->url }}" target="_blank" rel="noopener noreferrer"
                                                class="inline-flex items-center gap-1 rounded-md border border-cu-line bg-cu-surface px-2.5 py-1.5 text-xs font-medium text-cu-ink transition hover:bg-cu-panel-soft"
                                                title="Buka Drive">
                                                <x-material-icon class="cu-icon-visibility" size="xs" />
                                                Lihat
                                            </a>
                                        @endif

                                        @if ($downloadLink)
                                            <a href="{{ $downloadLink->url }}" target="_blank" rel="noopener noreferrer"
                                                class="inline-flex items-center gap-1 rounded-md bg-cu-ink px-2.5 py-1.5 text-xs font-medium text-cu-surface transition hover:bg-cu-ink-hover shadow-sm"
                                                title="Unduh">
                                                <x-material-icon class="cu-icon-download" size="xs" />
                                                Unduh
                                            </a>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="px-6 py-10 text-center text-cu-muted">
                                    Tidak ada pricetag yang ditemukan.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </x-app-panel>
    </div>

    <!-- Shared Pagination -->
    @if ($products->hasPages())
        <div class="mt-6">
            {{ $products->links() }}
        </div>
    @endif
</div>
