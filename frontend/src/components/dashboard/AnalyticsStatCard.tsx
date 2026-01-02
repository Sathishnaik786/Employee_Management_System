import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  status?: 'good' | 'warning' | 'critical';
  className?: string;
}

export function AnalyticsStatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  status,
  className
}: AnalyticsStatCardProps) {
  const statusColors = {
    good: 'border-green-200 bg-green-50 text-green-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    critical: 'border-red-200 bg-red-50 text-red-800'
  };

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-muted-foreground'
  };

  return (
    <Card className={cn(
      'h-full',
      status && statusColors[status],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn('text-xs mt-1', changeColors[changeType])}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}