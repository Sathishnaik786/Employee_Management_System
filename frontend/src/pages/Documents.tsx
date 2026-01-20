import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FileText, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DocumentsPage: React.FC = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Document Repository"
        description="Institutional document management and archives."
        className="bg-header-gradient p-8 rounded-3xl border border-border/30 shadow-premium"
      >
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black tracking-widest px-3 py-1">
          SECURE STORAGE
        </Badge>
      </PageHeader>

      <div className="rounded-[2.5rem] border border-dashed border-primary/20 bg-background/40 p-12 lg:p-20 text-center shadow-inner">
        <div className="mx-auto mb-6 h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary/40">
          <FolderOpen className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-heading font-extrabold tracking-tight mb-2">
          Digital Document Archive
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8 font-medium">
          The IERS secure document repository is under development.
          Storage for student records, faculty publications, and institutional compliance documents (NAAC) will be managed here.
        </p>
        <div className="mt-8 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 max-w-md mx-auto">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <FileText size={14} /> Upcoming Features
          </p>
          <ul className="space-y-2 text-[10px] font-bold text-muted-foreground uppercase leading-relaxed text-left">
            <li>• Student Application Verification</li>
            <li>• Faculty Research Publications</li>
            <li>• NAAC SSR Evidence Uploads</li>
            <li>• Circulars & Notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;