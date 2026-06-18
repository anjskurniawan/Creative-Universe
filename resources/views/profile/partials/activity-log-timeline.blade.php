<section>
    <header>
        <h2 class="text-lg font-semibold text-cu-ink">
            {{ __('Riwayat Aktivitas Keamanan') }}
        </h2>
        <p class="mt-1 text-sm text-cu-muted">
            {{ __('Jejak audit dari 10 aktivitas login dan pembaruan terakhir pada akun Anda.') }}
        </p>
    </header>

    <div class="mt-6 relative">
        @forelse($activities as $activity)
            <div class="relative pl-8 pb-6 last:pb-0">
                <!-- Vertical Line connector -->
                @if(!$loop->last)
                    <span class="absolute left-[11px] top-4 -bottom-2 w-0.5 bg-cu-line" aria-hidden="true"></span>
                @endif
                
                <!-- Circle Node Icon -->
                @php
                    $nodeColorClass = match ($activity->event) {
                        'created' => 'bg-cu-success text-white border-cu-success',
                        'deleted' => 'bg-cu-danger text-white border-cu-danger',
                        'login' => 'bg-cu-info text-white border-cu-info',
                        default => 'bg-cu-ink text-cu-surface border-cu-line',
                    };
                @endphp
                <span class="absolute left-0 top-1.5 size-6 rounded-full border flex items-center justify-center shrink-0 {{ $nodeColorClass }}">
                    @if($activity->event === 'login')
                        <x-material-icon class="cu-icon-login" size="xs" />
                    @elseif($activity->event === 'created')
                        <x-material-icon class="cu-icon-add" size="xs" />
                    @elseif($activity->event === 'deleted')
                        <x-material-icon class="cu-icon-delete" size="xs" />
                    @else
                        <x-material-icon class="cu-icon-edit" size="xs" />
                    @endif
                </span>

                <div class="min-w-0">
                    <p class="text-sm font-medium text-cu-ink">
                        @php
                            $actionName = match ($activity->event) {
                                'created' => 'Membuat data',
                                'updated' => 'Memperbarui data',
                                'deleted' => 'Menghapus data',
                                'login' => 'Melakukan login',
                                default => ucfirst($activity->description),
                            };
                            
                            $logLabel = match ($activity->log_name) {
                                'core-user' => 'Profil Pengguna',
                                'auth' => 'Otorisasi',
                                'pricetag' => 'Pricetag Generator',
                                default => ucfirst($activity->log_name),
                            };
                        @endphp
                        {{ $actionName }} pada <strong class="text-xs font-semibold uppercase tracking-wider text-cu-muted">{{ $logLabel }}</strong>
                    </p>
                    <p class="text-xs text-cu-muted mt-0.5">
                        {{ $activity->created_at->diffForHumans() }} 
                        @if(!empty($activity->properties['ip']))
                            • IP: {{ $activity->properties['ip'] }}
                        @elseif(request()->ip())
                            • IP: {{ request()->ip() }}
                        @endif
                    </p>
                </div>
            </div>
        @empty
            <div class="text-center py-6 text-sm text-cu-muted">
                Belum ada catatan riwayat aktivitas terdaftar.
            </div>
        @endforelse
    </div>
</section>
