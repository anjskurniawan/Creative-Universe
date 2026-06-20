@props([
    'href' => '#',
    'showIcon' => true,
])

<a href="{{ $href }}" class="group flex items-center gap-1 rounded-full bg-cu-ink pl-4 pr-6 py-2 text-sm font-medium text-white
    transition-all duration-300 ease-out
    hover:bg-cu-ink-hover active:bg-black">
    @if($showIcon)
        <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px"
            fill="currentColor"
            class="transition-transform duration-300 ease-out group-hover:translate-x-1">
            <path
                d="M480-144v-72h264v-528H480v-72h264q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H480Zm-72-168-51-51 81-81H144v-72h294l-81-81 51-51 168 168-168 168Z" />
        </svg>
    @endif
    {{ $slot }}
</a>
