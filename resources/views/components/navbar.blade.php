@props(['variant' => 'solid'])

@php
    $navClass = match ($variant) {
        'glass' => 'border-b border-cu-line/70 bg-cu-surface/80 backdrop-blur-md text-cu-ink',
        'dark-glass' => 'border-b border-white/10 bg-black/20 backdrop-blur-md text-white',
        default => 'border-b border-cu-line bg-cu-surface/95 backdrop-blur-md text-cu-ink',
    };

    $menuLinkClass = $variant === 'dark-glass'
        ? 'flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white'
        : 'flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-cu-ink transition-colors hover:bg-cu-panel-soft';

    $iconButtonClass = $variant === 'dark-glass'
        ? 'inline-flex size-10 items-center justify-center rounded-full border border-transparent text-white/90 transition-colors hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/30'
        : 'inline-flex size-10 items-center justify-center rounded-full border border-transparent text-cu-ink transition-colors hover:border-cu-border hover:bg-cu-panel-soft focus:outline-none focus:ring-1 focus:ring-cu-border-hover';

    $dropdownPanelClass = $variant === 'dark-glass'
        ? 'absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d]/90 backdrop-blur-md shadow-2xl text-white'
        : 'absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-cu-line bg-cu-panel shadow-lg text-cu-ink';

    $dropdownHeaderClass = $variant === 'dark-glass'
        ? 'border-b border-white/10 px-4 py-3'
        : 'border-b border-cu-line px-4 py-3';

    $dropdownTitleClass = $variant === 'dark-glass'
        ? 'block text-xs font-semibold uppercase tracking-wider text-white/50'
        : 'block text-xs font-semibold uppercase tracking-wider text-cu-muted';

    $dropdownUserEmailClass = $variant === 'dark-glass'
        ? 'block truncate text-xs text-white/50'
        : 'block truncate text-xs text-cu-muted';

    $dropdownUserTitleClass = $variant === 'dark-glass'
        ? 'block truncate text-sm font-semibold text-white'
        : 'block truncate text-sm font-semibold text-cu-ink';

    $logoutButtonClass = $variant === 'dark-glass'
        ? 'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-cu-danger transition-colors hover:bg-red-500/10'
        : 'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-cu-danger transition-colors hover:bg-cu-danger-soft';
@endphp

<nav class="sticky top-0 z-50 {{ $navClass }}">
    <div class="flex w-full items-center justify-between px-4 py-2 sm:px-6 lg:px-32">
        <x-navbar.brand :href="route('home')" />

        <div class="flex items-center gap-2">
            @guest
                <x-navbar.action-button :href="route('login')">
                    <x-material-icon class="cu-icon-login" />
                    Masuk
                </x-navbar.action-button>
            @endguest

            @auth
                <livewire:core.notification-bell :variant="$variant === 'dark-glass' ? 'dark' : 'light'" />

                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open" type="button" class="{{ $iconButtonClass }}">
                        <span class="sr-only">Buka menu aplikasi</span>
                        <x-material-icon class="cu-icon-apps" size="md" />
                    </button>

                    <div x-show="open" x-cloak @click.outside="open = false"
                        x-transition:enter="transition ease-out duration-150"
                        x-transition:enter-start="opacity-0 scale-95"
                        x-transition:enter-end="opacity-100 scale-100"
                        x-transition:leave="transition ease-in duration-100"
                        x-transition:leave-start="opacity-100 scale-100"
                        x-transition:leave-end="opacity-0 scale-95"
                        class="{{ $dropdownPanelClass }}">
                        <div class="{{ $dropdownHeaderClass }}">
                            <span class="{{ $dropdownTitleClass }}">Menu</span>
                        </div>

                        <ul class="py-1">
                            <li>
                                <a href="{{ route('dashboard') }}" wire:navigate @click="open = false"
                                    class="{{ $menuLinkClass }}">
                                    <x-material-icon class="cu-icon-dashboard" size="sm" />
                                    Dashboard
                                </a>
                            </li>
                            @can('access-pricetag')
                                <li>
                                    <a href="{{ route('pricetag.search') }}" wire:navigate @click="open = false"
                                        class="{{ $menuLinkClass }}">
                                        <x-material-icon class="cu-icon-label" size="sm" />
                                        Pricetag Studio
                                    </a>
                                </li>
                            @endcan
                            @can('manage-users')
                                <li>
                                    <a href="{{ route('core.users.index') }}" wire:navigate @click="open = false"
                                        class="{{ $menuLinkClass }}">
                                        <x-material-icon class="cu-icon-group" size="sm" />
                                        Kelola User
                                    </a>
                                </li>
                            @endcan
                            @can('manage-roles')
                                <li>
                                    <a href="{{ route('core.roles.index') }}" wire:navigate @click="open = false"
                                        class="{{ $menuLinkClass }}">
                                        <x-material-icon class="cu-icon-admin-panel-settings" size="sm" />
                                        Kelola Role
                                    </a>
                                </li>
                            @endcan
                            @can('approve-users')
                                <li>
                                    <a href="{{ route('core.users.pending') }}" wire:navigate @click="open = false"
                                        class="{{ $menuLinkClass }}">
                                        <x-material-icon class="cu-icon-pending-actions" size="sm" />
                                        Akun Pending
                                    </a>
                                </li>
                            @endcan
                        </ul>
                    </div>
                </div>

                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open" type="button" class="focus:outline-none">
                        @php
                            $user = auth()->user();
                            $initials = collect(explode(' ', $user->name))->map(fn($n) => mb_substr($n, 0, 1))->take(2)->join('');
                            $avatarUrl = $user->avatar_path ? asset('storage/' . $user->avatar_path) : null;
                        @endphp
                        <x-navbar.avatar
                            :initials="$initials"
                            :imageUrl="$avatarUrl" />
                    </button>

                    <div x-show="open" x-cloak @click.outside="open = false"
                        x-transition:enter="transition ease-out duration-150"
                        x-transition:enter-start="opacity-0 scale-95"
                        x-transition:enter-end="opacity-100 scale-100"
                        x-transition:leave="transition ease-in duration-100"
                        x-transition:leave-start="opacity-100 scale-100"
                        x-transition:leave-end="opacity-0 scale-95"
                        class="{{ $dropdownPanelClass }}">
                        <div class="{{ $dropdownHeaderClass }}">
                            <span class="{{ $dropdownUserTitleClass }}">
                                {{ auth()->user()->name }}
                            </span>
                            <span class="{{ $dropdownUserEmailClass }}">
                                {{ auth()->user()->email }}
                            </span>
                        </div>

                        <ul class="py-1">
                            <li>
                                <a href="{{ route('dashboard') }}" wire:navigate @click="open = false"
                                    class="{{ $menuLinkClass }}">
                                    <x-material-icon class="cu-icon-dashboard" size="sm" />
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="{{ route('profile.edit') }}" wire:navigate @click="open = false"
                                    class="{{ $menuLinkClass }}">
                                    <x-material-icon class="cu-icon-person" size="sm" />
                                    Profil Saya
                                </a>
                            </li>
                            <li>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit"
                                        class="{{ $logoutButtonClass }}">
                                        <x-material-icon class="cu-icon-logout" size="sm" />
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
