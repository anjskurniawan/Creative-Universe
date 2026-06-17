{{-- SRD v6.2 Seksi 8.2 Step [3] - Halaman Pending Approval --}}
@section('title', 'Menunggu Persetujuan')

<x-app-layout>
    <div class="flex flex-col items-center justify-center px-4 py-16">
        <div class="mb-6 flex size-20 items-center justify-center rounded-full border border-cu-warning/20 bg-cu-warning-soft text-cu-warning">
            <x-material-icon name="pending_actions" size="xl" />
        </div>

        <h1 class="mb-3 text-center text-2xl font-semibold text-cu-ink">Akunmu Sedang Menunggu Persetujuan</h1>
        <p class="mb-2 max-w-md text-center text-cu-muted">
            Terima kasih telah mendaftar di Creative Universe. Admin akan meninjau akunmu
            dan memberikan persetujuan dalam waktu dekat.
        </p>
        <p class="mb-8 max-w-md text-center text-sm text-cu-muted">
            Kamu akan menerima notifikasi melalui WhatsApp atau email saat akunmu telah disetujui.
            Saat ini kamu belum bisa mengakses fitur apapun.
        </p>

        <x-app-panel class="mb-6 w-full max-w-sm">
            <div class="mb-1 text-sm text-cu-muted">Terdaftar sebagai</div>
            <div class="font-semibold text-cu-ink">{{ auth()->user()->name }}</div>
            <div class="text-sm text-cu-muted">{{ auth()->user()->email }}</div>

            @if(auth()->user()->registration_note)
                <div class="mt-3 border-t border-cu-line pt-3">
                    <div class="mb-1 text-sm text-cu-muted">Catatan registrasi</div>
                    <div class="text-sm text-cu-ink">{{ auth()->user()->registration_note }}</div>
                </div>
            @endif
        </x-app-panel>

        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit"
                class="inline-flex items-center gap-2 text-sm font-medium text-cu-muted transition-colors duration-200 hover:text-cu-ink">
                <x-material-icon name="logout" />
                Keluar dari akun
            </button>
        </form>
    </div>
</x-app-layout>
