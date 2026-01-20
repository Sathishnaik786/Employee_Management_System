import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = "",
    delay = 0,
    hoverEffect = true
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            whileHover={hoverEffect ? { y: -5, boxShadow: '0 20px 40px -20px rgba(0,0,0,0.1)' } : {}}
            className={`bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-sm ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
