<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="Creative Universe — Login ke aplikasi internal divisi Creative">

        <title>{{ config('app.name', 'Creative Universe') }} — @yield('title', 'Login')</title>

        <!-- Fonts: Roboto -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

        <!-- Scripts & Styles -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans antialiased"
          style="background-image: url('{{ asset('images/background/bg-test.jpg') }}');"
          class="bg-cover bg-center bg-no-repeat min-h-screen">

        <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8
                    bg-gray-900/70 backdrop-blur-sm">

            <!-- Logo -->
            <div class="mb-6">
                <a href="{{ route('home') }}">
                    <img src="{{ asset('images/icon-app/Logo_White.png') }}" alt="Creative Universe" class="h-10">
                </a>
            </div>

            <!-- Flash Messages -->
            @if (session('status'))
                <div class="w-full sm:max-w-md mb-4">
                    <div class="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-md text-sm">
                        {{ session('status') }}
                    </div>
                </div>
            @endif

            <!-- Card Content -->
            <div class="w-full sm:max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="p-6 sm:p-8">
                    {{ $slot }}
                </div>
            </div>
        </div>

    </body>
</html>
