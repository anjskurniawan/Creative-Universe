<?php

namespace App\Livewire\Core;

use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Collection;
use Livewire\Component;

/**
 * NotificationBell — Real-time notification panel
 *
 * Polling setiap 15 detik untuk cek notifikasi baru.
 * Open/close state dikelola oleh Alpine.js (bukan Livewire)
 * agar tidak terjadi re-render yang membuka panel otomatis.
 */
class NotificationBell extends Component
{
    public int $unreadCount = 0;

    public function mount(): void
    {
        $this->loadCount();
    }

    public function loadCount(): void
    {
        $this->unreadCount = auth()->user()->unreadNotifications()->count();
    }

    public function markAsRead(string $notificationId): void
    {
        $notification = auth()->user()->notifications()->find($notificationId);
        if ($notification) {
            $notification->markAsRead();
        }
        $this->loadCount();
    }

    public function markAllAsRead(): void
    {
        auth()->user()->unreadNotifications->markAsRead();
        $this->unreadCount = 0;
    }

    public function getNotificationsProperty(): Collection
    {
        return auth()->user()->notifications()->latest()->take(10)->get();
    }

    public function render()
    {
        return view('livewire.core.notification-bell');
    }
}
