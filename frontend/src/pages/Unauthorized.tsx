import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { ErrorLayout } from '@/components/errors/ErrorLayout';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <ErrorLayout
      icon={<ShieldAlert size={80} strokeWidth={1} />}
      badge="401"
      title="Security Breach"
      description="Your digital signature lacks the required clearance level to interface with this localized environment."
      actions={
        <>
          <Button
            variant="outlinePremium"
            size="lg"
            className="w-full sm:w-auto px-10 rounded-2xl h-16 text-md font-black italic gap-3"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} /> Revert to Safety
          </Button>
          <Button asChild variant="premium" size="lg" className="w-full sm:w-auto px-10 rounded-2xl h-16 text-md font-black italic">
            <Link to="/app/dashboard" className="flex items-center gap-3">
              <Home size={20} /> Return to Base
            </Link>
          </Button>
        </>
      }
    >
      <div className="flex justify-center pt-8">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          Unauthorized Access Logged
        </div>
      </div>
    </ErrorLayout>
  );
}
