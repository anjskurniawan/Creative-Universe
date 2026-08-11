# Core Public Contracts

## 1. Tujuan

Core menyediakan layanan lintas aplikasi tanpa memberikan akses langsung ke model internal suatu Sub-App. Sub-App tetap memiliki business rule-nya, sedangkan Core memiliki akun, authorization, chat, notification, file, asset link, dan activity log.

## 2. Response envelope

Semua endpoint JSON menggunakan bentuk berikut:

```json
{
  "success": true,
  "message": "Proses berhasil.",
  "data": {},
  "meta": {}
}
```

`meta` hanya disertakan jika diperlukan. Respons gagal menggunakan `success: false`, `message`, dan `errors` opsional. Respons file download dan stream bukan JSON sehingga tidak dibungkus envelope.

## 3. Ownership Core

| Kapabilitas | Model atau layanan utama | Aturan boundary |
|---|---|---|
| Account | `App\\Models\\Core\\User` | Identitas global untuk semua Sub-App |
| Chat | `Conversation`, `Message`, Core `ChatController` | Akses record melalui `ConversationPolicy` |
| Notification | Core `NotificationController` dan `NotificationResource` | Selalu dibatasi kepada notifikasi user terautentikasi |
| File storage | `StoredFile`, `FileStorageService` | File fisik memakai nama ULID dan metadata terpusat |
| External asset | `AssetLink` | Referensi eksternal polymorphic milik Core |
| Activity log | Core `LogAuthActivity` dan Spatie Activity Log | Setiap log membawa nama log/event dan context Sub-App |

## 4. Kontrak antarmodul

- `OddsTaskReader` mengembalikan `OddsTaskSummary`, bukan model `Task`.
- `OddsConversationPresenter` mengubah konteks ODDS menjadi payload chat tanpa mengekspos model ODDS kepada controller Core.
- Implementasi kontrak didaftarkan melalui service container pada `AppServiceProvider`.
- Sub-App tidak boleh melakukan query langsung ke tabel milik Sub-App lain.
- Integrasi baru harus menggunakan interface dan DTO immutable pada folder `Contracts` dan `Data` pemilik domain.

## 5. Authorization berbasis record

- `ConversationPolicy`: participant dapat membaca; pengiriman hanya untuk participant aktif yang diizinkan konteks.
- `StoredFilePolicy`: file public dapat dibaca; file private hanya uploader atau Root.
- `AssetLinkPolicy`: perubahan dan penghapusan hanya creator atau Root.
- Policy milik Sub-App tetap berada pada namespace Sub-App terkait, seperti `TaskPolicy` dan `AssessmentPolicy`.

## 6. Stabilitas kontrak

Perubahan URL, response envelope, DTO, atau interface publik harus diperbarui serentak pada backend, frontend consumer, test, dan Documentation. Compatibility alias hanya dibuat jika diputuskan secara eksplisit.
