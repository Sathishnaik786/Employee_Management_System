/**
 * Hook for handling real-time data invalidation
 * Listens to socket events and invalidates TanStack Query cache
 */
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { notificationService } from '@/services/notificationService';

export const useQueryInvalidation = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const chatSocket = chatService.getSocket();
    const notificationSocket = notificationService.getSocket();
    const socket = chatSocket || notificationSocket;

    if (!socket) return;

    // Listen for data invalidation events from backend
    const handleDataInvalidation = (payload: { type: string; action?: string }) => {
      console.log('🔄 Invalidating cache for:', payload.type);
      
      // Invalidate queries based on entity type
      queryClient.invalidateQueries({ queryKey: [payload.type] });
      
      // Also invalidate list queries
      if (payload.type === 'employee') {
        queryClient.invalidateQueries({ queryKey: ['employees'] });
      } else if (payload.type === 'project') {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      } else if (payload.type === 'department') {
        queryClient.invalidateQueries({ queryKey: ['departments'] });
      } else if (payload.type === 'attendance') {
        queryClient.invalidateQueries({ queryKey: ['attendance'] });
      } else if (payload.type === 'leave') {
        queryClient.invalidateQueries({ queryKey: ['leaves'] });
      }
    };

    // Listen for specific update events
    const handleEmployeeUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee'] });
    };

    const handleProjectUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
    };

    const handleAttendanceUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    };

    const handleLeaveUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    };

    const handleDashboardStats = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    };

    // Register event listeners
    socket.on('data:invalidated', handleDataInvalidation);
    socket.on('employee:updated', handleEmployeeUpdate);
    socket.on('project:updated', handleProjectUpdate);
    socket.on('attendance:updated', handleAttendanceUpdate);
    socket.on('leave:updated', handleLeaveUpdate);
    socket.on('dashboard:stats', handleDashboardStats);

    // Cleanup
    return () => {
      socket.off('data:invalidated', handleDataInvalidation);
      socket.off('employee:updated', handleEmployeeUpdate);
      socket.off('project:updated', handleProjectUpdate);
      socket.off('attendance:updated', handleAttendanceUpdate);
      socket.off('leave:updated', handleLeaveUpdate);
      socket.off('dashboard:stats', handleDashboardStats);
    };
  }, [queryClient]);
};




