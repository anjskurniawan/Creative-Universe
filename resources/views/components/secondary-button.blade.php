<button {{ $attributes->merge(['type' => 'button', 'class' => 'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-border bg-cu-surface px-5 text-sm font-medium leading-none text-cu-ink transition duration-200 hover:border-cu-border-hover hover:bg-cu-surface-soft focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60']) }}>
    <span class="flex h-full items-center justify-center gap-2">
        {{ $slot }}
    </span>
</button>
