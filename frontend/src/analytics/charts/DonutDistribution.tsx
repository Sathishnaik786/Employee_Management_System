import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { DistributionData } from '../types';

interface DonutDistributionProps {
    data: DistributionData[];
    colors?: string[];
    height?: number;
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#6366f1'];

export const DonutDistribution: React.FC<DonutDistributionProps> = ({
    data,
    colors = DEFAULT_COLORS,
    height = 250
}) => {
    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="label"
                        isAnimationActive={true}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
