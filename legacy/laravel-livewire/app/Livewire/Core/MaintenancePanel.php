<?php

namespace App\Livewire\Core;

use App\Notifications\Core\TestNotification;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Gate;
use Livewire\Component;

class MaintenancePanel extends Component
{
    public string $consoleOutput = '';
    public string $testMessage = 'Halo, ini adalah pesan tes dari panel Maintenance!';

    public function mount(): void
    {
        // Pastikan hanya user ber-permission 'run-artisan' yang dapat mengakses
        if (! Gate::allows('run-artisan')) {
            abort(403, 'Anda tidak memiliki hak akses ke panel ini.');
        }
    }

    /**
     * Menjalankan command Artisan yang ditentukan secara internal di server.
     */
    public function runCommand(string $command): void
    {
        if (! Gate::allows('run-artisan')) {
            abort(403);
        }

        try {
            $this->consoleOutput = "Running 'php artisan {$command}'...\n\n";

            switch ($command) {
                case 'migrate':
                    Artisan::call('migrate', ['--force' => true]);
                    break;
                case 'migrate:fresh':
                    Artisan::call('migrate:fresh', ['--force' => true]);
                    break;
                case 'optimize:clear':
                    Artisan::call('optimize:clear');
                    break;
                case 'storage:link':
                    Artisan::call('storage:link');
                    break;
                case 'queue:restart':
                    Artisan::call('queue:restart');
                    break;
                case 'db:seed-permissions':
                    Artisan::call('db:seed', ['--class' => 'RolePermissionSeeder', '--force' => true]);
                    break;
                case 'db:seed-all':
                    Artisan::call('db:seed', ['--force' => true]);
                    break;
                default:
                    $this->consoleOutput .= "Error: Command '{$command}' tidak didukung.";
                    return;
            }

            $this->consoleOutput .= Artisan::output();
            $this->consoleOutput .= "\nCommand executed successfully!";
            
            session()->flash('success_cmd', "Command '{$command}' berhasil dijalankan.");
        } catch (\Exception $e) {
            $this->consoleOutput .= "\nException Error:\n" . $e->getMessage();
            session()->flash('error_cmd', "Gagal menjalankan command: " . $e->getMessage());
        }
    }

    /**
     * Mengirimkan notifikasi tes ke user yang sedang login untuk channel tertentu.
     */
    public function sendTestNotification(string $type): void
    {
        if (! Gate::allows('run-artisan')) {
            abort(403);
        }

        $this->validate([
            'testMessage' => 'required|string|max:255',
        ]);

        try {
            $user = auth()->user();
            
            switch ($type) {
                case 'database':
                    $channels = ['database'];
                    $channelName = 'Database';
                    break;
                case 'broadcast':
                    $channels = ['database', 'broadcast'];
                    $channelName = 'Real-time Broadcast & Badge (Pusher)';
                    break;
                case 'whatsapp':
                    $channels = [\App\Notifications\Channels\FonnteChannel::class];
                    $channelName = 'WhatsApp (Fonnte)';
                    break;
                default:
                    $this->consoleOutput = "Error: Tipe channel '{$type}' tidak didukung.";
                    return;
            }

            $user->notify(new TestNotification($this->testMessage, $channels));

            $this->consoleOutput = "Mengirimkan TestNotification (Channel: {$channelName}) ke {$user->name}...\n";
            $this->consoleOutput .= "- Status: Berhasil dipicu.\n";
            
            if ($type === 'whatsapp') {
                if ($user->whatsapp_number) {
                    $this->consoleOutput .= "- Target WA: {$user->whatsapp_number} (Menggunakan Fonnte Service)\n";
                } else {
                    $this->consoleOutput .= "- PERINGATAN: Nomor WhatsApp Anda belum dikonfigurasi di profil Anda.\n";
                }
            }
            
            $this->consoleOutput .= "\nUji coba channel {$channelName} berhasil diproses!";
            session()->flash('success_cmd', "Uji coba {$channelName} berhasil dipicu.");
        } catch (\Exception $e) {
            $this->consoleOutput .= "\nException Error saat kirim notifikasi:\n" . $e->getMessage();
            session()->flash('error_cmd', "Gagal mengirim notifikasi: " . $e->getMessage());
        }
    }

    public function render()
    {
        return view('livewire.core.maintenance-panel')
            ->layout('layouts.app'); // Menggunakan layout utama
    }
}
