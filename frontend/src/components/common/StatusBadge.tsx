import { cn } from '@/lib/utils';
import { 
  AttendanceStatus, 
  EmployeeStatus, 
  LeaveStatus 
} from '@/types';

interface StatusBadgeProps {
  status: AttendanceStatus | EmployeeStatus | LeaveStatus | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Attendance statuses
  PRESENT: { label: 'Present', className: 'status-success' },
  ABSENT: { label: 'Absent', className: 'status-destructive' },
  HALF_DAY: { label: 'Half Day', className: 'status-warning' },
  LATE: { label: 'Late', className: 'status-warning' },
  ON_LEAVE: { label: 'On Leave', className: 'status-info' },
  
  // Employee statuses
  ACTIVE: { label: 'Active', className: 'status-success' },
  INACTIVE: { label: 'Inactive', className: 'status-muted' },
  TERMINATED: { label: 'Terminated', className: 'status-destructive' },
  
  // Leave statuses
  PENDING: { label: 'Pending', className: 'status-warning' },
  APPROVED: { label: 'Approved', className: 'status-success' },
  REJECTED: { label: 'Rejected', className: 'status-destructive' },
  CANCELLED: { label: 'Cancelled', className: 'status-muted' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'status-muted' };
  
  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
