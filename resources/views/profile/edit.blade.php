<x-app-layout>
    <x-slot name="header">
        <h2 class="text-2xl font-semibold leading-tight text-cu-ink">
            {{ __('Profile') }}
        </h2>
    </x-slot>

    <div class="space-y-6">
            <x-app-panel padding="lg">
                <div class="max-w-xl">
                    @include('profile.partials.update-profile-information-form')
                </div>
            </x-app-panel>

            <x-app-panel padding="lg">
                <div class="max-w-xl">
                    @include('profile.partials.update-password-form')
                </div>
            </x-app-panel>

            <x-app-panel padding="lg">
                <div class="max-w-xl">
                    @include('profile.partials.delete-user-form')
                </div>
            </x-app-panel>
    </div>
</x-app-layout>
