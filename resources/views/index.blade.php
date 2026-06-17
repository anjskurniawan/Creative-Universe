<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @auth
        <meta name="creative-universe-user-id" content="{{ auth()->id() }}">
    @endauth
    <title>Creative Universe</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap"
        rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body style="background-image: url('{{ asset('images/background/bg-test.jpg') }}');"
    class="font-sans antialiased bg-cover bg-center bg-no-repeat min-h-screen">
    <x-navbar variant="glass" />

    <div class="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div class="text-center px-6">
            @auth
                @php
                    $hour = now('Asia/Jakarta')->hour;
                    $greeting = match(true) {
                        $hour >= 5 && $hour < 12  => 'Good Morning ☀️',
                        $hour >= 12 && $hour < 17 => 'Good Afternoon 🌤️',
                        $hour >= 17 && $hour < 21 => 'Good Evening 🌅',
                        default                   => 'Good Night 🌙',
                    };
                @endphp
                <h1 class="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
                    Hi, {{ auth()->user()->name }}
                </h1>
                <p class="text-2xl md:text-4xl font-light text-gray-200 mt-4 drop-shadow-md">
                    {{ $greeting }}
                </p>
            @else
                <h1 class="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
                    Hi, this web is under maintenance
                </h1>
            @endauth
        </div>
    </div>

</body>

</html>
