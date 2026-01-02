import React from 'react';
import { useOnlineStatus } from '@/contexts/OnlineStatusContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface OnlineIndicatorProps {
  firstName: string;
  lastName: string;
  email: string;
  className?: string;
}

export function OnlineIndicator({ firstName, lastName, email, className = '' }: OnlineIndicatorProps) {
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  const { isOnline } = useOnlineStatus();
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
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