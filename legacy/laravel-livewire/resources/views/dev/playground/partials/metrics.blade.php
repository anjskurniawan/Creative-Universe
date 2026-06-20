<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    @foreach ([['groups', 'Metric'], ['pending_actions', 'Pending'], ['verified_user', 'Role'], ['notifications', 'Notification']] as [$icon, $label])
        <div class="rounded-lg border border-cu-line bg-cu-panel p-5 shadow-sm">
            <div class="flex items-center justify-between gap-4">
                <div>
                    <p class="text-sm text-cu-muted">{{ $label }}</p>
                    <div class="mt-3 h-9 w-20 rounded-md bg-cu-panel-soft"></div>
                </div>
                <div class="flex size-12 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-muted">
                    <svg aria-hidden="true" focusable="false" viewBox="0 -960 960 960"
                        class="cu-material-icon cu-icon-{{ str_replace('_', '-', $icon) }} size-6 shrink-0">
                        <use href="{{ asset('images/icons/material-symbols.svg') }}#material-icon-{{ $icon }}" width="100%"
                            height="100%" />
                    </svg>
                </div>
            </div>
        </div>
    @endforeach
</section>
