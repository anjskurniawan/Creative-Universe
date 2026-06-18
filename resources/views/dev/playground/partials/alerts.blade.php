<section class="grid gap-4 lg:grid-cols-4">
    @foreach ([
        ['info', 'info', 'border-cu-info/20 bg-cu-info-soft text-cu-info', 'Info state kosong.'],
        ['check_circle', 'success', 'border-cu-success/20 bg-cu-success-soft text-cu-success', 'Success state kosong.'],
        ['warning', 'warning', 'border-cu-warning/20 bg-cu-warning-soft text-cu-warning', 'Warning state kosong.'],
        ['error', 'danger', 'border-cu-danger/20 bg-cu-danger-soft text-cu-danger', 'Danger state kosong.'],
    ] as [$icon, $label, $classes, $message])
        <div class="flex flex-row gap-3 rounded-lg border px-4 py-3 text-sm font-medium {{ $classes }}">
            <svg aria-hidden="true" focusable="false" viewBox="0 -960 960 960"
                class="cu-material-icon cu-material-icon-auto cu-material-icon-light cu-icon-{{ str_replace('_', '-', $icon) }} shrink-0">
                <use href="{{ asset('images/icons/material-symbols.svg') }}#material-icon-{{ $icon }}-light" width="100%"
                    height="100%" />
            </svg>
            <div class="flex flex-col items-center ">
                <span class="sr-only">{{ $label }}</span>
                {{ $message }}
            </div>
        </div>
    @endforeach
</section>
