{{-- SRD v6.2 Seksi 8.2 Step [3] — Halaman Pending Approval --}}
@section('title', 'Menunggu Persetujuan')

<x-app-layout>
    <div class="flex flex-col items-center justify-center py-16 px-4">

        <!-- Icon -->
        <div class="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mb-6">
            <svg class="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>

        <!-- Message -->
        <h1 class="text-2xl font-bold text-white mb-3">Akunmu Sedang Menunggu Persetujuan</h1>
        <p class="text-gray-400 text-center max-w-md mb-2">
            Terima kasih telah mendaftar di Creative Universe. Admin akan meninjau akunmu
            dan memberikan persetujuan dalam waktu dekat.
        </p>
        <p class="text-gray-500 text-sm text-center max-w-md mb-8">
            Kamu akan menerima notifikasi melalui WhatsApp atau email saat akunmu telah disetujui.
            Saat ini kamu belum bisa mengakses fitur apapun.
        </p>

        <!-- User Info -->
        <div class="bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 w-full max-w-sm mb-6">
            <div class="text-sm text-gray-400 mb-1">Terdaftar sebagai</div>
            <div class="text-white font-semibold">{{ auth()->user()->name }}</div>
            <div class="text-gray-400 text-sm">{{ auth()->user()->email }}</div>
            @if(auth()->user()->registration_note)
                <div class="mt-3 pt-3 border-t border-gray-700/50">
                    <div class="text-sm text-gray-400 mb-1">Catatan registrasi</div>
                    <div class="text-gray-300 text-sm">{{ auth()->user()->registration_note }}</div>
                </div>
            @endif
        </div>

        <!-- Logout Button -->
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit"
                class="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">
                Keluar dari akun
            </button>
        </form>

    </div>
</x-app-layout>
