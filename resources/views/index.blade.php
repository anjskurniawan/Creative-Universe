<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @auth
        <meta name="creative-universe-user-id" content="{{ auth()->id() }}">
    @endauth
    <meta name="description" content="Creative Universe - Hub aplikasi internal divisi Creative PT. Doran Sukses Indonesia">

    <!-- Favicon Pack -->
    <link rel="icon" type="image/png" href="/favicons/favicon-96x96.png?v=1.0" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg?v=1.0" />
    <link rel="shortcut icon" href="/favicons/favicon.ico?v=1.0" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png?v=1.0" />
    <meta name="apple-mobile-web-app-title" content="Creative" />
    <link rel="manifest" href="/favicons/site.webmanifest?v=1.0" />

    <title>Creative Universe</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="min-h-screen bg-cu-surface font-sans text-cu-ink antialiased">
    <div data-interactive-hero class="relative isolate flex min-h-screen flex-col overflow-hidden bg-cu-surface">
        <canvas data-particle-canvas aria-hidden="true"
            class="pointer-events-none absolute inset-0 z-0 size-full"></canvas>

        <div aria-hidden="true" class="cu-landing-readability pointer-events-none absolute inset-0 z-10"></div>
        <div aria-hidden="true"
            class="cu-landing-fade pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40"></div>

        <div class="relative z-30">
            <x-navbar variant="glass" />
        </div>

        <main class="relative z-20 flex flex-1 items-center justify-center px-10 py-10 sm:px-10 lg:px-16">
            <section aria-labelledby="landing-title" class="mx-auto w-full max-w-6xl text-center lg:-translate-y-3">
                @php
                    $typewriterText = auth()->check()
                        ? 'Hi, ' . auth()->user()->name
                        : 'Creative Universe is under maintenance';
                @endphp

                <h1 id="landing-title" aria-label="{{ $typewriterText }}" data-typewriter="{{ $typewriterText }}"
                    class="text-center text-5xl font-medium leading-none tracking-normal md:text-8xl lg:text-9xl">
                    <span data-typewriter-text>{{ $typewriterText }}</span><span aria-hidden="true"
                        data-typewriter-cursor
                        class="ml-2 inline-block h-12 w-1 bg-gradient-to-b from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end align-middle opacity-0 md:h-24 lg:h-28"></span>
                    <noscript>{{ $typewriterText }}</noscript>
                </h1>

                <div data-typewriter-actions
                    class="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row">
                    @auth
                        <x-action-button :href="route('dashboard')" variant="black" icon="dashboard">
                            Dashboard
                        </x-action-button>

                        <x-action-button :href="route('profile.edit')" variant="gray" icon="person">
                            Profil Saya
                        </x-action-button>
                    @else
                        <x-action-button :href="route('login')" variant="black" icon="login">
                            Masuk atau Daftar
                        </x-action-button>

                        <x-action-button :href="route('register')" variant="gray">
                            Daftar Akun
                        </x-action-button>
                    @endauth
                </div>
            </section>
        </main>
    </div>
</body>

</html>
