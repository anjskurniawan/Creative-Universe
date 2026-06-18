<div class="space-y-6">
    <!-- Header Page -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-cu-ink md:text-3xl">Panel Maintenance</h1>
            <p class="mt-1 text-sm text-cu-muted">Pusat kendali dan utilitas administrasi aplikasi Creative Universe.</p>
        </div>
        
        <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-cu-danger/10 px-2.5 py-0.5 text-xs font-semibold text-cu-danger border border-cu-danger/20">
                <span class="size-1.5 rounded-full bg-cu-danger animate-pulse"></span>
                Mode Produksi Terbatas
            </span>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Command Panel (Left Column) -->
        <div class="space-y-6 lg:col-span-7">
            <!-- Command Cards Group -->
            <div class="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm">
                <h2 class="text-lg font-semibold text-cu-ink mb-4 flex items-center gap-2">
                    <x-material-icon class="cu-icon-settings" size="sm" />
                    Shortcut Web Artisan
                </h2>
                
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <!-- Migrate Card -->
                    <div class="group relative rounded-xl border border-cu-line bg-cu-panel-soft p-4 transition duration-200 hover:border-cu-border-hover hover:shadow-md">
                        <div class="flex items-start justify-between">
                            <div class="space-y-1">
                                <h3 class="font-semibold text-sm text-cu-ink">Migrasi Database</h3>
                                <p class="text-xs text-cu-muted">Jalankan query migrasi baru ke tabel database.</p>
                            </div>
                        </div>
                        <button wire:click="runCommand('migrate')" wire:loading.attr="disabled"
                            class="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-cu-ink px-3 py-2 text-xs font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none">
                            <span wire:loading.remove wire:target="runCommand('migrate')">Run Migrate</span>
                            <span wire:loading wire:target="runCommand('migrate')" class="inline-flex items-center gap-1">
                                <svg class="animate-spin h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Running...
                            </span>
                        </button>
                    </div>

                    <!-- Optimize Clear Card -->
                    <div class="group relative rounded-xl border border-cu-line bg-cu-panel-soft p-4 transition duration-200 hover:border-cu-border-hover hover:shadow-md">
                        <div class="flex items-start justify-between">
                            <div class="space-y-1">
                                <h3 class="font-semibold text-sm text-cu-ink">Clear Cache</h3>
                                <p class="text-xs text-cu-muted">Bersihkan seluruh cache aplikasi, rute, config, dan view.</p>
                            </div>
                        </div>
                        <button wire:click="runCommand('optimize:clear')" wire:loading.attr="disabled"
                            class="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-cu-ink px-3 py-2 text-xs font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none">
                            <span wire:loading.remove wire:target="runCommand('optimize:clear')">Clear Cache</span>
                            <span wire:loading wire:target="runCommand('optimize:clear')" class="inline-flex items-center gap-1">
                                <svg class="animate-spin h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Running...
                            </span>
                        </button>
                    </div>

                    <!-- Storage Link Card -->
                    <div class="group relative rounded-xl border border-cu-line bg-cu-panel-soft p-4 transition duration-200 hover:border-cu-border-hover hover:shadow-md">
                        <div class="flex items-start justify-between">
                            <div class="space-y-1">
                                <h3 class="font-semibold text-sm text-cu-ink">Storage Symlink</h3>
                                <p class="text-xs text-cu-muted">Hubungkan folder storage ke folder public asset.</p>
                            </div>
                        </div>
                        <button wire:click="runCommand('storage:link')" wire:loading.attr="disabled"
                            class="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-cu-ink px-3 py-2 text-xs font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none">
                            <span wire:loading.remove wire:target="runCommand('storage:link')">Link Storage</span>
                            <span wire:loading wire:target="runCommand('storage:link')" class="inline-flex items-center gap-1">
                                <svg class="animate-spin h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Running...
                            </span>
                        </button>
                    </div>

                    <!-- Queue Restart Card -->
                    <div class="group relative rounded-xl border border-cu-line bg-cu-panel-soft p-4 transition duration-200 hover:border-cu-border-hover hover:shadow-md">
                        <div class="flex items-start justify-between">
                            <div class="space-y-1">
                                <h3 class="font-semibold text-sm text-cu-ink">Restart Queue</h3>
                                <p class="text-xs text-cu-muted">Restart daemon queue worker untuk memperbarui kode baru.</p>
                            </div>
                        </div>
                        <button wire:click="runCommand('queue:restart')" wire:loading.attr="disabled"
                            class="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-cu-ink px-3 py-2 text-xs font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none">
                            <span wire:loading.remove wire:target="runCommand('queue:restart')">Restart Queue</span>
                            <span wire:loading wire:target="runCommand('queue:restart')" class="inline-flex items-center gap-1">
                                <svg class="animate-spin h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Running...
                            </span>
                        </button>
                    </div>

                    <!-- Seed Permissions Card -->
                    <div class="group relative rounded-xl border border-cu-line bg-cu-panel-soft p-4 transition duration-200 hover:border-cu-border-hover hover:shadow-md">
                        <div class="flex items-start justify-between">
                            <div class="space-y-1">
                                <h3 class="font-semibold text-sm text-cu-ink">Seed Permissions</h3>
                                <p class="text-xs text-cu-muted">Inisialisasi ulang daftar Role dan Permission inti.</p>
                            </div>
                        </div>
                        <button wire:click="runCommand('db:seed-permissions')" wire:loading.attr="disabled"
                            class="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-cu-ink px-3 py-2 text-xs font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none">
                            <span wire:loading.remove wire:target="runCommand('db:seed-permissions')">Seed Permissions</span>
                            <span wire:loading wire:target="runCommand('db:seed-permissions')" class="inline-flex items-center gap-1">
                                <svg class="animate-spin h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Running...
                            </span>
                        </button>
                    </div>

                    <!-- Migrate Fresh Card (Danger Zone) -->
                    <div class="group relative rounded-xl border border-cu-danger/30 bg-cu-danger-soft/10 p-4 transition duration-200 hover:border-cu-danger hover:shadow-md">
                        <div class="flex items-start justify-between">
                            <div class="space-y-1">
                                <h3 class="font-semibold text-sm text-cu-danger">Reset Database (Fresh)</h3>
                                <p class="text-xs text-cu-muted">Drop seluruh tabel database dan jalankan migrasi baru.</p>
                            </div>
                        </div>
                        <button wire:confirm="PERINGATAN: Tindakan ini akan menghapus SELURUH data tabel Anda! Apakah Anda yakin?"
                            wire:click="runCommand('migrate:fresh')" wire:loading.attr="disabled"
                            class="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-cu-danger px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 focus:outline-none">
                            <span wire:loading.remove wire:target="runCommand('migrate:fresh')">Reset DB & Migrasi</span>
                            <span wire:loading wire:target="runCommand('migrate:fresh')" class="inline-flex items-center gap-1">
                                <svg class="animate-spin h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Reseting...
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Testing Notification Card -->
            <div class="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm">
                <h2 class="text-lg font-semibold text-cu-ink mb-2 flex items-center gap-2">
                    <x-material-icon class="cu-icon-notifications-active" size="sm" />
                    Pengetesan Notifikasi
                </h2>
                <p class="text-xs text-cu-muted mb-4">Uji pengiriman notifikasi ke masing-masing channel secara terpisah di akun Anda.</p>
                
                <div class="space-y-4">
                    <div>
                        <label for="test-msg" class="block text-xs font-semibold uppercase tracking-wider text-cu-muted mb-1.5">Isi Pesan Uji Coba</label>
                        <input id="test-msg" type="text" wire:model="testMessage"
                            class="block w-full rounded-lg border-cu-line bg-cu-surface-soft px-3 py-2.5 text-sm text-cu-ink shadow-sm focus:border-cu-border-hover focus:ring-1 focus:ring-cu-border-hover placeholder:text-cu-muted">
                        @error('testMessage') <span class="text-xs text-cu-danger">{{ $message }}</span> @enderror
                    </div>
                    
                    <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <!-- Database Test Button -->
                        <button wire:click="sendTestNotification('database')" wire:loading.attr="disabled"
                            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cu-ink px-3 py-2.5 text-xs font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none">
                            <span wire:loading.remove wire:target="sendTestNotification('database')" class="inline-flex items-center gap-1.5">
                                <x-material-icon class="cu-icon-storage" size="xs" />
                                Test Database
                            </span>
                            <span wire:loading wire:target="sendTestNotification('database')" class="inline-flex items-center gap-1">
                                <svg class="animate-spin h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Sending...
                            </span>
                        </button>
                        
                        <!-- Broadcast Test Button -->
                        <button wire:click="sendTestNotification('broadcast')" wire:loading.attr="disabled"
                            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cu-ink px-3 py-2.5 text-xs font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none">
                            <span wire:loading.remove wire:target="sendTestNotification('broadcast')" class="inline-flex items-center gap-1.5">
                                <x-material-icon class="cu-icon-sensors" size="xs" />
                                Test Broadcast
                            </span>
                            <span wire:loading wire:target="sendTestNotification('broadcast')" class="inline-flex items-center gap-1">
                                <svg class="animate-spin h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Sending...
                            </span>
                        </button>
                        
                        <!-- WhatsApp Test Button -->
                        <button wire:click="sendTestNotification('whatsapp')" wire:loading.attr="disabled"
                            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cu-ink px-3 py-2.5 text-xs font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none">
                            <span wire:loading.remove wire:target="sendTestNotification('whatsapp')" class="inline-flex items-center gap-1.5">
                                <x-material-icon class="cu-icon-chat" size="xs" />
                                Test WhatsApp
                            </span>
                            <span wire:loading wire:target="sendTestNotification('whatsapp')" class="inline-flex items-center gap-1">
                                <svg class="animate-spin h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Sending...
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Output Terminal (Right Column) -->
        <div class="lg:col-span-5 flex flex-col h-full min-h-[30rem] lg:min-h-0">
            <div class="flex-1 rounded-xl border border-white/10 bg-[#0c0c0d] text-gray-200 shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
                <!-- Terminal Header -->
                <div class="flex items-center justify-between border-b border-white/5 bg-[#141416] px-4 py-2.5">
                    <div class="flex items-center gap-2">
                        <div class="flex gap-1.5">
                            <span class="size-3 rounded-full bg-red-500/80"></span>
                            <span class="size-3 rounded-full bg-yellow-500/80"></span>
                            <span class="size-3 rounded-full bg-green-500/80"></span>
                        </div>
                        <span class="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-2">Console Output</span>
                    </div>
                    
                    <button @click="document.getElementById('console-box').textContent = ''; $wire.set('consoleOutput', '')"
                        class="text-[10px] text-gray-500 hover:text-gray-300 font-semibold uppercase tracking-wider transition">
                        Clear
                    </button>
                </div>
                
                <!-- Terminal Box -->
                <div id="console-box" class="flex-1 p-4 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text min-h-[25rem] lg:min-h-0 text-[#a6accd]">
                    @if(empty($consoleOutput))
<span class="text-gray-600">// Menunggu instruksi... Klik tombol disamping untuk menjalankan command.</span>
                    @else
{{ $consoleOutput }}
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
