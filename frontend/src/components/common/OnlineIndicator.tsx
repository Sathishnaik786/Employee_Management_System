import React from 'react';
import { useOnlineStatus } from '@/contexts/OnlineStatusContext';

interface OnlineIndicatorProps {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  className?: string;
}

export function OnlineIndicator({ firstName, lastName, email, profileImage, className = '' }: OnlineIndicatorProps) {
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  const { isOnline } = useOnlineStatus();
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
          {profileImage ? (
            <img
              src={profileImage}
              alt="profile"
              className="w-full h-full object-cover"
              loading="eager"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-sm font-bold">{initials}</span>
            </div>
          )}
        </div>
        <div 
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
        ></div>
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-foreground">
          {firstName} {lastName}
        </p>
        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{email}</p>
      </div>
    </div>
  );
}