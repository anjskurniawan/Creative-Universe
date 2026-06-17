@props(['value'])

<label {{ $attributes->merge(['class' => 'block text-sm font-medium text-cu-ink']) }}>
    {{ $value ?? $slot }}
</label>
