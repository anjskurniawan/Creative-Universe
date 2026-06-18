<section id="shell" class="rounded-lg border border-cu-line bg-cu-panel p-6 shadow-sm">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
            <p class="text-sm font-medium text-cu-muted">Landing / App Header</p>
            <h2 class="mt-2 text-4xl font-medium leading-none text-cu-ink md:text-6xl">
                Empty interface state
            </h2>
            <p class="mt-4 max-w-2xl text-sm text-cu-muted">
                Halaman ini sengaja memakai konten kosong untuk menguji layout, spacing, warna, ikon, tombol, dan responsive behavior.
            </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
            <a href="#" class="inline-flex h-11 items-center justify-center rounded-full border border-cu-ink bg-cu-ink px-5 text-base font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover sm:h-14 sm:px-7 sm:text-lg">
                <span class="flex h-full items-center justify-center gap-2">
                    <svg aria-hidden="true" focusable="false" viewBox="0 -960 960 960"
                        class="cu-material-icon cu-material-icon-auto cu-material-icon-light cu-icon-login shrink-0">
                        <use href="{{ asset('images/icons/material-symbols.svg') }}#material-icon-login-light" width="100%"
                            height="100%" />
                    </svg>
                    <span class="flex h-full items-center justify-center whitespace-nowrap leading-none">Primary Action</span>
                </span>
            </a>

            <a href="#" class="inline-flex h-11 items-center justify-center rounded-full border border-cu-border bg-cu-surface px-5 text-base font-medium leading-none text-cu-ink transition duration-200 hover:border-cu-border-hover hover:bg-cu-surface-soft sm:h-14 sm:px-7 sm:text-lg">
                <span class="flex h-full items-center justify-center gap-2">
                    <span class="flex h-full items-center justify-center whitespace-nowrap leading-none">Secondary Action</span>
                </span>
            </a>
        </div>
    </div>
</section>
