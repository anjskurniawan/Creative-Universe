@props([
    'href' => '#',
    'navigate' => true,
])

<a href="{{ $href }}" {{ $navigate ? 'wire:navigate' : '' }}
    class="inline-flex py-1.5 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-4 text-sm font-medium text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
    {{ $slot }}
</a>
