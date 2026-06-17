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
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=login" />
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="min-h-screen bg-white font-['Google_Sans_Flex',_sans-serif] text-[#111217] antialiased">

    <div class="relative min-h-screen overflow-hidden bg-white">

        {{-- Navbar --}}
        <nav aria-label="Navigasi utama" class="absolute inset-x-0 top-0 z-20">
            <div class="
                    mx-auto flex w-full
                    items-center justify-between
                    px-6 py-4
                    sm:px-10
                    lg:px-[68px] lg:py-[15px]
                ">

                <a href="#" aria-label="Buka halaman Creative Universe" class="
                        inline-flex items-center
                        rounded-md
                        focus-visible:outline-2
                        focus-visible:outline-offset-4
                        focus-visible:outline-[#111217]
                    ">
                    <img src="{{ asset('images/icon-app/Logo_White.png') }}" alt="logo" class="h-8">

                </a>

                {{-- Tombol Navbar --}}
                <a href="{{ route('login') }}" class="
                        inline-flex min-h-9
                        items-center justify-center gap-2
                        rounded-full
                        border border-[#111217]
                        bg-[#111217]
                        px-4
                        text-sm font-[520]
                        text-white
                        transition duration-200
                        hover:border-[#292a30]
                        hover:bg-[#292a30]
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-[#111217]
                    ">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                        fill="currentColor" class="size-4 shrink-0">
                        <path
                            d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                    </svg>

                    <span class="hidden whitespace-nowrap sm:inline">
                        Masuk atau Daftar
                    </span>

                    <span class="whitespace-nowrap sm:hidden">
                        Masuk
                    </span>
                </a>
            </div>
        </nav>

        {{-- Main Content --}}
        <main class="
                flex min-h-screen
                items-center justify-center
                px-6 pb-10 pt-28
                sm:px-10
                lg:px-[68px]
            ">
            <section aria-labelledby="maintenance-title" class="
                    mx-auto w-full max-w-[1120px]
                    text-center
                    lg:-translate-y-3
                ">
                <h1 id="maintenance-title"
                    class="font-medium text-9xl text-center">Creative Universe
                    is under maintenance</h1>

                {{-- Action Buttons --}}
                <div class="
                        mt-10 flex flex-row
                        flex-wrap items-center
                        justify-center gap-3
                        sm:mt-12
                    ">
                    <a href="{{ route('login') }}" class="
                            inline-flex min-h-11
                            items-center justify-center gap-2
                            rounded-full
                            border border-[#111217]
                            bg-[#111217]
                            px-5
                            text-base font-[520]
                            leading-none
                            text-white
                            transition duration-200
                            hover:border-[#292a30]
                            hover:bg-[#292a30]
                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-[#111217]
                        ">


                        <span class="whitespace-nowrap">
                            Masuk atau Daftar
                        </span>
                    </a>

                    <a href="{{ url('/pricetag') }}" class="
                            inline-flex min-h-11
                            items-center justify-center
                            rounded-full
                            border border-[#dedee5]
                            bg-white
                            px-5
                            text-base font-[520]
                            leading-none
                            text-[#111217]
                            transition duration-200
                            hover:border-[#bfc0c8]
                            hover:bg-[#f8f8fa]
                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-[#111217]
                        ">
                        <span class="whitespace-nowrap">
                            Buat Pricetag
                        </span>
                    </a>
                </div>
            </section>
        </main>

    </div>

</body>

</html>
