<section id="data" class="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
    <div class="overflow-hidden rounded-lg border border-cu-line bg-cu-panel shadow-sm">
        <div class="flex items-center justify-between border-b border-cu-line px-6 py-4">
            <div>
                <h2 class="text-lg font-semibold text-cu-ink">Table Empty State</h2>
                <p class="mt-1 text-sm text-cu-muted">Representasi halaman users / roles.</p>
            </div>
            <button class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-4 text-sm font-medium text-cu-surface">
                <span class="flex h-full items-center justify-center leading-none">
                    <span aria-hidden="true" class="material-symbols-outlined cu-material-icon cu-material-icon-auto cu-material-icon-light inline-flex shrink-0 items-center justify-center leading-none">add</span>
                </span>
                <span class="flex h-full items-center justify-center whitespace-nowrap leading-none">Create</span>
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-cu-muted">
                <thead class="border-b border-cu-line bg-cu-panel-soft text-xs uppercase">
                    <tr>
                        <th class="px-6 py-3">Name</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3">Role</th>
                        <th class="px-6 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="4" class="px-6 py-16 text-center">
                            <span aria-hidden="true" class="material-symbols-outlined cu-material-icon mx-auto mb-3 inline-flex size-10 shrink-0 items-center justify-center text-4xl leading-none text-cu-soft">inbox</span>
                            <p class="font-medium text-cu-ink">Belum ada data</p>
                            <p class="mt-1 text-sm text-cu-muted">Konten kosong untuk mengecek empty state.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="space-y-4">
        <div class="rounded-lg border border-cu-line bg-cu-panel p-5 shadow-sm">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-cu-ink">Notification Panel</h2>
                <span class="flex size-8 items-center justify-center rounded-full bg-cu-danger text-xs font-semibold text-cu-surface">0</span>
            </div>
            <div class="rounded-lg border border-dashed border-cu-border p-8 text-center">
                <span aria-hidden="true" class="material-symbols-outlined cu-material-icon mx-auto mb-2 inline-flex size-8 shrink-0 items-center justify-center text-3xl leading-none text-cu-soft">notifications_off</span>
                <p class="text-sm text-cu-muted">Belum ada notifikasi.</p>
            </div>
        </div>

        <div class="rounded-lg border border-cu-line bg-cu-panel p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-cu-ink">Role Chips</h2>
            <div class="mt-4 flex flex-wrap gap-2">
                <span class="rounded-full border border-cu-danger/20 bg-cu-danger-soft px-3 py-1 text-xs font-medium text-cu-danger">Superadmin</span>
                <span class="rounded-full border border-cu-info/20 bg-cu-info-soft px-3 py-1 text-xs font-medium text-cu-info">Manager</span>
                <span class="rounded-full border border-cu-success/20 bg-cu-success-soft px-3 py-1 text-xs font-medium text-cu-success">Designer</span>
            </div>
        </div>
    </div>
</section>
