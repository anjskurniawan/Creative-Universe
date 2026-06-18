<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @auth
            <meta name="creative-universe-user-id" content="{{ auth()->id() }}">
        @endauth
        <meta name="description" content="Creative Universe — Hub aplikasi internal divisi Creative PT. Doran Sukses Indonesia">

        <title>{{ config('app.name', 'Creative Universe') }} — @yield('title', 'Dashboard')</title>

        <!-- Fonts: Google Sans Flex -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet">
        <!-- Scripts & Styles -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="min-h-screen bg-cu-surface-soft font-sans text-cu-ink antialiased">

        <!-- Navbar -->
        <x-navbar />

        <!-- Flash Messages -->
        @if (session('success'))
            <div class="max-w-7xl mx-auto px-4 pt-4">
                <x-app-alert type="success">
                    {{ session('success') }}
                </x-app-alert>
            </div>
        @endif

        @if (session('error'))
            <div class="max-w-7xl mx-auto px-4 pt-4">
                <x-app-alert type="danger">
                    {{ session('error') }}
                </x-app-alert>
            </div>
        @endif

        <!-- Page Heading -->
        @isset($header)
            <header class="border-b border-cu-line bg-cu-surface">
                <div class="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
                    {{ $header }}
                </div>
            </header>
        @endisset

        <!-- Page Content -->
        <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {{ $slot }}
        </main>

    </body>
</html>
