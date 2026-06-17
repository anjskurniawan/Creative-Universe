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
    <title>Creative Universe</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="min-h-screen bg-cu-surface font-sans text-cu-ink antialiased">
    <x-navbar variant="glass" />

    <main class="flex min-h-[calc(100vh-65px)] items-center justify-center px-10 pb-10 pt-20 sm:px-10 lg:px-16">
        <section aria-labelledby="landing-title" class="mx-auto w-full max-w-6xl text-center lg:-translate-y-3">
            @php
                $typewriterText = auth()->check()
                    ? 'Hi, ' . auth()->user()->name
                    : 'Creative Universe is under maintenance';
            @endphp

            <h1 id="landing-title" aria-label="{{ $typewriterText }}" data-typewriter="{{ $typewriterText }}"
                class="text-center text-5xl font-medium leading-none tracking-normal md:text-8xl lg:text-9xl">
                <span data-typewriter-text></span><span aria-hidden="true" data-typewriter-cursor
                    class="ml-2 inline-block h-12 w-1 bg-gradient-to-b from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end align-middle opacity-0 md:h-24 lg:h-28"></span>
                <noscript>{{ $typewriterText }}</noscript>
            </h1>

            <div data-typewriter-actions
                class="mt-10 flex flex-col items-center justify-center gap-3 opacity-0 blur-sm sm:mt-12 sm:flex-row">
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

    <script>
        window.addEventListener('load', () => {
            const title = document.querySelector('[data-typewriter]');

            if (!title || !window.gsap) {
                return;
            }

            const text = title.dataset.typewriter;
            const textTarget = title.querySelector('[data-typewriter-text]');
            const cursor = title.querySelector('[data-typewriter-cursor]');
            const actions = document.querySelector('[data-typewriter-actions]');

            if (!text || !textTarget || !cursor) {
                return;
            }

            const progress = {
                count: 0,
            };

            textTarget.textContent = '';
            cursor.classList.remove('opacity-0');

            const blink = gsap.to(cursor, {
                opacity: 0.2,
                duration: 0.55,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
            });

            gsap.to(progress, {
                count: text.length,
                duration: Math.max(2.8, text.length * 0.075),
                ease: 'none',
                onUpdate: () => {
                    textTarget.textContent = text.slice(0, Math.round(progress.count));
                },
                onComplete: () => {
                    textTarget.textContent = text;

                    if (actions) {
                        gsap.to(actions, {
                            opacity: 1,
                            filter: 'blur(0px)',
                            duration: 1.5,
                            ease: 'power2.out',
                        });
                    }

                    gsap.delayedCall(2, () => {
                        blink.kill();

                        gsap.to(cursor, {
                            opacity: 0,
                            duration: 0.25,
                            ease: 'power1.out',
                        });
                    });
                },
            });
        });
    </script>
</body>

</html>
