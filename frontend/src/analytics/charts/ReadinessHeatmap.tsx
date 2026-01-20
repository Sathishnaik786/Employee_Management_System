import React from 'react';
import { ReadinessScore } from '../types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ReadinessHeatmapProps {
    data: ReadinessScore[];
}

const statusColorMap = {
    OPTIMAL: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    WARN: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    CRITICAL: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
};

export const ReadinessHeatmap: React.FC<ReadinessHeatmapProps> = ({ data }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {data.map((item) => (
                <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    className={cn(
                        "p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 group transition-all",
                        statusColorMap[item.status]
                    )}
                >
                    <span className="text-[9px] font-black uppercase tracking-tighter opacity-60 text-center line-clamp-1">
                        {item.category}
                    </span>
                    <div className="text-xl font-black">{item.score}%</div>
                    <div className="flex items-center gap-1">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full animate-pulse",
                            item.status === 'OPTIMAL' ? 'bg-emerald-500' :
                                item.status === 'WARN' ? 'bg-amber-500' : 'bg-rose-500'
                        )} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{item.trend}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
