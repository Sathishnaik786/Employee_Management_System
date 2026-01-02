import React from 'react';
import { cn } from '@/lib/utils';

interface ProjectStatusBadgeProps {
  status: string;
  className?: string;
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ 
  status, 
  className 
}) => {
  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CREATED':
        return {
          label: 'Created',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      case 'ASSIGNED':
        return {
          label: 'Assigned',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'ON_HOLD':
        return {
          label: 'On Hold',
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'ARCHIVED':
        return {
          label: 'Archived',
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default ProjectStatusBadge;