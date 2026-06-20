@props([
    'href' => '#',
    'initials' => 'AK',
])

<a href="{{ $href }}" aria-label="Profil {{ $initials }}"
    class="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-cu-danger text-white transition-colors duration-300 ease-out hover:bg-cu-danger-hover">
    <span class="text-sm font-medium">{{ $initials }}</span>
</a>
