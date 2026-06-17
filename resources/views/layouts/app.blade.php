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
    <body class="font-sans antialiased bg-gray-900 text-gray-200 min-h-screen">

        <!-- Navbar -->
        <x-navbar />

        <!-- Flash Messages -->
        @if (session('success'))
            <div class="max-w-7xl mx-auto px-4 pt-4">
                <div class="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-md text-sm" role="alert">
                    {{ session('success') }}
                </div>
            </div>
        @endif

        @if (session('error'))
            <div class="max-w-7xl mx-auto px-4 pt-4">
                <div class="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm" role="alert">
                    {{ session('error') }}
                </div>
            </div>
        @endif

        <!-- Page Heading -->
        @isset($header)
            <header class="border-b border-gray-700/50 bg-gray-800/30">
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
