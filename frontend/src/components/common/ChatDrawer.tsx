import React, { forwardRef, useImperativeHandle } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: {
    id: string;
    name: string;
    role: string;
  };
}

export const ChatDrawer = forwardRef<any, ChatDrawerProps>(({ isOpen, onClose }: ChatDrawerProps, ref) => {
  const { user } = useAuth();

  // Expose openChatWithUser method to parent components
  useImperativeHandle(ref, () => ({
    openChatWithUser: (targetUser: any) => {
      console.log('Chat feature coming soon for IERS', targetUser);
    }
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">IERS Communication</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Institutional Messaging</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              The IERS communication module is currently under development.
              Academic collaboration features will be available soon.
            </p>
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                For urgent matters, please contact the Registrar's office.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatDrawer.displayName = 'ChatDrawer';

export default ChatDrawer;