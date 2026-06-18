@props([
    'type' => 'info',
])

@php
    $typeClasses = [
        'info' => 'border-cu-info/20 bg-cu-info-soft text-cu-info',
        'success' => 'border-cu-success/20 bg-cu-success-soft text-cu-success',
        'warning' => 'border-cu-warning/20 bg-cu-warning-soft text-cu-warning',
        'danger' => 'border-cu-danger/20 bg-cu-danger-soft text-cu-danger',
    ];

    $icons = [
        'info' => 'info',
        'success' => 'check_circle',
        'warning' => 'warning',
        'danger' => 'error',
    ];

    $classes = 'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm font-medium ' . ($typeClasses[$type] ?? $typeClasses['info']);
@endphp

<div role="alert" {{ $attributes->merge(['class' => $classes]) }}>
    <x-material-icon :class="'cu-icon-' . str_replace('_', '-', $icons[$type] ?? $icons['info']) . ' mt-0.5'" size="sm" />
    <div>{{ $slot }}</div>
</div>
