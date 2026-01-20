import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ShieldCheck, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminUsers: React.FC = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="IERS System Administration"
        description="Institutional user management and access control."
        className="bg-header-gradient p-8 rounded-3xl border border-border/30 shadow-premium"
      >
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black tracking-widest px-3 py-1">
          ADMINISTRATIVE ACCESS
        </Badge>
      </PageHeader>

      <div className="rounded-[2.5rem] border border-dashed border-primary/20 bg-background/40 p-12 lg:p-20 text-center shadow-inner">
        <div className="mx-auto mb-6 h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary/40">
          <UserCog className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-heading font-extrabold tracking-tight mb-2">
          User Administration Module
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8 font-medium">
          The IERS institutional user management system is being developed.
          User provisioning, role assignment, and access control will be managed through this interface.
        </p>
        <div className="mt-8 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 max-w-md mx-auto">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <ShieldCheck size={14} /> Current User Management
          </p>
          <ul className="space-y-2 text-[10px] font-bold text-muted-foreground uppercase leading-relaxed text-left">
            <li>• User creation via Supabase Auth Dashboard</li>
            <li>• Role assignment through iers_users table</li>
            <li>• Permission mapping via role_permissions</li>
            <li>• Manual provisioning for security compliance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;