@props([
    'href' => '#',
    'label' => '',
])

<a href="{{ $href }}" class="p-2 rounded-full transition-all duration-300 ease-out hover:bg-cu-panel-soft" aria-label="{{ $label }}">
    {{ $slot }}
</a>
