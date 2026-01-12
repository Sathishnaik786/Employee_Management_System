import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { SearchX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Non-existent route access:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full text-center space-y-12"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative w-40 h-40 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary shadow-2xl shadow-primary/20 mx-auto">
            <SearchX size={80} strokeWidth={1} />
          </div>
          <div className="absolute -top-4 -right-4 bg-rose-500 text-white font-black text-xl px-4 py-2 rounded-2xl shadow-xl rotate-12">
            404
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground uppercase">Lost in Space</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto font-medium leading-relaxed italic">
            "The localized fragment you are searching for does not exist within the current organizational network."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
          <Button asChild variant="outlinePremium" size="lg" className="w-full sm:w-auto px-10 rounded-2xl h-16 text-md font-black italic">
            <Link to="/app/dashboard" className="flex items-center gap-3">
              <ArrowLeft size={20} /> Abort Search
            </Link>
          </Button>
          <Button asChild variant="premium" size="lg" className="w-full sm:w-auto px-10 rounded-2xl h-16 text-md font-black italic">
            <Link to="/app/dashboard" className="flex items-center gap-3">
              <Home size={20} /> Return to Base
            </Link>
          </Button>
        </div>

        <div className="flex flex-col items-center gap-4 pt-10">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
            Route Trace Failed: {location.pathname}
          </div>
          <div className="h-px w-20 bg-border/40" />
          <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">YVI People Enterprise Systems © 2024</p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
