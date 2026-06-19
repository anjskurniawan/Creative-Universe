<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="Creative Universe - Login ke aplikasi internal divisi Creative">

    <!-- Favicon Pack -->
    <link rel="icon" type="image/png" href="/favicons/favicon-96x96.png?v=1.0" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg?v=1.0" />
    <link rel="shortcut icon" href="/favicons/favicon.ico?v=1.0" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png?v=1.0" />
    <meta name="apple-mobile-web-app-title" content="Creative" />
    <link rel="manifest" href="/favicons/site.webmanifest?v=1.0" />

    <title>{{ config('app.name', 'Creative Universe') }} - @yield('title', 'Login')</title>

    <!-- Fonts: Google Sans Flex -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet">
    <!-- Scripts & Styles -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="min-h-screen bg-cu-surface font-sans text-cu-ink antialiased">

    <div class="flex min-h-screen flex-col items-center justify-center px-4 py-8">

        <!-- Logo -->
        <div class="mb-6">
            <a href="{{ route('home') }}" class="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cu-ink">
                <img src="{{ asset('images/icon-app/Logo_White.png') }}" alt="Creative Universe" class="h-10 brightness-0">
            </a>
        </div>

        <!-- Flash Messages -->
        @if (session('status'))
            <div class="w-full sm:max-w-md mb-4">
                <x-app-alert type="success">
                    {{ session('status') }}
                </x-app-alert>
            </div>
        @endif

        <!-- Card Content -->
        <div class="w-full overflow-hidden rounded-lg border border-cu-line bg-cu-panel shadow-sm sm:max-w-md">
            <div class="p-6 sm:p-8">
                {{ $slot }}
            </div>
        </div>
    </div>

</body>

</html>
