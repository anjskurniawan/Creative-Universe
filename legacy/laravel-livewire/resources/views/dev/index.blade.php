<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dev Menu</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="min-h-screen bg-cu-surface-soft font-sans text-cu-ink antialiased">
    <main class="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-10 lg:px-8">
        <div class="mb-8">
            <p class="text-sm font-medium text-cu-muted">Creative Universe</p>
            <h1 class="mt-2 text-4xl font-semibold leading-none text-cu-ink md:text-6xl">Dev UI</h1>
            <p class="mt-4 max-w-2xl text-cu-muted">
                Area lokal untuk mengecek pondasi frontend, component system, dan playground UI tanpa data produksi.
            </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
            <a href="{{ route('dev.components') }}"
                class="group rounded-lg border border-cu-line bg-cu-panel p-6 shadow-sm transition-colors hover:border-cu-border-hover hover:bg-cu-surface">
                <div class="mb-6 flex size-12 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
                    <x-material-icon class="cu-icon-widgets" size="md" />
                </div>
                <h2 class="text-xl font-semibold text-cu-ink">Components</h2>
                <p class="mt-2 text-sm text-cu-muted">
                    Lihat variasi button, alert, panel, input, dan Material icon beserta lokasi file editnya.
                </p>
                <span class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cu-info group-hover:text-cu-info-hover">
                    Buka components
                    <x-material-icon class="cu-icon-arrow-forward" />
                </span>
            </a>

            <a href="{{ route('dev.playground') }}"
                class="group rounded-lg border border-cu-line bg-cu-panel p-6 shadow-sm transition-colors hover:border-cu-border-hover hover:bg-cu-surface">
                <div class="mb-6 flex size-12 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
                    <x-material-icon class="cu-icon-dashboard-customize" size="md" />
                </div>
                <h2 class="text-xl font-semibold text-cu-ink">Playground</h2>
                <p class="mt-2 text-sm text-cu-muted">
                    Satu halaman kosong yang menggabungkan pola UI dari landing, auth, dashboard, user, role, dan profile.
                </p>
                <span class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cu-info group-hover:text-cu-info-hover">
                    Buka playground
                    <x-material-icon class="cu-icon-arrow-forward" />
                </span>
            </a>
        </div>
    </main>
</body>

</html>
