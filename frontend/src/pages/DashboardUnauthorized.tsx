import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home, ShieldX } from 'lucide-react';

export default function DashboardUnauthorized() {
    const navigate = useNavigate();
    const location = useLocation();
    const stateMessage = location.state?.message;

    return (
        <div className="p-8 lg:p-12 min-h-[60vh] flex flex-col items-center justify-center text-center space-y-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-rose-500/20 blur-[80px] rounded-full" />
                <div className="relative w-32 h-32 bg-rose-500/10 backdrop-blur-3xl border border-rose-500/20 rounded-[2.5rem] flex items-center justify-center text-rose-500 shadow-premium mx-auto">
                    <ShieldX size={64} strokeWidth={1.5} />
                    <div className="absolute top-0 right-0 p-2 bg-[#0a0c10] rounded-full border border-border/50">
                        <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                    </div>
                </div>
            </motion.div>

            <div className="space-y-4 max-w-xl">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground uppercase">
                    Security Access Restricted
                </h1>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed italic">
                    {stateMessage || "Your digital signature lacks the required clearance level to interface with this localized environment."}
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 pt-2">
                    <ShieldAlert size={12} />
                    Unauthorized access attempt logged
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="outlinePremium"
                    size="lg"
                    className="px-8 rounded-2xl"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
                </Button>
                <Button
                    variant="premium"
                    size="lg"
                    className="px-8 rounded-2xl"
                    onClick={() => navigate('/app/dashboard')}
                >
                    <Home className="mr-2 h-5 w-5" /> Return to Dashboard
                </Button>
            </div>
        </div>
    );
}
