import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'ap1',
    forceTLS: true,
    authEndpoint: '/broadcasting/auth',
});

// Global Public Channel Listeners for Real-time UI synchronization
window.Echo.channel('user-updates')
    .listen('.user.updated', () => {
        if (window.Livewire?.dispatch) {
            window.Livewire.dispatch('user-status-updated');
        }
    });

window.Echo.channel('pricetag-updates')
    .listen('.pricetag.updated', (event) => {
        if (window.Livewire?.dispatch) {
            window.Livewire.dispatch('pricetag-batch-updated', event);
        }
    });

const notificationState = {
    channelName: null,
    isBound: false,
    retryTimer: null,
};

const getNotificationUserId = () => {
    return document
        .querySelector('meta[name="creative-universe-user-id"]')
        ?.getAttribute('content');
};

const dispatchNotificationRefresh = () => {
    if (window.Livewire?.dispatch) {
        window.Livewire.dispatch('notification-received');
        return;
    }

    window.creativeUniversePendingNotificationRefresh = true;
};

const flushPendingNotificationRefresh = () => {
    if (window.creativeUniversePendingNotificationRefresh && window.Livewire?.dispatch) {
        window.creativeUniversePendingNotificationRefresh = false;
        window.Livewire.dispatch('notification-received');
    }
};

const subscribeToNotificationChannel = () => {
    const userId = getNotificationUserId();

    if (!userId || !window.Echo) {
        if (notificationState.channelName && window.Echo) {
            window.Echo.leave(notificationState.channelName);
        }

        notificationState.channelName = null;
        notificationState.isBound = false;
        return false;
    }

    const channelName = `App.Models.Core.User.${userId}`;

    if (notificationState.isBound && notificationState.channelName === channelName) {
        return true;
    }

    if (notificationState.channelName && notificationState.channelName !== channelName) {
        window.Echo.leave(notificationState.channelName);
    }

    window.Echo.private(channelName)
        .notification(() => {
            dispatchNotificationRefresh();
        });

    notificationState.channelName = channelName;
    notificationState.isBound = true;

    return true;
};

const scheduleNotificationSubscription = (attempt = 1) => {
    window.clearTimeout(notificationState.retryTimer);

    notificationState.retryTimer = window.setTimeout(() => {
        const subscribed = subscribeToNotificationChannel();
        flushPendingNotificationRefresh();

        if (!subscribed && attempt < 10) {
            scheduleNotificationSubscription(attempt + 1);
        }
    }, attempt === 1 ? 0 : 250);
};

window.CreativeUniverseNotifications = {
    subscribe: subscribeToNotificationChannel,
    refresh: dispatchNotificationRefresh,
};

document.addEventListener('DOMContentLoaded', () => scheduleNotificationSubscription());
document.addEventListener('livewire:init', () => scheduleNotificationSubscription());
document.addEventListener('livewire:navigated', () => scheduleNotificationSubscription());

if (document.readyState !== 'loading') {
    scheduleNotificationSubscription();
}
