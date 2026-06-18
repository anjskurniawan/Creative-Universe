@props([
    'initials' => 'AK',
    'imageUrl' => null,
    'href' => '#',
])

<span aria-label="Profil {{ $initials }}"
    class="inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cu-danger text-white transition-colors duration-300 ease-out hover:bg-cu-danger-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover border border-cu-line">
    @if($imageUrl)
        <img class="size-10 object-cover" src="{{ $imageUrl }}" alt="Foto Profil">
    @else
        <span class="text-sm font-medium">{{ $initials }}</span>
    @endif
</span>
