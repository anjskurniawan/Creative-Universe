<?php

namespace App\Livewire\Core;

use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use Livewire\Attributes\On;
use Livewire\Component;

/**
 * NotificationBell - real-time notification panel.
 *
 * Open/close state dikelola oleh Alpine.js agar tidak terjadi re-render
 * yang membuka panel otomatis.
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

    #[On('notification-received')]
    public function refreshBell(): void
    {
        $this->loadCount();
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
        auth()->user()->unreadNotifications()->update(['read_at' => now()]);
        $this->unreadCount = 0;
    }

    public function getNotificationsProperty(): Collection
    {
        return auth()->user()->notifications()->latest()->take(10)->get();
    }

    public function render(): View
    {
        return view('livewire.core.notification-bell');
    }
}
