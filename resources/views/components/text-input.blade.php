@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->merge(['class' => 'block rounded-lg border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted']) }}>
