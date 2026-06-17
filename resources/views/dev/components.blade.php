<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frontend Components</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="min-h-screen bg-cu-surface-soft font-sans text-cu-ink antialiased">
    <header class="sticky top-0 z-50 border-b border-cu-line bg-cu-surface/90 backdrop-blur-md">
        <div class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div>
                <p class="text-sm font-medium text-cu-muted">Creative Universe</p>
                <h1 class="text-2xl font-semibold text-cu-ink">Frontend Components</h1>
            </div>

            <nav class="flex flex-wrap gap-2 text-sm font-medium">
                <a href="{{ route('dev.index') }}" class="rounded-full border border-cu-border bg-cu-surface px-4 py-2 text-cu-ink hover:bg-cu-panel-soft">Dev</a>
                <a href="{{ route('dev.playground') }}" class="rounded-full border border-cu-border bg-cu-surface px-4 py-2 text-cu-ink hover:bg-cu-panel-soft">Playground</a>
                <a href="#buttons" class="rounded-full border border-cu-border bg-cu-surface px-4 py-2 text-cu-ink hover:bg-cu-panel-soft">Buttons</a>
                <a href="#alerts" class="rounded-full border border-cu-border bg-cu-surface px-4 py-2 text-cu-ink hover:bg-cu-panel-soft">Alerts</a>
                <a href="#panels" class="rounded-full border border-cu-border bg-cu-surface px-4 py-2 text-cu-ink hover:bg-cu-panel-soft">Panels</a>
                <a href="#forms" class="rounded-full border border-cu-border bg-cu-surface px-4 py-2 text-cu-ink hover:bg-cu-panel-soft">Forms</a>
                <a href="#icons" class="rounded-full border border-cu-border bg-cu-surface px-4 py-2 text-cu-ink hover:bg-cu-panel-soft">Icons</a>
            </nav>
        </div>
    </header>

    <main class="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
        <x-app-panel id="buttons" padding="lg">
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-cu-ink">Buttons</h2>
                <p class="mt-1 text-sm text-cu-muted">
                    Edit component:
                    <code class="rounded bg-cu-panel-soft px-2 py-1 text-cu-ink">resources/views/components/action-button.blade.php</code>
                    dan
                    <code class="rounded bg-cu-panel-soft px-2 py-1 text-cu-ink">resources/views/components/primary-button.blade.php</code>.
                </p>
            </div>

            <div class="space-y-6">
                <div>
                    <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-cu-muted">Action Button</h3>
                    <div class="flex flex-wrap items-center gap-3">
                        <x-action-button href="#" variant="black" icon="login">Black + Icon</x-action-button>
                        <x-action-button href="#" variant="black">Black</x-action-button>
                        <x-action-button href="#" variant="gray" icon="sell">Gray + Icon</x-action-button>
                        <x-action-button href="#" variant="gray">Gray</x-action-button>
                        <x-action-button variant="black" icon="add" disabled>Disabled</x-action-button>
                    </div>
                </div>

                <div>
                    <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-cu-muted">Base Buttons</h3>
                    <div class="flex flex-wrap items-center gap-3">
                        <x-primary-button>
                            <span class="flex h-full items-center justify-center leading-none"><x-material-icon name="check" /></span>
                            <span class="flex h-full items-center justify-center whitespace-nowrap leading-none">Primary</span>
                        </x-primary-button>

                        <x-secondary-button>
                            Secondary
                        </x-secondary-button>

                        <x-danger-button type="button">
                            <span class="flex h-full items-center justify-center leading-none"><x-material-icon name="delete" /></span>
                            <span class="flex h-full items-center justify-center whitespace-nowrap leading-none">Danger</span>
                        </x-danger-button>

                        <x-primary-button disabled>
                            Disabled
                        </x-primary-button>
                    </div>
                </div>

                <div>
                    <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-cu-muted">Small Text With Light Icon</h3>
                    <div class="flex flex-wrap items-center gap-4 text-sm">
                        <a href="#" class="inline-flex items-center gap-2 font-medium text-cu-muted hover:text-cu-ink">
                            <span class="flex items-center justify-center leading-none"><x-material-icon name="arrow_back" /></span>
                            <span class="leading-none">Kembali</span>
                        </a>
                        <a href="#" class="inline-flex items-center gap-2 font-medium text-cu-info hover:text-cu-info-hover">
                            <span class="flex items-center justify-center leading-none"><x-material-icon name="arrow_forward" /></span>
                            <span class="leading-none">Lanjutkan</span>
                        </a>
                    </div>
                </div>
            </div>
        </x-app-panel>

        <x-app-panel id="alerts" padding="lg">
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-cu-ink">Alerts</h2>
                <p class="mt-1 text-sm text-cu-muted">
                    Edit component:
                    <code class="rounded bg-cu-panel-soft px-2 py-1 text-cu-ink">resources/views/components/app-alert.blade.php</code>
                </p>
            </div>

            <div class="grid gap-3 md:grid-cols-2">
                <x-app-alert type="info">Informasi umum untuk user.</x-app-alert>
                <x-app-alert type="success">Aksi berhasil diproses.</x-app-alert>
                <x-app-alert type="warning">Ada data yang perlu ditinjau.</x-app-alert>
                <x-app-alert type="danger">Aksi gagal atau perlu perhatian.</x-app-alert>
            </div>
        </x-app-panel>

        <x-app-panel id="panels" padding="lg">
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-cu-ink">Panels</h2>
                <p class="mt-1 text-sm text-cu-muted">
                    Edit component:
                    <code class="rounded bg-cu-panel-soft px-2 py-1 text-cu-ink">resources/views/components/app-panel.blade.php</code>
                </p>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
                <x-app-panel padding="sm">
                    <p class="text-sm font-semibold text-cu-ink">Small Padding</p>
                    <p class="mt-1 text-sm text-cu-muted">Untuk konten compact.</p>
                </x-app-panel>
                <x-app-panel padding="md">
                    <p class="text-sm font-semibold text-cu-ink">Medium Padding</p>
                    <p class="mt-1 text-sm text-cu-muted">Default panel content.</p>
                </x-app-panel>
                <x-app-panel padding="lg">
                    <p class="text-sm font-semibold text-cu-ink">Large Padding</p>
                    <p class="mt-1 text-sm text-cu-muted">Untuk section utama.</p>
                </x-app-panel>
            </div>
        </x-app-panel>

        <x-app-panel id="forms" padding="lg">
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-cu-ink">Forms</h2>
                <p class="mt-1 text-sm text-cu-muted">
                    Edit component:
                    <code class="rounded bg-cu-panel-soft px-2 py-1 text-cu-ink">resources/views/components/text-input.blade.php</code>
                    dan
                    <code class="rounded bg-cu-panel-soft px-2 py-1 text-cu-ink">resources/views/components/input-label.blade.php</code>.
                </p>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <div>
                    <x-input-label for="demo-name" value="Nama Lengkap" />
                    <x-text-input id="demo-name" class="mt-2 w-full" placeholder="Creative Team" />
                </div>
                <div>
                    <x-input-label for="demo-email" value="Email" />
                    <x-text-input id="demo-email" type="email" class="mt-2 w-full" placeholder="creative@example.com" />
                    <x-input-error class="mt-2" :messages="['Contoh pesan error input.']" />
                </div>
            </div>
        </x-app-panel>

        <x-app-panel id="icons" padding="lg">
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-cu-ink">Material Icons</h2>
                <p class="mt-1 text-sm text-cu-muted">
                    Edit component:
                    <code class="rounded bg-cu-panel-soft px-2 py-1 text-cu-ink">resources/views/components/material-icon.blade.php</code>
                    dan style icon di
                    <code class="rounded bg-cu-panel-soft px-2 py-1 text-cu-ink">resources/css/app.css</code>.
                </p>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-6">
                @foreach (['login', 'dashboard', 'person', 'group', 'pending_actions', 'notifications', 'sell', 'add', 'edit', 'delete', 'check', 'close'] as $icon)
                    <div class="flex items-center gap-2 rounded-lg border border-cu-line bg-cu-surface px-3 py-2">
                        <x-material-icon :name="$icon" />
                        <span class="truncate text-cu-muted">{{ $icon }}</span>
                    </div>
                @endforeach
            </div>
        </x-app-panel>
    </main>
</body>

</html>
