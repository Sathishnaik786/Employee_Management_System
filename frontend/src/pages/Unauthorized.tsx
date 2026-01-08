import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full text-center space-y-10"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full" />
          <div className="relative w-32 h-32 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center text-rose-500 shadow-2xl shadow-rose-500/20 mx-auto">
            <ShieldAlert size={64} strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase">Security Breach</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium leading-relaxed italic">
            "Your digital signature lacks the required clearance level to interface with this localized environment."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild variant="outlinePremium" size="lg" className="w-full sm:w-auto px-8 rounded-2xl h-14">
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <ArrowLeft size={18} /> Revert to Safety
            </Link>
          </Button>
          <Button asChild variant="premium" size="lg" className="w-full sm:w-auto px-8 rounded-2xl h-14">
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <Home size={18} /> Central Station
            </Link>
          </Button>
        </div>

        <div className="flex justify-center pt-8">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            Unauthorized Access Logged
          </div>
        </div>
      </motion.div>
    </div>
  );
}