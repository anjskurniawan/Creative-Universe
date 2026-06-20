<div class="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-8">
    <x-app-panel padding="lg" class="w-full">
        <div class="mb-6 flex items-start gap-3">
            <div class="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
                <x-material-icon class="cu-icon-login" size="md" />
            </div>
            <div>
                <h1 class="text-2xl font-semibold leading-tight text-cu-ink">
                    Sign in to your account
                </h1>
                <p class="mt-1 text-sm text-cu-muted">Use your email to continue.</p>
            </div>
        </div>

        <form class="space-y-4" action="#">
            <div>
                <x-input-label for="email" value="Email" />
                <x-text-input id="email" name="email" type="email" class="mt-2 w-full" placeholder="Email" required />
            </div>

            <div>
                <x-input-label for="password" value="Password" />
                <x-text-input id="password" name="password" type="password" class="mt-2 w-full" placeholder="Password" required />
            </div>

            <div class="flex items-center justify-between">
                <label for="remember" class="flex items-center gap-2 text-sm text-cu-muted">
                    <input id="remember" type="checkbox" class="size-4 rounded border-cu-border text-cu-ink focus:ring-cu-ink">
                    Remember me
                </label>
                <a href="#" class="text-sm font-medium text-cu-info hover:text-cu-info-hover">Forgot password?</a>
            </div>

            <x-primary-button class="w-full">
                Continue
            </x-primary-button>

            <p class="text-sm text-cu-muted">
                Don't have an account yet?
                <a href="#" class="font-medium text-cu-info hover:text-cu-info-hover">Sign up</a>
            </p>
        </form>
    </x-app-panel>
</div>
