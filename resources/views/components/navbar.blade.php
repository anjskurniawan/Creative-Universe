@props(['variant' => 'solid'])

@php
    $navClass = match($variant) {
        'glass' => 'bg-gray-500/30 backdrop-blur-md border-gray-500/30',
        default => 'bg-gray-900 border-gray-700/50',
    };
@endphp

<nav class="sticky top-0 z-50 px-4 py-2 border-b shadow-sm {{ $navClass }}">
    <div class="flex flex-wrap justify-between items-center mx-auto w-full">
        
        <a href="{{ route('home') }}" wire:navigate class="flex items-center space-x-2 outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
            <img src="{{ asset('images/icon-app/Logo_White.png') }}" alt="logo" class="h-8">
        </a>

        <div class="flex items-center space-x-3 md:space-x-4">
            
            @guest
                <a href="{{ route('login') }}" wire:navigate class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none transition-colors duration-200">
                    Masuk
                </a>
            @endguest

            @auth
                {{-- Notification Bell (Livewire component) --}}
                <livewire:core.notification-bell />

                {{-- App Menu (Pure Alpine.js) --}}
                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open" type="button"
                        class="p-1.5 text-gray-300 hover:text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-colors">
                        <span class="sr-only">Buka menu aplikasi</span>
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"></path>
                        </svg>
                    </button>

                    <div x-show="open" x-cloak @click.outside="open = false"
                         x-transition:enter="transition ease-out duration-150"
                         x-transition:enter-start="opacity-0 scale-95"
                         x-transition:enter-end="opacity-100 scale-100"
                         x-transition:leave="transition ease-in duration-100"
                         x-transition:leave-start="opacity-100 scale-100"
                         x-transition:leave-end="opacity-0 scale-95"
                         class="absolute right-0 mt-2 text-base list-none bg-white rounded-lg shadow-lg w-52 overflow-hidden z-50">
                        <div class="px-4 py-3 border-b border-gray-100">
                            <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</span>
                        </div>
                        <ul class="py-1">
                            <li>
                                <a href="{{ route('dashboard') }}" wire:navigate @click="open = false"
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    Dashboard
                                </a>
                            </li>
                            @can('manage-users')
                            <li>
                                <a href="{{ route('core.users.index') }}" wire:navigate @click="open = false"
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    Kelola User
                                </a>
                            </li>
                            @endcan
                            @can('manage-roles')
                            <li>
                                <a href="{{ route('core.roles.index') }}" wire:navigate @click="open = false"
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    Kelola Role
                                </a>
                            </li>
                            @endcan
                            @can('approve-users')
                            <li>
                                <a href="{{ route('core.users.pending') }}" wire:navigate @click="open = false"
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    Akun Pending
                                </a>
                            </li>
                            @endcan
                        </ul>
                    </div>
                </div>

                {{-- User Profile Menu (Pure Alpine.js) --}}
                <div class="relative ml-1" x-data="{ open: false }">
                    <button @click="open = !open" type="button"
                        class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600 focus:outline-none">
                        <span class="sr-only">Buka menu profil</span>
                        <img class="w-8 h-8 rounded-full object-cover" 
                             src="{{ auth()->user()->avatar_path ? asset('storage/' . auth()->user()->avatar_path) : 'https://ui-avatars.com/api/?name=' . urlencode(auth()->user()->name) . '&background=0D8ABC&color=fff' }}" 
                             alt="Foto Profil">
                    </button>
                    
                    <div x-show="open" x-cloak @click.outside="open = false"
                         x-transition:enter="transition ease-out duration-150"
                         x-transition:enter-start="opacity-0 scale-95"
                         x-transition:enter-end="opacity-100 scale-100"
                         x-transition:leave="transition ease-in duration-100"
                         x-transition:leave-start="opacity-100 scale-100"
                         x-transition:leave-end="opacity-0 scale-95"
                         class="absolute right-0 mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-48 overflow-hidden z-50">
                        <div class="px-4 py-3">
                            <span class="block text-sm font-semibold text-gray-900 truncate">
                                {{ auth()->user()->name }}
                            </span>
                            <span class="block text-xs text-gray-500 truncate">
                                {{ auth()->user()->email }}
                            </span>
                        </div>
                        <ul class="py-1">
                            <li>
                                <a href="{{ route('dashboard') }}" wire:navigate @click="open = false"
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="{{ route('profile.edit') }}" wire:navigate @click="open = false"
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    Profil Saya
                                </a>
                            </li>
                            <li>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors">
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
