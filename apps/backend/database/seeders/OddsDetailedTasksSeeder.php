<?php

namespace Database\Seeders;

use App\Models\Core\User;
use App\Models\Core\StoredFile;
use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Models\DesignerProfile;
use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Models\TaskBrief;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OddsDetailedTasksSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::where('name', 'System Admin')->first();

        if (! $client) {
            $this->command?->error('User System Admin tidak ditemukan. Jalankan seeder user terlebih dahulu.');
            return;
        }

        $designer = DesignerProfile::query()
            ->where('is_active', true)
            ->whereHas('user')
            ->with('user')
            ->first()?->user;

        if (! $designer) {
            $this->command?->error('Belum ada designer aktif untuk task ODDS.');
            return;
        }

        $layoutCategory = Category::where('name', 'Layout Popup Store Gramedia')->first()
            ?? Category::where('name', 'Keperluan Retail JETE')->first();
        $productCategory = Category::where('name', 'Deskripsi Produk Barang Baru')->first()
            ?? Category::where('name', 'Deskripsi Produk JETE')->first();

        if (! $layoutCategory || ! $productCategory) {
            $this->command?->error('Kategori layout atau deskripsi produk belum tersedia. Jalankan OddsCategorySeeder terlebih dahulu.');
            return;
        }

        $prefix = 'ODDS-DETAILED-';
        Task::withTrashed()->where('task_number', 'like', $prefix.'%')->each(function (Task $task): void {
            $task->forceDelete();
        });
        StoredFile::withTrashed()
            ->where('application_key', 'odds')
            ->where('context_type', 'task')
            ->where('category', 'brief_reference')
            ->forceDelete();

        $briefTemplates = [
            [
                'type' => 'layout',
                'purpose' => 'Layout Default Popup Store JETE - Gramedia Central Park',
                'brief' => <<<'HTML'
<h2>Brief Layout Default</h2>
<p>Buat layout default untuk area popup store JETE di Gramedia Central Park. Layout harus terlihat rapi, modern, mudah dibaca dari jarak 3 meter, dan tetap mengikuti karakter visual JETE.</p>
<figure><img src="{{IMAGE}}" alt="Referensi layout display retail"><figcaption>Referensi suasana display retail dan penataan area produk.</figcaption></figure>
<h3>Tujuan</h3><ul><li>Menampilkan identitas JETE secara konsisten.</li><li>Mengarahkan pengunjung ke area produk dan kasir.</li><li>Menyediakan ruang komunikasi promo tanpa membuat layout terasa penuh.</li></ul>
<h3>Konten wajib</h3><ul><li>Logo JETE versi horizontal.</li><li>Headline: “Temukan Perlengkapan Harianmu”.</li><li>CTA: “Scan untuk lihat koleksi lengkap”.</li><li>Area QR code, placeholder boleh digunakan.</li><li>Ruang kosong untuk harga dan label promo.</li></ul>
<h3>Arah visual</h3><ul><li>Gunakan warna utama brand JETE dan latar terang.</li><li>Gunakan grid yang konsisten serta margin aman untuk produksi.</li><li>Hindari ornamen kecil yang tidak terbaca saat dicetak.</li></ul>
<h3>Output</h3><ul><li>File kerja editable.</li><li>Preview JPG/PNG.</li><li>PDF siap cetak dengan bleed 3 mm.</li></ul>
HTML,
                'reference' => 'Brand guideline JETE terbaru, foto area popup store, dan logo JETE versi vector.',
            ],
            [
                'type' => 'layout',
                'purpose' => 'Layout Default Display Rak Aksesoris JETE',
                'brief' => <<<'HTML'
<h2>Brief Layout Display Default</h2>
<p>Susun layout default untuk display rak aksesoris JETE pada toko retail. Desain harus modular sehingga dapat diterapkan pada rak dengan lebar berbeda.</p>
<figure><img src="{{IMAGE}}" alt="Referensi rak aksesoris retail"><figcaption>Referensi rak aksesoris dengan pengelompokan produk yang rapi.</figcaption></figure>
<h3>Kebutuhan utama</h3><ol><li>Header brand di bagian atas.</li><li>Label kategori produk yang jelas.</li><li>Slot maksimal 12 SKU.</li><li>Area harga normal dan harga promo.</li><li>Callout kecil untuk produk unggulan.</li></ol>
<h3>Ketentuan teknis</h3><ul><li>Rasio master 4:3 dan adaptasi 1:1.</li><li>Gunakan ukuran teks minimum 14 pt untuk materi cetak.</li><li>Berikan safe area minimal 10 mm.</li><li>Gunakan placeholder foto produk yang proporsional.</li></ul>
<h3>Output yang diminta</h3><p>Editable source, dua alternatif komposisi, preview final, dan catatan ukuran setiap elemen.</p>
HTML,
                'reference' => 'Foto rak retail, daftar ukuran rak, logo JETE, dan contoh label harga.',
            ],
            [
                'type' => 'product',
                'purpose' => 'Deskripsi Produk Baru - JETE Powerbank 10000 mAh',
                'brief' => <<<'HTML'
<h2>Brief Deskripsi Produk</h2>
<p>Tulis dan tata konten deskripsi produk untuk JETE Powerbank 10000 mAh agar siap digunakan di marketplace dan materi katalog.</p>
<figure><img src="{{IMAGE}}" alt="Referensi produk powerbank"><figcaption>Referensi visual produk powerbank untuk penyusunan deskripsi dan katalog.</figcaption></figure>
<h3>Data produk</h3><table><thead><tr><th>Field</th><th>Isi</th></tr></thead><tbody><tr><td>Nama</td><td>JETE Powerbank 10000 mAh</td></tr><tr><td>Kapasitas</td><td>10.000 mAh</td></tr><tr><td>Fitur</td><td>Dual output, indikator LED, perlindungan arus lebih</td></tr><tr><td>Target</td><td>Pelajar, pekerja, dan pengguna dengan mobilitas tinggi</td></tr><tr><td>Warna</td><td>Black dan White</td></tr></tbody></table>
<h3>Pesan utama</h3><ul><li>Ringkas dan mudah dibawa.</li><li>Dapat mengisi daya dua perangkat secara bersamaan.</li><li>Bahasa harus informatif, tidak berlebihan, dan tidak membuat klaim medis/keamanan yang tidak tersedia datanya.</li></ul>
<h3>Output</h3><p>Judul marketplace maksimal 70 karakter, deskripsi panjang, lima bullet benefit, dan versi singkat maksimal 160 karakter.</p>
HTML,
                'reference' => 'Spec sheet produk, foto produk front/back, dan panduan tone of voice marketplace.',
            ],
            [
                'type' => 'product',
                'purpose' => 'Deskripsi Produk Barang Baru - JETE Charger GaN 65W',
                'brief' => <<<'HTML'
<h2>Brief Deskripsi Produk Baru</h2>
<p>Buat paket copywriting untuk produk baru JETE Charger GaN 65W. Copy akan dipakai oleh tim marketplace, katalog, dan sales.</p>
<figure><img src="{{IMAGE}}" alt="Referensi charger dan perangkat elektronik"><figcaption>Referensi visual charger dan perangkat elektronik untuk materi produk.</figcaption></figure>
<h3>Informasi produk</h3><table><thead><tr><th>Informasi</th><th>Detail</th></tr></thead><tbody><tr><td>Produk</td><td>JETE Charger GaN 65W</td></tr><tr><td>Port</td><td>USB-C PD dan USB-A</td></tr><tr><td>Kegunaan</td><td>Smartphone, tablet, dan perangkat kerja kompatibel</td></tr><tr><td>Keunggulan</td><td>Ukuran ringkas, pengisian cepat, dan efisiensi GaN</td></tr><tr><td>Audience</td><td>Komuter, traveler, dan pekerja hybrid</td></tr></tbody></table>
<h3>Struktur copy</h3><ol><li>Headline benefit-oriented.</li><li>Paragraf pembuka yang menjelaskan masalah pengguna.</li><li>Lima poin fitur dan manfaat.</li><li>Spesifikasi teknis yang mudah dipindai.</li><li>CTA pembelian yang tidak agresif.</li></ol>
<h3>Batasan</h3><p>Jangan menyebut “paling cepat” atau klaim kompatibilitas universal sebelum ada data pendukung. Gunakan istilah teknis secara konsisten.</p>
HTML,
                'reference' => 'Datasheet charger, daftar perangkat uji kompatibilitas, foto produk, dan logo JETE.',
            ],
        ];

        $statuses = [
            'submitted',
            'brief_revision_requested',
            'queued',
            'in_progress',
            'spv_review',
            'leader_revision_requested',
            'client_review',
            'done',
        ];
        $tasks = [];
        $sourceFiles = StoredFile::query()
            ->where('application_key', 'odds')
            ->where('context_type', 'task_draft')
            ->where('path', 'like', 'odds/task-draft/%/attachments/%')
            ->orderBy('id')
            ->get();

        if ($sourceFiles->isEmpty()) {
            $this->command?->error('Tidak ada gambar ODDS di storage untuk dijadikan referensi seeder.');
            return;
        }

        foreach ($statuses as $statusIndex => $status) {
            for ($statusItem = 0; $statusItem < 3; $statusItem++) {
                $definition = $briefTemplates[($statusIndex * 3 + $statusItem) % count($briefTemplates)];
                $definition['purpose'] .= ' - '.str_replace('_', ' ', ucfirst($status)).' #'.($statusItem + 1);
                $definition['status'] = $status;
                $definition['timer_minutes'] = $status === 'in_progress'
                    ? [35, 95, 210][$statusItem]
                    : null;
                $tasks[] = $definition;
            }
        }

        foreach ($tasks as $index => $definition) {
            $category = $definition['type'] === 'layout' ? $layoutCategory : $productCategory;
            $brief = $definition['brief'];
            $createdAt = $definition['timer_minutes'] !== null
                ? Carbon::now()->subMinutes($definition['timer_minutes'])
                : Carbon::now()->subDays(count($tasks) - $index);
            $deadline = $definition['timer_minutes'] !== null
                ? Carbon::now()->addHours(2)
                : $createdAt->copy()->addMinutes($category->sla_minutes ?? 180);
            $matrix = $category->important_matrix ?? 'Q2';

            $task = Task::create([
                'task_number' => $prefix.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                'request_type' => 'design',
                'category_id' => $category->id,
                'category_snapshot' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'score_weight' => $category->score_weight,
                    'normal_revision_limit' => $category->normal_revision_limit,
                    'sla_minutes' => $category->sla_minutes,
                    'important_matrix' => $matrix,
                    'brief_format' => $definition['type'] === 'product' ? 'table' : 'default',
                ],
                'requester_id' => $client->id,
                'assigned_designer_id' => $designer->id,
                'design_purpose' => $definition['purpose'],
                'brief_text' => $brief,
                'reference_visual' => $definition['reference'],
                'deadline' => $deadline,
                'important_matrix' => $matrix,
                'attachment_notes' => 'Gunakan asset referensi yang tersedia. Bila asset belum ada, gunakan placeholder dan tuliskan kebutuhan finalnya.',
                'status' => $definition['status'],
                'task_type' => 'new_task',
                'priority_score' => $definition['type'] === 'product' ? 2.5 : 2.0,
                'started_at' => $definition['status'] === 'in_progress' ? $createdAt : null,
                'created_by' => $client->id,
                'updated_by' => $client->id,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            $sourceFile = $sourceFiles[$index % $sourceFiles->count()];
            $storedName = Str::ulid().'.'.$sourceFile->extension;
            $targetPath = 'odds/task/'.$task->id.'/attachments/'.$storedName;
            Storage::disk($sourceFile->disk)->copy($sourceFile->path, $targetPath);
            $attachment = StoredFile::create([
                'application_key' => 'odds',
                'context_type' => 'task',
                'context_id' => $task->id,
                'category' => 'brief_reference',
                'disk' => $sourceFile->disk,
                'visibility' => $sourceFile->visibility,
                'original_name' => $sourceFile->original_name,
                'stored_name' => $storedName,
                'path' => $targetPath,
                'mime_type' => $sourceFile->mime_type,
                'extension' => $sourceFile->extension,
                'size' => $sourceFile->size,
                'checksum_sha256' => $sourceFile->checksum_sha256,
                'uploaded_by' => $client->id,
            ]);
            $brief = str_replace('{{IMAGE}}', '/api/v1/odds/uploads/'.$attachment->id.'/content', $brief);
            $task->update(['brief_text' => $brief]);

            if ($definition['status'] === 'done') {
                $task->update([
                    'done_at' => $createdAt,
                    'finished_at' => $createdAt,
                    'approved_at' => $createdAt,
                ]);
            }

            TaskBrief::create([
                'task_id' => $task->id,
                'content' => $brief,
                'reference_visual' => $definition['reference'],
                'attachments' => [[
                    'id' => $attachment->id,
                    'name' => $attachment->original_name,
                    'url' => '/api/v1/odds/uploads/'.$attachment->id.'/content',
                ]],
                'ai_summary' => $definition['type'] === 'product'
                    ? 'Brief deskripsi produk lengkap dengan data produk, struktur copy, dan batasan klaim.'
                    : 'Brief layout default lengkap dengan tujuan, konten wajib, arah visual, dan output produksi.',
                'updated_by' => $client->id,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        }

        $this->command?->info('Seeded '.count($tasks).' detailed ODDS tasks for System Admin (3 per workflow status).');
    }
}
