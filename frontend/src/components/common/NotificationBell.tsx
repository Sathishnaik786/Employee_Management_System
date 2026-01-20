import React, { useState, useEffect, useRef } from 'react';
import { Bell, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, hasPermission } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize IERS notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user?.id]);

  // Fetch IERS-specific notifications
  const fetchNotifications = async () => {
    if (!user) return;

    // IERS Mock Notifications based on role
    const mockNotifications: Notification[] = [];

    if (hasPermission('ems:notifications:admin-view') || hasPermission('ems:notifications:principal-view')) {
      mockNotifications.push(
        { id: '1', title: 'PhD Application Pending', message: 'New PhD application requires DRC scrutiny', timestamp: '2 min ago', read: false, link: '/app/iers/phd/applications', userId: user.id, type: 'info' },
        { id: '2', title: 'NAAC IIQA Due', message: 'IIQA submission deadline approaching', timestamp: '1 hour ago', read: false, link: '/app/iers/naac/iiqa', userId: user.id, type: 'warning' },
        { id: '3', title: 'Faculty Onboarded', message: 'Dr. Robert Oppenheimer added to Physics dept', timestamp: '3 hours ago', read: true, link: '/app/iers/faculty', userId: user.id, type: 'success' }
      );
    } else if (hasPermission('ems:notifications:faculty-view')) {
      mockNotifications.push(
        { id: '4', title: 'Scholar Allocated', message: 'New PhD scholar assigned for supervision', timestamp: '5 min ago', read: false, link: '/app/iers/phd/tracker', userId: user.id, type: 'info' },
        { id: '5', title: 'RAC Review Due', message: 'Quarterly RAC review pending for Alice Stark', timestamp: '2 hours ago', read: false, link: '/app/iers/phd/reviews', userId: user.id, type: 'warning' }
      );
    } else if (hasPermission('ems:notifications:student-view')) {
      mockNotifications.push(
        { id: '6', title: 'Application Status', message: 'Your PhD application is under DRC scrutiny', timestamp: '10 min ago', read: false, link: '/app/iers/phd/applications', userId: user.id, type: 'info' },
        { id: '7', title: 'Placement Drive', message: 'New campus recruitment drive posted', timestamp: '1 day ago', read: true, link: '/app/iers/placement', userId: user.id, type: 'success' }
      );
    } else if (hasPermission('ems:notifications:iqac-view')) {
      mockNotifications.push(
        { id: '8', title: 'SSR Data Pending', message: 'Department SSR metrics require validation', timestamp: '15 min ago', read: false, link: '/app/iers/naac/ssr', userId: user.id, type: 'warning' },
        { id: '9', title: 'DVV Clarification', message: 'External reviewer raised query on QNM data', timestamp: '30 min ago', read: false, link: '/app/iers/naac/dvv', userId: user.id, type: 'info' }
      );
    }

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
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
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
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
                  className={`p-3 border-b last:border-b-0 hover:bg-accent transition-colors ${!notification.read ? 'bg-accent/30' : ''
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