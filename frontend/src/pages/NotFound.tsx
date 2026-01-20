import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { SearchX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorLayout } from "@/components/errors/ErrorLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Non-existent route access:", location.pathname);
  }, [location.pathname]);

  return (
    <ErrorLayout
      icon={<SearchX size={80} strokeWidth={1} />}
      badge="404"
      title="Lost in Space"
      description="The localized fragment you are searching for does not exist within the current organizational network."
      actions={
        <>
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
        </>
      }
    >
      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
        Route Trace Failed: {location.pathname}
      </div>
      <div className="h-px w-20 bg-border/40" />
      <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">ELMS - Enterprise Learning Hub © 2026</p>
    </ErrorLayout>
  );
};

export default NotFound;
