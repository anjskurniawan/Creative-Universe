@props([
    'href' => null,
    'icon' => null,
    'type' => 'button',
    'variant' => 'black',
])

@php
    $baseClasses = 'inline-flex h-11 items-center justify-center rounded-full px-5 text-base font-medium leading-none transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cu-ink disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:px-7 sm:text-lg';

    $variantClasses = [
        'black' => 'border border-cu-ink bg-cu-ink text-cu-surface hover:border-cu-ink-hover hover:bg-cu-ink-hover',
        'gray' => 'border border-cu-border bg-cu-surface text-cu-ink hover:border-cu-border-hover hover:bg-cu-surface-soft',
    ];

    $classes = $baseClasses . ' ' . ($variantClasses[$variant] ?? $variantClasses['black']);
@endphp

@if ($href)
    <a href="{{ $href }}" {{ $attributes->merge(['class' => $classes]) }}>
        <span class="flex h-full items-center justify-center gap-2">
            @if ($icon)
                <span class="flex h-full items-center justify-center leading-none">
                    <x-material-icon :name="$icon" size="auto" />
                </span>
            @endif

            <span class="flex h-full items-center justify-center whitespace-nowrap leading-none">{{ $slot }}</span>
        </span>
    </a>
@else
    <button type="{{ $type }}" {{ $attributes->merge(['class' => $classes]) }}>
        <span class="flex h-full items-center justify-center gap-2">
            @if ($icon)
                <span class="flex h-full items-center justify-center leading-none">
                    <x-material-icon :name="$icon" size="auto" />
                </span>
            @endif

            <span class="flex h-full items-center justify-center whitespace-nowrap leading-none">{{ $slot }}</span>
        </span>
    </button>
@endif
