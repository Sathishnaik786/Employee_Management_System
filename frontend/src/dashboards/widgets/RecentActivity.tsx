import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
    id: string;
    description: string;
    timestamp: string;
    type: 'SUBMISSION' | 'COMMENT' | 'SYSTEM' | 'STATUS_CHANGE';
    meta?: string;
}

interface RecentActivityProps {
    items: ActivityItem[];
    loading?: boolean;
}

const typeColorMap = {
    SUBMISSION: 'text-blue-500',
    COMMENT: 'text-amber-500',
    SYSTEM: 'text-slate-500',
    STATUS_CHANGE: 'text-emerald-500',
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
    items,
    loading = false
}) => {
    return (
        <Card className="border-border/40 shadow-premium bg-card/60 backdrop-blur-md rounded-2xl h-full">
            <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Activity size={18} />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Operational Log</CardTitle>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Recent activity in your scope</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-[7px] before:w-px before:bg-border/10 before:my-1">
                    {items.map((item, idx) => (
                        <div key={item.id} className="relative pl-7 group">
                            <Circle
                                size={8}
                                className={cn(
                                    "absolute left-1 top-1.5 fill-current z-10 transition-transform group-hover:scale-125",
                                    typeColorMap[item.type]
                                )}
                            />
                            <div>
                                <p className="text-xs font-bold leading-relaxed">{item.description}</p>
                                {item.meta && (
                                    <p className="text-[10px] text-primary/70 font-black uppercase tracking-wider mt-0.5">{item.meta}</p>
                                )}
                                <p className="text-[10px] text-muted-foreground mt-1 uppercase font-black tracking-widest opacity-60">{item.timestamp}</p>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-30 italic">Log stream empty</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
