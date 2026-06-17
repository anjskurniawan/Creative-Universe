<x-app-layout>
    <!-- Modern Hero Header Banner -->
    <div class="mb-8 rounded-2xl bg-gradient-to-r from-cu-ink to-cu-ink-hover p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-white/10">
        <!-- Decorative subtle background shapes / glow -->
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-cu-info opacity-30 rounded-full blur-3xl"></div>
        <div class="absolute right-20 bottom-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>

        <div class="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
                <div class="flex items-center gap-2 mb-1.5">
                    <span class="px-2.5 py-0.5 rounded-full bg-cu-info-soft/20 text-cu-info text-[10px] font-semibold tracking-wider uppercase border border-cu-info/20">Sub-App Creative</span>
                </div>
                <h1 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">Pricetag Studio</h1>
                <p class="mt-1 text-sm text-slate-300 max-w-xl">Pembuatan label harga promo PT. Doran Sukses Indonesia secara otomatis melalui sistem internal Creative Universe.</p>
            </div>
            
            <!-- Horizontal Pill Menu -->
            <nav class="flex flex-wrap gap-1.5 p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 self-start md:self-center">
                <a href="{{ route('pricetag.search') }}" wire:navigate
                    class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 {{ request()->routeIs('pricetag.search') ? 'bg-white text-cu-ink shadow-md font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5' }}">
                    <x-material-icon name="search" size="sm" />
                    Cari Pricetag
                </a>

                <a href="{{ route('pricetag.generator') }}" wire:navigate
                    class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 {{ request()->routeIs('pricetag.generator') ? 'bg-white text-cu-ink shadow-md font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5' }}">
                    <x-material-icon name="auto_awesome" size="sm" />
                    Generator
                </a>

                <a href="{{ route('pricetag.history') }}" wire:navigate
                    class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 {{ request()->routeIs('pricetag.history') ? 'bg-white text-cu-ink shadow-md font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5' }}">
                    <x-material-icon name="history" size="sm" />
                    Riwayat
                </a>

                @can('pricetag.manage')
                    <a href="{{ route('pricetag.database') }}" wire:navigate
                        class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 {{ request()->routeIs('pricetag.database') ? 'bg-white text-cu-ink shadow-md font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5' }}">
                        <x-material-icon name="database" size="sm" />
                        Database
                    </a>
                @endcan
            </nav>
        </div>
    </div>

    <!-- Main Content Panel with Glassmorphism Card -->
    <main class="w-full transition-all duration-300">
        {{ $slot }}
    </main>
</x-app-layout>
