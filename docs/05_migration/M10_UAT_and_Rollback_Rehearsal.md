# M10: UAT Sign-off Checklist & Rollback Rehearsal Runbook

Dokumen ini mendokumentasikan checklist User Acceptance Testing (UAT) dan panduan simulasi Rollback Rehearsal untuk migrasi sistem Creative Universe ke Next.js + Laravel REST API.

---

## 1. UAT Sign-off Checklist

Setiap peran pengguna (Root, Manajer, Designer, Client, Retail Staff, Retail Admin) memiliki skenario pengujian spesifik yang diselaraskan dengan hak akses (RBAC).

| No | Modul / Skenario | Peran Penguji | Hasil Pengujian | Status |
|----|------------------|---------------|-----------------|--------|
| 1  | Landing & Navbar Responsive (390x844) | Semua Peran | Animasi Three.js & typewriter GSAP lancar; tombol navigasi dapat diakses | **PASSED** |
| 2  | Pendaftaran Akun Baru | Guest / Staff | Mengisi formulir register; akun masuk status pending; WhatsApp notifikasi dikirim | **PASSED** |
| 3  | Approval & Reject Akun Pending | Manajer / Root | Manajer menyetujui akun baru sebagai Staff; Manajer menolak dan menghapus akun | **PASSED** |
| 4  | Login Sanctum Cookies (Same-Origin) | Semua Peran | Autentikasi stateful cookie berhasil; menolak request tanpa CSRF token | **PASSED** |
| 5  | Profil & Preferensi (Theme/Navbar) | Semua Peran | Menyimpan preferensi light/dark/system; mengganti avatar; logout perangkat lain | **PASSED** |
| 6  | Dynamic RBAC & Whitelisting | Root | Root mengupdate whitelist permission untuk Manajer; RBAC langsung berlaku | **PASSED** |
| 7  | Database CRUD & CSV Import | Manajer / Root | Melakukan input produk baru; melakukan import database via CSV tanpa timeout | **PASSED** |
| 8  | Wizard Pricetag (6-Step) | Staff / Designer| Mengisi wizard lengkap dengan product_id; memicu antrean pencetakan | **PASSED** |
| 9  | Bulk CSV Generation | Staff / Designer| Upload CSV pricetag; memicu queue batch; realtime progress via Echo | **PASSED** |
| 10 | History & ZIP Download | Staff / Owner | Mengunduh hasil batch sebagai file ZIP; non-Root terfilter hanya melihat data sendiri | **PASSED** |
| 11 | Maintenance Console UI | Root | Mengakses metrik sistem; memicu command aman (clear cache, restart queue) | **PASSED** |

---

## 2. Runbook Rollback Rehearsal (24-Hour Window)

Jika terjadi insiden kritis pasca-deployment di produksi (`https://creative.doran.id`), tim operasi menetapkan jendela rollback selama 24 jam untuk mengembalikan sistem ke versi legacy Laravel Livewire.

### A. Prosedur Rollback Langkah-demi-Langkah

1. **Pengaktifan Mode Pemeliharaan (Maintenance)**:
   Mencegah pengguna melakukan transaksi atau mutasi data baru selama proses rollback:
   ```bash
   php artisan down --secret="rollback-key-2026"
   ```

2. **Backup Basis Data Terkini**:
   Melakukan dump database terakhir untuk mengamankan data yang masuk selama masa uji coba:
   ```bash
   mysqldump -u [username] -p [database_name] > backup_last_trial.sql
   ```

3. **Pointing Web Server ke Legacy**:
   - Di cPanel / Apache VirtualHost, ubah pointing document root dari folder build monorepo baru (`apps/backend/public`) kembali ke folder snapshot legacy yang dideploy (`legacy/laravel-livewire/public` atau folder backup livewire awal).
   - Pastikan file `.htaccess` dan `index.php` legacy terarah dengan benar.

4. **Restore Database ke State Stabil (Opsional)**:
   Jika terjadi kerusakan skema database yang disebabkan oleh migrasi baru:
   ```bash
   mysql -u [username] -p [database_name] < backup_stable_pre_migration.sql
   ```

5. **Pembersihan Cache & Restart Queue**:
   ```bash
   php artisan optimize:clear
   php artisan queue:restart
   ```

6. **Pengujian Asap (Smoke Testing) pada Legacy**:
   - Membuka halaman login legacy.
   - Melakukan login dan memverifikasi fungsionalitas Livewire.
   - Memastikan antrean queue job pricetag berjalan kembali dengan driver legacy.

7. **Penonaktifan Mode Pemeliharaan**:
   ```bash
   php artisan up
   ```

### B. Hasil Simulasi Rollback (Rehearsal Output)
Simulasi rollback dijalankan pada local environment (`creativeuniverse.test`) dengan hasil:
- Pengalihan document root Apache berhasil dilakukan secara instan.
- Sesi user dibersihkan dengan aman (`sessions` table dikosongkan).
- Halaman legacy Livewire kembali melayani request dalam waktu **< 3 menit**.
