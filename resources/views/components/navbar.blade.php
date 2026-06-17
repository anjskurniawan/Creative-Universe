@props(['variant' => 'solid'])

@php
    $navClass = match ($variant) {
        'glass' => 'border-cu-line/70 bg-cu-surface/80 backdrop-blur-md',
        default => 'border-cu-line bg-cu-surface/95 backdrop-blur-md',
    };

    $menuLinkClass = 'flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-cu-ink transition-colors hover:bg-cu-panel-soft';
    $iconButtonClass = 'inline-flex size-10 items-center justify-center rounded-full border border-transparent text-cu-ink transition-colors hover:border-cu-border hover:bg-cu-panel-soft focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2';
@endphp

<nav class="sticky top-0 z-50 border-b shadow-sm {{ $navClass }}">
    <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="{{ route('home') }}" wire:navigate
            class="inline-flex items-center rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cu-ink">
            <img src="{{ asset('images/icon-app/Logo_White.png') }}" alt="Creative Universe" class="h-8 brightness-0">
        </a>

        <div class="flex items-center gap-2">
            @guest
                <a href="{{ route('login') }}" wire:navigate
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-4 text-sm font-medium text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2">
                    <x-material-icon name="login" />
                    Masuk
                </a>
            @endguest

            @auth
                <livewire:core.notification-bell />

                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open" type="button" class="{{ $iconButtonClass }}">
                        <span class="sr-only">Buka menu aplikasi</span>
                        <x-material-icon name="apps" size="md" />
                    </button>

                    <div x-show="open" x-cloak @click.outside="open = false"
                        x-transition:enter="transition ease-out duration-150"
                        x-transition:enter-start="opacity-0 scale-95"
                        x-transition:enter-end="opacity-100 scale-100"
                        x-transition:leave="transition ease-in duration-100"
                        x-transition:leave-start="opacity-100 scale-100"
                        x-transition:leave-end="opacity-0 scale-95"
                        class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-cu-line bg-cu-panel shadow-lg">
                        <div class="border-b border-cu-line px-4 py-3">
                            <span class="block text-xs font-semibold uppercase tracking-wider text-cu-muted">Menu</span>
                        </div>

                        <ul class="py-1">
                            <li>
                                <a href="{{ route('dashboard') }}" wire:navigate @click="open = false"
                                    class="{{ $menuLinkClass }}">
                                    <x-material-icon name="dashboard" size="sm" />
                                    Dashboard
                                </a>
                            </li>
                            @can('access-pricetag')
                                <li>
                                    <a href="{{ route('pricetag.search') }}" wire:navigate @click="open = false"
                                        class="{{ $menuLinkClass }}">
                                        <x-material-icon name="label" size="sm" />
                                        Pricetag Studio
                                    </a>
                                </li>
                            @endcan
                            @can('manage-users')
                                <li>
                                    <a href="{{ route('core.users.index') }}" wire:navigate @click="open = false"
                                        class="{{ $menuLinkClass }}">
                                        <x-material-icon name="group" size="sm" />
                                        Kelola User
                                    </a>
                                </li>
                            @endcan
                            @can('manage-roles')
                                <li>
                                    <a href="{{ route('core.roles.index') }}" wire:navigate @click="open = false"
                                        class="{{ $menuLinkClass }}">
                                        <x-material-icon name="admin_panel_settings" size="sm" />
                                        Kelola Role
                                    </a>
                                </li>
                            @endcan
                            @can('approve-users')
                                <li>
                                    <a href="{{ route('core.users.pending') }}" wire:navigate @click="open = false"
                                        class="{{ $menuLinkClass }}">
                                        <x-material-icon name="pending_actions" size="sm" />
                                        Akun Pending
                                    </a>
                                </li>
                            @endcan
                        </ul>
                    </div>
                </div>

                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open" type="button"
                        class="inline-flex size-10 items-center justify-center overflow-hidden rounded-full border border-cu-line bg-cu-panel focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2">
                        <span class="sr-only">Buka menu profil</span>
                        <img class="size-10 object-cover"
                            src="{{ auth()->user()->avatar_path ? asset('storage/' . auth()->user()->avatar_path) : 'https://ui-avatars.com/api/?name=' . urlencode(auth()->user()->name) . '&background=0A0A0A&color=fff' }}"
                            alt="Foto Profil">
                    </button>

                    <div x-show="open" x-cloak @click.outside="open = false"
                        x-transition:enter="transition ease-out duration-150"
                        x-transition:enter-start="opacity-0 scale-95"
                        x-transition:enter-end="opacity-100 scale-100"
                        x-transition:leave="transition ease-in duration-100"
                        x-transition:leave-start="opacity-100 scale-100"
                        x-transition:leave-end="opacity-0 scale-95"
                        class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-cu-line bg-cu-panel shadow-lg">
                        <div class="border-b border-cu-line px-4 py-3">
                            <span class="block truncate text-sm font-semibold text-cu-ink">
                                {{ auth()->user()->name }}
                            </span>
                            <span class="block truncate text-xs text-cu-muted">
                                {{ auth()->user()->email }}
                            </span>
                        </div>

                        <ul class="py-1">
                            <li>
                                <a href="{{ route('dashboard') }}" wire:navigate @click="open = false"
                                    class="{{ $menuLinkClass }}">
                                    <x-material-icon name="dashboard" size="sm" />
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="{{ route('profile.edit') }}" wire:navigate @click="open = false"
                                    class="{{ $menuLinkClass }}">
                                    <x-material-icon name="person" size="sm" />
                                    Profil Saya
                                </a>
                            </li>
                            <li>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit"
                                        class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-cu-danger transition-colors hover:bg-cu-danger-soft">
                                        <x-material-icon name="logout" size="sm" />
                                        Keluar
                                    </button>
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>
            @endauth
        </div>
    </div>
</nav>
