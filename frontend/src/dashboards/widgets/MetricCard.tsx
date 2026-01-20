import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/analytics/charts/Sparkline';
import { TrendData } from '@/analytics/types';

interface MetricCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
    sparkline?: TrendData[];
    color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
    loading?: boolean;
}

const colorMap = {
    primary: 'from-blue-500/10 to-transparent border-blue-500/20 text-blue-600',
    success: 'from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-600',
    warning: 'from-amber-500/10 to-transparent border-amber-500/20 text-amber-600',
    error: 'from-rose-500/10 to-transparent border-rose-500/20 text-rose-600',
    info: 'from-indigo-500/10 to-transparent border-indigo-500/20 text-indigo-600',
};

const chartColorMap = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#f43f5e',
    info: '#6366f1',
};

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    subValue,
    icon: Icon,
    trend,
    sparkline,
    color = 'primary',
    loading = false
}) => {
    return (
        <Card className={cn(
            "bg-gradient-to-br border shadow-sm group overflow-hidden relative",
            colorMap[color]
        )}>
            <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-white/50 dark:bg-black/20 shadow-sm group-hover:scale-110 transition-transform">
                        <Icon size={20} />
                    </div>
                    {sparkline && (
                        <div className="w-24 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Sparkline data={sparkline} color={chartColorMap[color]} height={30} />
                        </div>
                    )}
                </div>

                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">{title}</h4>
                <div className="mt-1 flex items-baseline gap-2">
                    <h3 className="text-2xl font-black">{loading ? '...' : value}</h3>
                    {subValue && <span className="text-xs font-bold text-muted-foreground">{subValue}</span>}
                </div>

                {trend && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                            trend.isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                        )}>
                            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{trend.label}</span>
                    </div>
                )}
            </CardContent>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-current opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.05] transition-opacity" />
        </Card>
    );
};
