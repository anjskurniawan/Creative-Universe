@props([
    'logoUrl' => '#',
])

<nav class="w-full z-20 top-0">
    <div class="flex flex-wrap justify-between items-center py-2 px-16">
        @include('dev.components.brand', ['href' => $logoUrl])

        <div class="flex items-center gap-2">
            {{ $slot }}
        </div>
    </div>
</nav>
