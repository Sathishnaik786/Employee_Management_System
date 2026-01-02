import { io, Socket } from 'socket.io-client';
import { User } from '@/types';

// Define types for chat functionality
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  conversationId: string;
}

export interface Conversation {
  id: string;
  participants: string[]; // Array of user IDs
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

class ChatService {
  private socket: Socket | null = null;
  private static instance: ChatService;
  
  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
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
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(receiverId: string, message: string) {
    if (this.socket) {
      this.socket.emit('chat:send', {
        receiverId,
        message
      });
    }
  }

  joinConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('joinConversation', conversationId);
    }
  }

  leaveConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('leaveConversation', conversationId);
    }
  }

  subscribeToConversation(conversationId: string, callback: (message: ChatMessage) => void) {
    if (this.socket) {
      this.socket.on(`message:${conversationId}`, callback);
    }
  }

  unsubscribeFromConversation(conversationId: string) {
    if (this.socket) {
      this.socket.off(`message:${conversationId}`);
    }
  }

  subscribeToNewMessage(callback: (message: ChatMessage) => void) {
    if (this.socket) {
      this.socket.on('chat:receive', callback);
    }
  }

  unsubscribeFromNewMessage() {
    if (this.socket) {
      this.socket.off('chat:receive');
    }
  }

  subscribeToTyping(conversationId: string, callback: (userId: string, isTyping: boolean) => void) {
    if (this.socket) {
      this.socket.on(`typing:${conversationId}`, callback);
    }
  }

  sendTypingStatus(conversationId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', { conversationId, isTyping });
    }
  }

  markMessageAsRead(messageId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('markAsRead', { messageId, userId });
    }
  }
}

export const chatService = ChatService.getInstance();