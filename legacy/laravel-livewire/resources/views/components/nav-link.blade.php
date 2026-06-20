@props(['active'])

@php
$classes = ($active ?? false)
            ? 'inline-flex items-center border-b-2 border-cu-ink px-1 pt-1 text-sm font-medium leading-5 text-cu-ink transition duration-150 ease-in-out focus:outline-none focus:border-cu-ink'
            : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-cu-muted transition duration-150 ease-in-out hover:border-cu-border-hover hover:text-cu-ink focus:outline-none focus:border-cu-border-hover focus:text-cu-ink';
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</a>
