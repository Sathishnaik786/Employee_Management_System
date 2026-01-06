import React, { useState, useEffect, useRef } from 'react';
import { Bell, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService, Notification as NotificationInterface } from '@/services/notificationService';
import { notificationsApi } from '@/services/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message';
}

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Initialize notification service and fetch notifications
  useEffect(() => {
    if (user) {
      // Connect to notification service
      const token = localStorage.getItem('token');
      if (token) {
        notificationService.connect(user.id, token);
        
        // Fetch initial notifications
        fetchNotifications();
      }
      
      // Subscribe to new notifications
      const handleNewNotification = (notification: NotificationInterface) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      };
      
      notificationService.subscribeToNotifications(handleNewNotification);
      
      return () => {
        notificationService.unsubscribeFromNotifications();
        notificationService.disconnect();
      };
    }
  }, [user?.id]); // Only re-run when user ID changes, not on every user object change
  
  // Fetch notifications for the user
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const response = await notificationsApi.getNotifications();
      // Map the API response to the Notification interface format
      const mappedNotifications = response.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        timestamp: new Date(notification.createdAt).toLocaleString(),
        read: notification.read,
        link: notification.link,
        userId: user.id,
        type: notification.type.toLowerCase() as 'info' | 'success' | 'warning' | 'error' | 'message'
      }));
      
      setNotifications(mappedNotifications);
      setUnreadCount(mappedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock data if API fails
      // In a real implementation, this would fetch from the backend
      // For now, we'll simulate with mock data based on role
      const mockNotifications: Notification[] = [];
      
      if (user.role === 'ADMIN') {
        mockNotifications.push(
          { id: '1', title: 'New User Created', message: 'John Doe has been added to the system', timestamp: '2 min ago', read: false, link: '/app/employees/1', userId: user.id, type: 'info' },
          { id: '2', title: 'System Update', message: 'New version available for deployment', timestamp: '1 hour ago', read: false, link: '/app/admin/system', userId: user.id, type: 'info' },
          { id: '3', title: 'Security Alert', message: 'Unusual login activity detected', timestamp: '3 hours ago', read: true, link: '/app/admin/security', userId: user.id, type: 'warning' }
        );
      } else if (user.role === 'MANAGER') {
        mockNotifications.push(
          { id: '4', title: 'Task Assigned', message: 'New project task assigned to your team', timestamp: '5 min ago', read: false, link: '/app/projects/1', userId: user.id, type: 'info' },
          { id: '5', title: 'Leave Request', message: 'Jane Smith has requested leave for next week', timestamp: '2 hours ago', read: false, link: '/app/leaves/1', userId: user.id, type: 'info' }
        );
      } else if (user.role === 'HR') {
        mockNotifications.push(
          { id: '6', title: 'Leave Request', message: 'New leave request pending approval', timestamp: '10 min ago', read: false, link: '/app/leaves/2', userId: user.id, type: 'info' },
          { id: '7', title: 'Onboarding', message: 'New employee waiting for onboarding', timestamp: '1 day ago', read: true, link: '/app/employees/3', userId: user.id, type: 'info' }
        );
      } else if (user.role === 'EMPLOYEE') {
        mockNotifications.push(
          { id: '8', title: 'Task Update', message: 'Your assigned task has been updated', timestamp: '15 min ago', read: false, link: '/app/projects/1', userId: user.id, type: 'info' },
          { id: '9', title: 'Leave Approved', message: 'Your leave request has been approved', timestamp: '30 min ago', read: false, link: '/app/leaves/3', userId: user.id, type: 'success' }
        );
      }
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  };

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Mark notification as read via API
    notificationsApi.markNotificationRead(id).catch(error => {
      console.error('Error marking notification as read:', error);
      // Revert the UI change if the API call fails
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: false } : notification
        )
      );
      setUnreadCount(prev => prev + 1);
    });
  };

  const markAllAsRead = () => {
    // Calculate the current unread count before marking as read
    const currentUnreadCount = notifications.filter(n => !n.read).length;
    
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
    
    // Mark all notifications as read via API
    notificationsApi.markAllNotificationsRead().catch(error => {
      console.error('Error marking all notifications as read:', error);
      // Revert the UI change if the API call fails
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: false }))
      );
      // Restore the original unread count
      setUnreadCount(currentUnreadCount);
    });
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-xs rounded-full flex items-center justify-center text-white">
            {unreadCount}
          </span>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b last:border-b-0 hover:bg-accent transition-colors ${
                    !notification.read ? 'bg-accent/30' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="ml-2 p-1 rounded-full hover:bg-muted"
                      >
                        <Mail className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  
                  {notification.link && (
                    <a 
                      href={notification.link}
                      className="flex items-center text-xs text-primary hover:underline mt-2"
                    >
                      View details <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}