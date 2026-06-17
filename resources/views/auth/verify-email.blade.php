<x-guest-layout>
    <div class="mb-6 flex items-start gap-3">
        <div class="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
            <x-material-icon name="mark_email_read" size="md" />
        </div>
        <div>
            <h1 class="text-2xl font-semibold text-cu-ink">{{ __('Verify Email') }}</h1>
            <p class="mt-1 text-sm text-cu-muted">
                {{ __('Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?') }}
            </p>
        </div>
    </div>

    @if (session('status') == 'verification-link-sent')
        <x-app-alert type="success" class="mb-4">
            {{ __('A new verification link has been sent to the email address you provided during registration.') }}
        </x-app-alert>
    @endif

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form method="POST" action="{{ route('verification.send') }}">
            @csrf
            <x-primary-button>
                {{ __('Resend Verification Email') }}
            </x-primary-button>
        </form>

        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="inline-flex items-center gap-2 text-sm font-medium text-cu-muted hover:text-cu-ink">
                <x-material-icon name="logout" />
                {{ __('Log Out') }}
            </button>
        </form>
    </div>
</x-guest-layout>
