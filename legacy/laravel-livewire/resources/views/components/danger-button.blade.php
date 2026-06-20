<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-danger bg-cu-danger px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-danger-hover hover:bg-cu-danger-hover focus:outline-none focus:ring-2 focus:ring-cu-danger focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60']) }}>
    <span class="flex h-full items-center justify-center gap-2">
        {{ $slot }}
    </span>
</button>
