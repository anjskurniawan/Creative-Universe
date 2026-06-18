@php
    $currentSessionId = request()->session()->getId();
    
    $parseAgent = function($userAgent) {
        $os = 'Perangkat Tidak Dikenal';
        $browser = 'Browser';
        
        if (empty($userAgent)) {
            return "Sesi API / CLI";
        }

        // Detect OS
        if (preg_match('/windows|win32/i', $userAgent)) {
            $os = 'Windows';
        } elseif (preg_match('/macintosh|mac os x/i', $userAgent)) {
            $os = 'macOS';
        } elseif (preg_match('/android/i', $userAgent)) {
            $os = 'Android';
        } elseif (preg_match('/iphone|ipad|ipod/i', $userAgent)) {
            $os = 'iOS';
        } elseif (preg_match('/linux/i', $userAgent)) {
            $os = 'Linux';
        }
        
        // Detect Browser
        if (preg_match('/chrome|crios/i', $userAgent) && !preg_match('/edge|edg/i', $userAgent)) {
            $browser = 'Google Chrome';
        } elseif (preg_match('/safari/i', $userAgent) && !preg_match('/chrome|crios/i', $userAgent)) {
            $browser = 'Safari';
        } elseif (preg_match('/firefox|fxios/i', $userAgent)) {
            $browser = 'Mozilla Firefox';
        } elseif (preg_match('/edge|edg/i', $userAgent)) {
            $browser = 'Microsoft Edge';
        } elseif (preg_match('/opera|opr/i', $userAgent)) {
            $browser = 'Opera';
        }
        
        return "$browser ($os)";
    };
@endphp

<section>
    <header>
        <h2 class="text-lg font-semibold text-cu-ink">
            {{ __('Daftar Sesi & Perangkat Aktif') }}
        </h2>
        <p class="mt-1 text-sm text-cu-muted">
            {{ __('Pantau browser dan perangkat yang saat ini masuk ke akun Anda. Anda dapat mengeluarkan sesi dari jarak jauh.') }}
        </p>
    </header>

    @if(session('success'))
        <div class="mt-4">
            <x-app-alert type="success">
                {{ session('success') }}
            </x-app-alert>
        </div>
    @endif

    <div class="mt-6 space-y-4">
        @forelse($sessions as $session)
            @php
                $isCurrent = $session->id === $currentSessionId;
                $deviceInfo = $parseAgent($session->user_agent);
                $lastActive = \Carbon\Carbon::createFromTimestamp($session->last_activity);
            @endphp
            <div class="flex items-center justify-between p-4 rounded-xl border border-cu-line bg-cu-panel-soft transition hover:shadow-sm">
                <div class="flex items-start gap-3 min-w-0">
                    <div class="mt-1 flex items-center justify-center p-2 rounded-lg bg-cu-surface text-cu-muted shrink-0 border border-cu-line">
                        @if(preg_match('/android|iphone|ipad/i', $session->user_agent))
                            <x-material-icon class="cu-icon-smartphone" size="sm" />
                        @else
                            <x-material-icon class="cu-icon-laptop" size="sm" />
                        @endif
                    </div>
                    
                    <div class="min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-sm font-semibold text-cu-ink truncate">{{ $deviceInfo }}</span>
                            @if($isCurrent)
                                <span class="inline-flex items-center rounded-full bg-cu-success/15 px-2 py-0.5 text-xs font-semibold text-cu-success border border-cu-success/20">
                                    Sesi Ini
                                </span>
                            @endif
                        </div>
                        <p class="text-xs text-cu-muted mt-0.5">
                            IP: {{ $session->ip_address }} • Aktif {{ $lastActive->diffForHumans() }}
                        </p>
                    </div>
                </div>

                @if(!$isCurrent)
                    <form method="POST" action="{{ route('profile.session.revoke', $session->id) }}">
                        @csrf
                        @method('DELETE')
                        <button type="submit" onclick="return confirm('Apakah Anda yakin ingin mengeluarkan perangkat ini? Sesi login perangkat tersebut akan segera hangus.')"
                            class="rounded-lg border border-cu-line bg-cu-surface hover:bg-cu-danger-soft hover:text-cu-danger hover:border-cu-danger/25 px-3 py-1.5 text-xs font-semibold text-cu-ink transition">
                            Keluarkan
                        </button>
                    </form>
                @endif
            </div>
        @empty
            <div class="text-center py-6 text-sm text-cu-muted">
                Tidak ada sesi aktif terdaftar.
            </div>
        @endforelse
    </div>
</section>
