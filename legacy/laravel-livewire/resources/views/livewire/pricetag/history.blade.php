<div>
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
        <div>
            <h2 class="text-lg font-bold text-cu-ink">Riwayat Antrean</h2>
            <p class="text-xs text-cu-muted mt-0.5">Pantau status antrean dan proses pembuatan label harga.</p>
        </div>
        @if($hasActiveBatches)
            <div class="flex items-center gap-1.5 text-xs text-cu-info font-semibold animate-pulse">
                <span class="inline-block size-2 rounded-full bg-cu-info"></span>
                Memantau proses...
            </div>
        @endif
    </div>

    <!-- Alert notifications -->
    @if (session()->has('error'))
        <div class="mb-5">
            <x-app-alert type="danger">
                {{ session('error') }}
            </x-app-alert>
        </div>
    @endif

    <!-- Minimalist Cards List -->
    <div class="space-y-3">
        @forelse ($batches as $batch)
            @php
                $percentage = $batch->total_items > 0 ? round(($batch->processed_items / $batch->total_items) * 100) : 0;
            @endphp

            <x-app-panel padding="sm" class="shadow-sm hover:border-cu-border transition-all duration-200 cursor-pointer border border-cu-line/60 rounded-2xl bg-cu-surface" x-data="{ expanded: false }" @click="expanded = !expanded">
                <div class="flex items-center justify-between p-2 gap-4">
                    <!-- Left Section: Status Dot & Batch Info -->
                    <div class="flex items-center gap-3.5 min-w-0">
                        <!-- Status Indicator -->
                        <span class="relative flex h-2 w-2 shrink-0">
                            @if($batch->status === 'processing')
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cu-info opacity-75"></span>
                            @endif
                            <span class="relative inline-flex rounded-full h-2 w-2 {{ $batch->status === 'completed' ? 'bg-cu-success' : ($batch->status === 'failed' ? 'bg-cu-danger' : ($batch->status === 'processing' ? 'bg-cu-info' : 'bg-cu-warning')) }}"></span>
                        </span>

                        <div class="min-w-0">
                            <div class="flex items-center gap-2">
                                <h3 class="text-sm font-semibold text-cu-ink truncate" title="{{ $batch->batch_name }}">{{ $batch->batch_name }}</h3>
                            </div>
                            <div class="flex items-center gap-2 text-[10px] text-cu-muted mt-0.5 font-medium">
                                <span class="truncate">{{ $batch->creator->name ?? 'System' }}</span>
                                <span class="shrink-0">•</span>
                                <span class="shrink-0">{{ $batch->created_at->setTimezone('Asia/Jakarta')->format('d M, H:i') }} WIB</span>
                            </div>
                        </div>
                    </div>

                    <!-- Right Section: Progress Numbers & Expansion chevron -->
                    <div class="flex items-center gap-4 shrink-0">
                        <div class="text-right">
                            <span class="text-xs font-mono font-bold text-cu-ink block leading-none">{{ $batch->processed_items }}/{{ $batch->total_items }}</span>
                            <span class="text-[10px] text-cu-muted mt-0.5 block font-medium leading-none">{{ $percentage }}%</span>
                        </div>
                        <x-material-icon size="xs" class="cu-icon-expand-more text-cu-muted transition-transform duration-200 shrink-0" x-bind:class="expanded ? 'rotate-180' : ''" />
                    </div>
                </div>

                <!-- Sleek Minimalist Progress Bar at the Bottom Edge of Card -->
                <div class="h-0.5 w-full bg-cu-panel-soft rounded-full overflow-hidden mt-2">
                    <div class="h-full transition-all duration-500 ease-out {{ $batch->status === 'failed' ? 'bg-cu-danger' : ($batch->status === 'completed' ? 'bg-cu-success' : 'bg-cu-info') }}"
                        style="width: {{ $percentage }}%"></div>
                </div>

                <!-- Expanded Drawer Area -->
                <div x-show="expanded" x-collapse x-cloak class="border-t border-cu-line/40 mt-3 pt-3" @click.stop>
                    @if(!str_starts_with($batch->batch_name, 'Single:') && $batch->status === 'completed' && $batch->processed_items > 0)
                        <div class="mb-2.5 flex justify-end">
                            <button wire:click.stop="downloadZip({{ $batch->id }})" wire:loading.attr="disabled"
                                class="inline-flex items-center gap-1.5 rounded-full bg-cu-ink px-4 py-2 text-[11px] font-semibold text-cu-surface transition hover:bg-cu-ink-hover disabled:opacity-50 shadow-sm">
                                <span wire:loading.remove wire:target="downloadZip({{ $batch->id }})" class="flex items-center gap-1.5">
                                    <x-material-icon class="cu-icon-download-for-offline" size="xs" />
                                    Download ZIP
                                </span>
                                <span wire:loading wire:target="downloadZip({{ $batch->id }})" class="flex items-center gap-1.5">
                                    <svg class="animate-spin h-3.5 w-3.5 text-cu-surface" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Kompresi...
                                </span>
                            </button>
                        </div>
                    @endif

                    <div class="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                        @if($batch->items->count() > 0)
                            <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 py-1">
                                @foreach($batch->items as $item)
                                    @php
                                        $itemProduct = $item->product; 
                                        $viewUrl = $itemProduct ? $itemProduct->assetLinks->firstWhere('label', 'Google Drive View Link')?->url : null;
                                        $displayName = $itemProduct ? $itemProduct->name . ($itemProduct->variant_name !== 'Default' ? ' (' . $itemProduct->variant_name . ')' : '') : 'Produk';
                                    @endphp
                                    @if($item->status === 'success')
                                        <div class="flex items-center justify-between gap-1.5 rounded-xl px-3 py-1.5 bg-cu-panel-soft/60 border border-cu-line/40 text-xs font-medium text-cu-ink hover:bg-cu-panel-soft transition-colors duration-200">
                                            <div class="flex items-center gap-1.5 min-w-0">
                                                <span class="size-1.5 rounded-full bg-cu-success shrink-0"></span>
                                                <span class="truncate" title="{{ $displayName }}">{{ $displayName }}</span>
                                            </div>
                                            @if($viewUrl)
                                                <a href="{{ $viewUrl }}" target="_blank" class="text-cu-muted hover:text-cu-info shrink-0 ml-0.5" title="Buka Hasil Label" @click.stop>
                                                    <x-material-icon class="cu-icon-open-in-new" size="xs" />
                                                </a>
                                            @endif
                                        </div>
                                    @else
                                        <div class="flex items-center justify-between gap-1.5 rounded-xl px-3 py-1.5 bg-cu-danger-soft/10 border border-cu-danger/20 text-xs font-medium text-cu-danger hover:bg-cu-danger-soft/20 transition-colors duration-200" title="{{ $item->error_message ?? 'Proses gagal' }}">
                                            <div class="flex items-center gap-1.5 min-w-0">
                                                <span class="size-1.5 rounded-full bg-cu-danger shrink-0"></span>
                                                <span class="truncate" title="{{ $displayName }}">{{ $displayName }}</span>
                                            </div>
                                            <x-material-icon size="xs" class="cu-icon-info text-cu-danger hover:text-cu-danger shrink-0 cursor-help" />
                                        </div>
                                    @endif
                                @endforeach
                            </div>
                        @else
                            <p class="text-xs text-cu-muted text-center py-4">Belum ada item yang diproses.</p>
                        @endif
                    </div>
                </div>
            </x-app-panel>
        @empty
            <x-app-panel padding="lg" class="text-center text-cu-muted border-dashed py-12">
                <div class="flex flex-col items-center justify-center gap-2">
                    <x-material-icon size="lg" class="cu-icon-history-toggle-off text-cu-soft" />
                    <h3 class="text-sm font-semibold text-cu-ink">Belum Ada Riwayat</h3>
                    <p class="text-xs text-cu-muted max-w-sm">Daftar unggahan CSV dan generator antrean Anda akan tampil di sini.</p>
                </div>
            </x-app-panel>
        @endforelse

        @if ($batches->hasPages())
            <div class="pt-2">
                {{ $batches->links() }}
            </div>
        @endif
    </div>
</div>
