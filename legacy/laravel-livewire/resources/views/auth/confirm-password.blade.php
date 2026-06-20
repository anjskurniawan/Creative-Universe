<x-guest-layout>
    <div class="mb-6 flex items-start gap-3">
        <div class="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
            <x-material-icon class="cu-icon-lock" size="md" />
        </div>
        <div>
            <h1 class="text-2xl font-semibold text-cu-ink">{{ __('Confirm Password') }}</h1>
            <p class="mt-1 text-sm text-cu-muted">
                {{ __('This is a secure area of the application. Please confirm your password before continuing.') }}
            </p>
        </div>
    </div>

    <form method="POST" action="{{ route('password.confirm') }}" class="space-y-4">
        @csrf

        <div>
            <x-input-label for="password" :value="__('Password')" />
            <x-text-input id="password" class="mt-2 w-full" type="password" name="password" required autocomplete="current-password" />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <x-primary-button class="w-full">
            {{ __('Confirm') }}
        </x-primary-button>
    </form>
</x-guest-layout>
