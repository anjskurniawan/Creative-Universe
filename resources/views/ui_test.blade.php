<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UI Test</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=login"
        rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="min-h-screen bg-cu-surface font-sans text-cu-ink antialiased">
    <div class="relative min-h-screen overflow-hidden bg-cu-surface">
        {{-- Navbar --}}
        <nav aria-label="Navigasi utama" class="absolute inset-x-0 top-0 z-20">
            <div class="mx-auto flex w-full items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
                <a href="#" aria-label="Buka halaman Creative Universe"
                    class="inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cu-ink">
                    <img src="{{ asset('images/icon-app/Logo_White.png') }}" alt="logo" class="h-8 brightness-0">
                </a>

                {{-- Tombol Navbar --}}
                <a href="{{ route('login') }}"
                    class="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-4 py-2 text-sm font-medium text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cu-ink">
                    <x-material-icon name="login" />
                    <span class="hidden whitespace-nowrap sm:inline">Masuk</span>
                    <span class="whitespace-nowrap sm:hidden">Masuk</span>
                </a>
            </div>
        </nav>

        {{-- Main Content --}}
        <main class="flex min-h-screen items-center justify-center px-10 pb-10 pt-28 sm:px-10 lg:px-16">
            <section aria-labelledby="maintenance-title" class="mx-auto w-full max-w-6xl text-center lg:-translate-y-3">
                <h1 id="maintenance-title"
                    class="text-center text-5xl font-medium leading-none tracking-normal md:text-8xl lg:text-9xl">
                    Creative Universe is under maintenance
                </h1>

                {{-- Action Buttons --}}
                <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row">
                    <x-action-button :href="route('login')" variant="black" icon="login">
                        Masuk atau Daftar
                    </x-action-button>

                    <x-action-button :href="route('login')" variant="gray">
                        Pricetag Generator
                    </x-action-button>
                </div>
            </section>
        </main>
    </div>
</body>

</html>
