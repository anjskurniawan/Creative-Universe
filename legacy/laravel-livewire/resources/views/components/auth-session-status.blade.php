@props(['status'])

@if ($status)
    <div {{ $attributes->merge(['class' => 'text-sm font-medium text-cu-success']) }}>
        {{ $status }}
    </div>
@endif
