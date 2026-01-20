import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Shield } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export default function StageLocked() {
    const navigate = useNavigate();

    return (
        <div className="p-8 lg:p-12 min-h-[80vh] flex flex-col items-center justify-center text-center space-y-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                <div className="relative w-40 h-40 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] flex items-center justify-center text-primary shadow-premium mx-auto">
                    <Lock size={80} strokeWidth={1} className="text-primary/40" />
                    <Shield size={32} className="absolute -top-2 -right-2 text-primary" />
                </div>
            </motion.div>

            <div className="space-y-4 max-w-2xl">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground uppercase">Stage Implementation Locked</h1>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed italic">
                    "This academic gateway is currently under synchronization for the 2026 Ph.D lifecycle. Access is restricted until the underlying business protocol is finalized."
                </p>
            </div>

            <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl max-w-md">
                <div className="flex items-start gap-4 text-left">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Shield className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary">DRC Protocol Alert</h4>
                        <p className="text-xs text-muted-foreground mt-1 font-bold leading-tight uppercase opacity-70">
                            Interviews and Evaluations are scheduled in the next sprint cycle following the Scrutiny Harden completion.
                        </p>
                    </div>
                </div>
            </div>

            <Button
                variant="premium"
                size="lg"
                className="px-12 rounded-2xl h-16 text-xs font-black uppercase tracking-widest"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="mr-3 h-5 w-5" /> Revert to Dashboard
            </Button>
        </div>
    );
}
