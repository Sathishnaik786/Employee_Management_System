import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';

interface TrendChartProps {
    recentUpdates: any[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ recentUpdates }) => {
    // Simple trend mapping - counting updates per day for the last 10 updates (just as proxy for actual trend)
    const sorted = [...recentUpdates].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const chartData = sorted.map(u => ({
        date: format(new Date(u.created_at), 'MMM dd'),
        impact: u.update_type === 'DAILY' ? 1 : u.update_type === 'WEEKLY' ? 3 : 7
    }));

    return (
        <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl h-[400px]">
            <CardHeader>
                <CardTitle className="text-lg font-black tracking-tight uppercase">Activity Momentum</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 800, fill: 'currentColor', opacity: 0.5 }}
                                dy={10}
                            />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(10, 12, 16, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="impact"
                                stroke="#6366f1"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorImpact)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
