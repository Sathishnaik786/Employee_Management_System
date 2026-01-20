import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, ListChecks } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StatusItem {
    label: string;
    count: number;
    total: number;
    color: string;
}

interface StatusSummaryProps {
    title: string;
    items: StatusItem[];
    loading?: boolean;
}

export const StatusSummary: React.FC<StatusSummaryProps> = ({
    title,
    items = [],
    loading = false
}) => {
    return (
        <Card className="border-border/40 shadow-premium bg-card/60 backdrop-blur-md rounded-2xl h-full">
            <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <ListChecks size={18} />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest">{title}</CardTitle>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Status distribution metrics</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
                <div className="space-y-6">
                    {items.map((item, idx) => {
                        const percentage = (item.count / item.total) * 100;
                        return (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-muted-foreground">{item.label}</span>
                                    <span className="text-foreground">{item.count} / {item.total}</span>
                                </div>
                                <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden border border-border/5">
                                    <div
                                        className={cn("h-full transition-all duration-1000 ease-out", item.color)}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {items.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-30 italic">No metrics available</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
