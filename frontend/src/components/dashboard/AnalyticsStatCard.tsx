import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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
    good: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400',
    warning: 'border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400',
    critical: 'border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-400'
  };

  const changeColors = {
    positive: 'text-emerald-600 dark:text-emerald-400',
    negative: 'text-rose-600 dark:text-rose-400',
    neutral: 'text-muted-foreground'
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="h-full"
    >
      <Card className={cn(
        'h-full border border-border/50 shadow-premium transition-all duration-300 hover:shadow-lg hover:border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden group',
        status && statusColors[status],
        className
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-xs font-bold tracking-wider uppercase text-muted-foreground/80 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold tracking-tight text-gradient-primary">{value}</div>
          {change && (
            <div className={cn(
              'inline-flex items-center mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-muted/50 transition-colors group-hover:bg-background',
              changeColors[changeType]
            )}>
              {change}
            </div>
          )}
        </CardContent>

        {/* Decorative corner glow */}
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
      </Card>
    </motion.div>
  );
}