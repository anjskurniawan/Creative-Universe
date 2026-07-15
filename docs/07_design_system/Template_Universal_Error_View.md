# Universal Error View

**Owner:** Core  
**Atomic level:** Template  
**Status:** Review

Template tunggal untuk pengalaman error universal Creative Universe.

## Lokasi

`apps/frontend/src/design-system/templates/feedback/universal-error-view.tsx`

## Cakupan route

- `app/error.tsx` untuk runtime error pada route.
- `app/global-error.tsx` untuk error pada root layout.
- `app/not-found.tsx` untuk halaman 404.

## Public contract

- `onRetry?`: menampilkan tindakan **Coba lagi**.
- `embedded?`: membatasi tinggi template untuk visualisasi dokumentasi.
- `showHomeAction?`: mengatur ketersediaan tombol kembali; dimatikan ketika maintenance darurat aktif agar pengguna tidak masuk ke redirect loop.

## Dokumentasi webpage

`/docs?section=components/universal-error-view`
