import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { TrendData } from '@/analytics/types';

interface TrendPanelProps {
    title: string;
    description?: string;
    data: TrendData[];
    color?: string;
    height?: number;
}

export const TrendPanel: React.FC<TrendPanelProps> = ({
    title,
    description,
    data,
    color = '#3b82f6',
    height = 300
}) => {
    return (
        <Card className="border-border/40 shadow-premium bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden h-full">
            <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest">{title}</CardTitle>
                        {description && (
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{description}</p>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
                <div style={{ width: '100%', height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis
                                dataKey="timestamp"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 'bold' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 'bold' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
