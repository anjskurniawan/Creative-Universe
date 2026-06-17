<section id="forms" class="grid gap-8 lg:grid-cols-2">
    <div class="rounded-lg border border-cu-line bg-cu-panel p-6 shadow-sm">
        <div class="mb-6">
            <h2 class="text-lg font-semibold text-cu-ink">Form Empty State</h2>
            <p class="mt-1 text-sm text-cu-muted">Representasi auth/profile/role form.</p>
        </div>

        <form class="space-y-4">
            <div>
                <label for="playground-name" class="block text-sm font-medium text-cu-ink">Name</label>
                <input id="playground-name" class="mt-2 block w-full rounded-lg border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink" placeholder="Empty value">
            </div>
            <div>
                <label for="playground-email" class="block text-sm font-medium text-cu-ink">Email</label>
                <input id="playground-email" type="email" class="mt-2 block w-full rounded-lg border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink" placeholder="email@example.com">
            </div>
            <div>
                <label for="playground-note" class="block text-sm font-medium text-cu-ink">Note</label>
                <textarea id="playground-note" rows="3" class="mt-2 block w-full rounded-lg border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink" placeholder="Empty note"></textarea>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row">
                <button type="button" class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover">
                    <span class="flex h-full items-center justify-center leading-none">
                        <span aria-hidden="true" class="material-symbols-outlined cu-material-icon cu-material-icon-auto cu-material-icon-light inline-flex shrink-0 items-center justify-center leading-none">save</span>
                    </span>
                    <span class="flex h-full items-center justify-center whitespace-nowrap leading-none">Save</span>
                </button>
                <button type="button" class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-border bg-cu-surface px-5 text-sm font-medium leading-none text-cu-ink transition duration-200 hover:border-cu-border-hover hover:bg-cu-surface-soft">Cancel</button>
            </div>
        </form>
    </div>

    <div class="rounded-lg border border-cu-line bg-cu-panel p-6 shadow-sm">
        <div class="mb-6">
            <h2 class="text-lg font-semibold text-cu-ink">Modal Mockup</h2>
            <p class="mt-1 text-sm text-cu-muted">Static modal surface untuk mengecek spacing dan actions.</p>
        </div>

        <div class="rounded-lg border border-cu-line bg-cu-surface shadow-sm">
            <div class="border-b border-cu-line px-5 py-4">
                <h3 class="font-semibold text-cu-ink">Empty Modal Title</h3>
                <p class="mt-1 text-sm text-cu-muted">Deskripsi modal kosong.</p>
            </div>
            <div class="px-5 py-8 text-center">
                <span aria-hidden="true" class="material-symbols-outlined cu-material-icon mx-auto mb-3 inline-flex size-10 shrink-0 items-center justify-center text-4xl leading-none text-cu-soft">dashboard_customize</span>
                <p class="text-sm text-cu-muted">Modal content placeholder.</p>
            </div>
            <div class="flex justify-end gap-3 border-t border-cu-line px-5 py-4">
                <button type="button" class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-border bg-cu-surface px-5 text-sm font-medium leading-none text-cu-ink transition duration-200 hover:border-cu-border-hover hover:bg-cu-surface-soft">Batal</button>
                <button type="button" class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-danger bg-cu-danger px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-danger-hover hover:bg-cu-danger-hover">Hapus</button>
            </div>
        </div>
    </div>
</section>
