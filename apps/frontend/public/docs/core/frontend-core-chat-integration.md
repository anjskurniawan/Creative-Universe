# Frontend Core Chat Integration

**Status:** ACTIVE  
**Phase:** F18 completed  
**Verified:** 2026-07-15

## Ringkasan

Core Chat kini memiliki boundary tunggal di `src/core/chat` untuk DTO, API, dan subscription realtime. Halaman Messages, Message Bell, dan panel chat task ODDS tidak lagi mendefinisikan kontrak chat sendiri-sendiri.

## Kontrak

- `chatApi.contacts()` — daftar kontak direct message.
- `chatApi.conversations()` — room aktif dan history.
- `chatApi.messages(id)` — riwayat pesan room.
- `chatApi.send(input)` — kirim ke `conversation_id` atau `receiver_id`.
- `subscribeToConversationMessages(ids, handler)` — subscription Pusher `.message.sent` terpusat.

ODDS hanya menemukan room task melalui endpoint domain `/odds/tasks/{task}/conversation`. Setelah room diketahui, message transport tetap dimiliki Core Chat.

## State dan URL

Halaman Messages memakai URL kanonis `/messages?conversation={id}` melalui helper route Core. Query URL dibaca dengan App Router search params dan dibungkus Suspense agar tetap kompatibel dengan static export.

Message Bell berlangganan ke seluruh conversation yang dimuat sehingga preview dan unread badge dapat berubah tanpa membuka dropdown atau melakukan reload.

## Lifecycle yang dipertahankan

- Room ODDS dibuka setelah brief diterima.
- Reassign mempertahankan room yang sama dan mengganti participant desainer.
- SPV/Manajer tetap read-only.
- Room selesai/cancel menjadi history dan tidak dapat menerima pesan baru.
- Event realtime tetap `.message.sent` melalui Pusher terpusat.
