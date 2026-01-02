import { io, Socket } from 'socket.io-client';
import { User } from '@/types';

// Define types for notification functionality
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message';
}

class NotificationService {
  private socket: Socket | null = null;
  private static instance: NotificationService;
  
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  connect(userId: string, token: string) {
    if (this.socket?.connected) return;
    
    this.socket = io('http://localhost:3003', {
      auth: {
        token
      },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Connected to notification server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToNotifications(callback: (notification: Notification) => void) {
    if (this.socket) {
      this.socket.on('notification:new', callback);
    }
  }

  unsubscribeFromNotifications() {
    if (this.socket) {
      this.socket.off('notification:new');
    }
  }

  markAsRead(notificationId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('markNotificationAsRead', { notificationId, userId });
    }
  }

  markAllAsRead(userId: string) {
    if (this.socket) {
      this.socket.emit('markAllNotificationsAsRead', { userId });
    }
  }

  getUnreadCount(userId: string): Promise<number> {
    return new Promise((resolve) => {
      if (this.socket) {
        this.socket.emit('getUnreadCount', { userId }, (response: { count: number }) => {
          resolve(response.count);
        });
      } else {
        resolve(0);
      }
    });
  }
}

export const notificationService = NotificationService.getInstance();