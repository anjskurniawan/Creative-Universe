<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60']) }}>
    <span class="flex h-full items-center justify-center gap-2">
        {{ $slot }}
    </span>
</button>
