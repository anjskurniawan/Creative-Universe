@props(['active'])

@php
$classes = ($active ?? false)
            ? 'block w-full border-l-4 border-cu-ink bg-cu-panel-soft py-2 pe-4 ps-3 text-start text-base font-medium text-cu-ink transition duration-150 ease-in-out focus:outline-none focus:border-cu-ink'
            : 'block w-full border-l-4 border-transparent py-2 pe-4 ps-3 text-start text-base font-medium text-cu-muted transition duration-150 ease-in-out hover:border-cu-border-hover hover:bg-cu-panel-soft hover:text-cu-ink focus:outline-none focus:border-cu-border-hover focus:bg-cu-panel-soft focus:text-cu-ink';
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</a>
