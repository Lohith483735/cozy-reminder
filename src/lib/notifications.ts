import { LocalNotifications } from '@capacitor/local-notifications';

export interface NotificationSchedule {
  id: number;
  title: string;
  body: string;
  scheduleAt: Date;
}

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async checkPermissions(): Promise<boolean> {
    try {
      const result = await LocalNotifications.checkPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  static async scheduleNotification(notification: NotificationSchedule): Promise<void> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          console.warn('Notification permissions not granted');
          return;
        }
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: notification.id,
            title: notification.title,
            body: notification.body,
            schedule: {
              at: notification.scheduleAt,
            },
            sound: 'default',
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#A855F7',
          },
        ],
      });

      console.log('Notification scheduled successfully:', notification.id);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  static async cancelNotification(id: number): Promise<void> {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id }],
      });
      console.log('Notification cancelled:', id);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  static generateNotificationId(reminderId: string): number {
    // Convert UUID to a numeric ID for notifications
    let hash = 0;
    for (let i = 0; i < reminderId.length; i++) {
      const char = reminderId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
