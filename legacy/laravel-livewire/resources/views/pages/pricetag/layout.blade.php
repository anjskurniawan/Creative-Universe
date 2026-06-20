@component('layouts.pricetag')
    <div class="w-full max-w-6xl mx-auto flex flex-col items-center gap-8 py-4">
        <!-- Centered Header Title -->
        <div class="text-center">
            <h1 id="pricetag-title" aria-label="Pricetag Generator" data-typewriter="Pricetag Generator"
                class="text-center text-4xl md:text-5xl lg:text-8xl font-medium text-white tracking-normal leading-none">
                <span data-typewriter-text>Pricetag Generator</span><span aria-hidden="true"
                    data-typewriter-cursor
                    class="ml-2 inline-block h-8 w-1 bg-gradient-to-b from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end align-middle opacity-0 md:h-12 lg:h-20"></span>
                <noscript>Pricetag Generator</noscript>
            </h1>
        </div>

        <!-- Pill Navigation Switcher -->
        <nav
            class="flex items-center p-1 rounded-full border border-white/10 bg-[#0d0d0d]/60 backdrop-blur-md relative z-10 gap-1 md:gap-1.5 shadow-xl transition-all duration-300 max-w-full overflow-x-auto scrollbar-none flex-nowrap mx-4 sm:mx-0">
            <a href="{{ route('pricetag.search') }}" wire:navigate
                class="flex items-center justify-center px-3 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap {{ request()->routeIs('pricetag.search') ? 'bg-white text-cu-ink shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-white/5' }}">
                Cari Pricetag
            </a>

            <a href="{{ route('pricetag.generator') }}" wire:navigate
                class="flex items-center justify-center px-3 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap {{ request()->routeIs('pricetag.generator') ? 'bg-white text-cu-ink shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-white/5' }}">
                Generator
            </a>

            <a href="{{ route('pricetag.history') }}" wire:navigate
                class="flex items-center justify-center px-3 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap {{ request()->routeIs('pricetag.history') ? 'bg-white text-cu-ink shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-white/5' }}">
                Riwayat
            </a>

            @can('pricetag.manage')
                <a href="{{ route('pricetag.database') }}" wire:navigate
                    class="flex items-center justify-center px-3 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap {{ request()->routeIs('pricetag.database') ? 'bg-white text-cu-ink shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-white/5' }}">
                    Database
                </a>
            @endcan
        </nav>

        <!-- Main Content Card Panel -->
        <main
            class="w-full bg-white text-cu-ink rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/5 min-h-[450px]">
            {{ $slot }}
        </main>
    </div>
@endcomponent
