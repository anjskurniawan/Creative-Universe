<section class="grid gap-4 lg:grid-cols-4">
    @foreach ([
        ['info', 'info', 'border-cu-info/20 bg-cu-info-soft text-cu-info', 'Info state kosong.'],
        ['check_circle', 'success', 'border-cu-success/20 bg-cu-success-soft text-cu-success', 'Success state kosong.'],
        ['warning', 'warning', 'border-cu-warning/20 bg-cu-warning-soft text-cu-warning', 'Warning state kosong.'],
        ['error', 'danger', 'border-cu-danger/20 bg-cu-danger-soft text-cu-danger', 'Danger state kosong.'],
    ] as [$icon, $label, $classes, $message])
        <div class="flex flex-row gap-3 rounded-lg border px-4 py-3 text-sm font-medium {{ $classes }}">
            <span aria-hidden="true" class="material-symbols-outlined cu-material-icon cu-material-icon-auto cu-material-icon-light items-center justify-center leading-none">{{ $icon }}</span>
            <div class="flex flex-col items-center ">
                <span class="sr-only">{{ $label }}</span>
                {{ $message }}
            </div>
        </div>
    @endforeach
</section>
