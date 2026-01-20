import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function MeetupsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between bg-card/30 p-6 sm:p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm shadow-premium">
        <PageHeader
          title="Institutional Collaboration"
          description="Academic meetings and research coordination hub."
          className="mb-0"
        />
      </div>

      <div className="rounded-[2.5rem] border border-dashed border-primary/20 bg-background/40 p-12 lg:p-20 text-center shadow-inner">
        <div className="mx-auto mb-6 h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary/40">
          <CalendarIcon className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-heading font-extrabold tracking-tight mb-2">
          Collaboration Module Under Development
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8 font-medium">
          The IERS institutional collaboration and meeting coordination system is currently being developed.
          Academic syncs and research committee meetings will be managed here.
        </p>
        <div className="text-xs text-muted-foreground">
          For urgent academic meetings, please coordinate through your department head or the Registrar's office.
        </div>
      </div>
    </div>
  );
}
