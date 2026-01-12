import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  className
}: StatCardProps) {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className={cn(
        "stat-card relative overflow-hidden group p-6 rounded-2xl bg-card border border-border/50 shadow-premium transition-all duration-300",
        className
      )}
    >
      {/* Background Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground/80 tracking-wide uppercase">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-heading font-bold tracking-tight text-foreground tabular-nums">{value}</h3>
          </div>

          {change && (
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset transition-colors",
              isPositive && "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
              isNegative && "bg-rose-500/10 text-rose-600 ring-rose-500/20",
              !isPositive && !isNegative && "bg-slate-500/10 text-slate-600 ring-slate-500/20"
            )}>
              {isPositive && <TrendingUp size={12} />}
              {isNegative && <TrendingDown size={12} />}
              {!isPositive && !isNegative && <Minus size={12} />}
              {change}
            </div>
          )}
        </div>

        <div className={cn(
          "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-primary/20",
          "bg-gradient-to-br from-white to-primary/5 dark:from-white/5 dark:to-primary/10",
          "border border-primary/10",
          iconColor
        )}>
          <Icon className="h-7 w-7" />
        </div>
      </div>

      {/* Subtle progress bar at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-muted/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn(
            "h-full bg-primary/40",
            isPositive && "bg-emerald-500/40",
            isNegative && "bg-rose-500/40"
          )}
        />
      </div>
    </motion.div>
  );
}
