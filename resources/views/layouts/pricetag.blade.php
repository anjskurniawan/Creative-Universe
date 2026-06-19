<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @auth
            <meta name="creative-universe-user-id" content="{{ auth()->id() }}">
        @endauth
        <meta name="description" content="Pricetag Studio - Creative Universe">

        <!-- Favicon Pack -->
        <link rel="icon" type="image/png" href="/favicons/favicon-96x96.png?v=1.0" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg?v=1.0" />
        <link rel="shortcut icon" href="/favicons/favicon.ico?v=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png?v=1.0" />
        <meta name="apple-mobile-web-app-title" content="Creative" />
        <link rel="manifest" href="/favicons/site.webmanifest?v=1.0" />

        <title>{{ config('app.name', 'Creative Universe') }} - @yield('title', 'Pricetag Studio')</title>

        <!-- Fonts: Google Sans Flex -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet">
        <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
        <!-- Scripts & Styles -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])

        <style>
            @keyframes blob-movement-1 {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(150px, -180px) scale(1.3); }
                66% { transform: translate(-100px, 120px) scale(0.8); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            @keyframes blob-movement-2 {
                0% { transform: translate(0px, 0px) scale(1); }
                50% { transform: translate(-180px, 150px) scale(1.25); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            @keyframes blob-movement-3 {
                0% { transform: translate(0px, 0px) scale(1); }
                40% { transform: translate(180px, 100px) scale(0.75); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob-1 {
                animation: blob-movement-1 20s infinite ease-in-out;
            }
            .animate-blob-2 {
                animation: blob-movement-2 16s infinite ease-in-out;
            }
            .animate-blob-3 {
                animation: blob-movement-3 18s infinite ease-in-out;
            }
            .scrollbar-none::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-none {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        </style>
    </head>
    <body class="min-h-screen bg-[#0a0a0a] font-sans text-white antialiased flex flex-col relative overflow-x-hidden">

        <!-- Animated glowing blobs in background (70% Dark / 30% Glowing Rainbow Gradient) -->
        <div class="fixed inset-0 -z-10 bg-[#0a0a0a] overflow-hidden pointer-events-none">
            <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-600 opacity-30 blur-[120px] animate-blob-1"></div>
            <div class="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-600 via-cyan-600 to-teal-600 opacity-25 blur-[120px] animate-blob-2"></div>
            <div class="absolute top-[30%] -right-[10%] w-[35%] h-[35%] rounded-full bg-gradient-to-bl from-rose-600 via-pink-600 to-orange-500 opacity-20 blur-[100px] animate-blob-3"></div>
        </div>

        <!-- Navbar -->
        <x-navbar variant="dark-glass" />

        <!-- Flash Messages -->
        @if (session('success'))
            <div class="max-w-7xl mx-auto px-4 pt-4 w-full relative z-10">
                <x-app-alert type="success">
                    {{ session('success') }}
                </x-app-alert>
            </div>
        @endif

        @if (session('error'))
            <div class="max-w-7xl mx-auto px-4 pt-4 w-full relative z-10">
                <x-app-alert type="danger">
                    {{ session('error') }}
                </x-app-alert>
            </div>
        @endif

        <!-- Page Content -->
        <main class="flex-1 flex flex-col items-center justify-start w-full px-4 py-8 md:py-12 relative z-10">
            {{ $slot }}
        </main>

    </body>
</html>
