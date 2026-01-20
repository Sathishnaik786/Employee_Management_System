import React from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { TrendData } from '../types';

interface SparklineProps {
    data: TrendData[];
    color?: string;
    height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
    data,
    color = '#10b981',
    height = 40
}) => {
    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                    />
                    <Tooltip
                        content={<></>}
                        cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
