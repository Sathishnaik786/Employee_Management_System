import React from 'react';
import { cn } from '@/lib/utils';

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

interface TimelineItemProps {
  children: React.ReactNode;
  className?: string;
}

interface TimelineDotProps {
  children: React.ReactNode;
  status?: 'pending' | 'current' | 'completed' | 'rejected';
  className?: string;
}

interface TimelineContentProps {
  children: React.ReactNode;
  className?: string;
}

interface TimelineConnectorProps {
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ children, className }) => (
  <ol className={cn("relative border-s border-gray-200 dark:border-gray-700 ps-3.5", className)}>
    {children}
  </ol>
);

const TimelineItem: React.FC<TimelineItemProps> = ({ children, className }) => (
  <li className={cn("mb-6 ms-8", className)}>{children}</li>
);

const TimelineDot: React.FC<TimelineDotProps> = ({ children, status, className }) => {
  const statusClasses = {
    pending: 'bg-gray-300 dark:bg-gray-600',
    current: 'bg-blue-500 dark:bg-blue-500',
    completed: 'bg-green-500 dark:bg-green-500',
    rejected: 'bg-red-500 dark:bg-red-500',
  };

  return (
    <span className={cn(
      "absolute flex items-center justify-center w-7 h-7 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900",
      status ? statusClasses[status] : statusClasses.pending,
      className
    )}>
      {children}
    </span>
  );
};

const TimelineContent: React.FC<TimelineContentProps> = ({ children, className }) => (
  <div className={cn("pb-5", className)}>{children}</div>
);

const TimelineConnector: React.FC<TimelineConnectorProps> = ({ className }) => (
  <div className={cn("absolute w-0.5 h-full bg-gray-200 dark:bg-gray-700 -start-4 top-7", className)} />
);

export { Timeline, TimelineItem, TimelineDot, TimelineContent, TimelineConnector };