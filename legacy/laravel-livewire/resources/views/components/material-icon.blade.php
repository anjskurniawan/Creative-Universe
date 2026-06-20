@props([
    'name' => null,
    'size' => 'auto',
    'weight' => null,
])

@php
    $sizeClasses = [
        'auto' => 'cu-material-icon-auto',
        'xs' => 'size-4',
        'sm' => 'size-5',
        'md' => 'size-6',
        'lg' => 'size-8',
        'xl' => 'size-10',
    ];

    $attributeClasses = preg_split('/\s+/', trim($attributes->get('class', ''))) ?: [];
    $iconClass = collect($attributeClasses)->first(
        fn (string $class) => str_starts_with($class, 'cu-icon-'),
    );
    $resolvedName = $name ?: str_replace('-', '_', substr($iconClass ?? '', 8));
    $resolvedName = preg_replace('/[^a-z0-9_]/', '', $resolvedName) ?: 'info';
    $resolvedIconClass = 'cu-icon-' . str_replace('_', '-', $resolvedName);
    $generatedIconClass = $iconClass ? '' : $resolvedIconClass;
    $isLight = $weight === 'light' || ($weight === null && in_array($size, ['auto', 'xs', 'sm'], true));
    $symbolSuffix = $isLight ? '-light' : '';
    $weightClass = $isLight ? 'cu-material-icon-light' : '';

    $classes = 'cu-material-icon inline-block shrink-0 ' . $generatedIconClass . ' ' . ($sizeClasses[$size] ?? $sizeClasses['auto']) . ' ' . $weightClass;
@endphp

<svg aria-hidden="true" focusable="false" viewBox="0 -960 960 960"
    {{ $attributes->merge(['class' => $classes]) }}>
    <use href="{{ asset('images/icons/material-symbols.svg') }}#material-icon-{{ $resolvedName }}{{ $symbolSuffix }}"
        width="100%" height="100%" />
</svg>
