<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    @foreach ([['groups', 'Metric'], ['pending_actions', 'Pending'], ['verified_user', 'Role'], ['notifications', 'Notification']] as [$icon, $label])
        <div class="rounded-lg border border-cu-line bg-cu-panel p-5 shadow-sm">
            <div class="flex items-center justify-between gap-4">
                <div>
                    <p class="text-sm text-cu-muted">{{ $label }}</p>
                    <div class="mt-3 h-9 w-20 rounded-md bg-cu-panel-soft"></div>
                </div>
                <div class="flex size-12 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-muted">
                    <span aria-hidden="true" class="material-symbols-outlined cu-material-icon inline-flex size-6 shrink-0 items-center justify-center text-xl leading-none">{{ $icon }}</span>
                </div>
            </div>
        </div>
    @endforeach
</section>
