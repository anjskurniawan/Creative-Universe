@props([
    'padding' => 'md',
])

@php
    $paddingClasses = [
        'none' => '',
        'sm' => 'p-4',
        'md' => 'p-5',
        'lg' => 'p-6',
    ];

    $classes = 'rounded-lg border border-cu-line bg-cu-panel shadow-sm ' . ($paddingClasses[$padding] ?? $paddingClasses['md']);
@endphp

<div {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</div>
