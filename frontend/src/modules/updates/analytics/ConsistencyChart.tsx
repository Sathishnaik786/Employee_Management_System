import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

interface ConsistencyChartProps {
    data: any;
}

export const ConsistencyChart: React.FC<ConsistencyChartProps> = ({ data }) => {
    const chartData = [
        { name: 'Daily', value: data?.daily || 0, color: '#f59e0b' },
        { name: 'Weekly', value: data?.weekly || 0, color: '#10b981' },
        { name: 'Monthly', value: data?.monthly || 0, color: '#8b5cf6' },
    ];

    return (
        <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl h-[400px]">
            <CardHeader>
                <CardTitle className="text-lg font-black tracking-tight uppercase">Reporting Consistency</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 800, fill: 'currentColor', opacity: 0.5 }}
                                dy={10}
                            />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(10, 12, 16, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
