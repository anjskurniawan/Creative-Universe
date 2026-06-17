@props([
    'name',
    'size' => 'auto',
    'weight' => null,
])

@php
    $sizeClasses = [
        'auto' => 'cu-material-icon-auto',
        'xs' => 'size-4 text-sm',
        'sm' => 'size-5 text-base',
        'md' => 'size-6 text-xl',
        'lg' => 'size-8 text-3xl',
        'xl' => 'size-10 text-4xl',
    ];

    $weightClass = $weight === 'light' || ($weight === null && in_array($size, ['auto', 'xs', 'sm'], true))
        ? 'cu-material-icon-light'
        : '';

    $classes = 'material-symbols-outlined cu-material-icon inline-flex shrink-0 items-center justify-center leading-none ' . ($sizeClasses[$size] ?? $sizeClasses['auto']) . ' ' . $weightClass;
@endphp

<span aria-hidden="true" {{ $attributes->merge(['class' => $classes]) }}>{{ $name }}</span>
