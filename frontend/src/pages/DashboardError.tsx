import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react';

export default function DashboardError() {
    const navigate = useNavigate();
    const error: any = useRouteError(); // Capture the error manually

    console.error("Dashboard Boundary Caught Error:", error);

    return (
        <div className="p-8 lg:p-12 min-h-[60vh] flex flex-col items-center justify-center text-center space-y-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-rose-500/20 blur-[80px] rounded-full" />
                <div className="relative w-32 h-32 bg-rose-500/10 backdrop-blur-3xl border border-rose-500/20 rounded-[2.5rem] flex items-center justify-center text-rose-500 shadow-premium mx-auto">
                    <AlertCircle size={64} strokeWidth={1.5} />
                </div>
            </motion.div>

            <div className="space-y-4 max-w-xl">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground uppercase">
                    Protocol Exception
                </h1>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed italic">
                    "An unexpected anomaly halted the rendering of this module. The system has contained the fault."
                </p>
                {error?.statusText || error?.message ? (
                    <div className="bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl text-xs font-mono text-rose-400 mt-4 break-words">
                        Error Trace: {error.statusText || error.message}
                    </div>
                ) : null}
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
                <Button
                    variant="ghost"
                    size="lg"
                    className="px-8 rounded-2xl hover:bg-muted"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCw className="mr-2 h-5 w-5" /> Reload
                </Button>
            </div>
        </div>
    );
}
