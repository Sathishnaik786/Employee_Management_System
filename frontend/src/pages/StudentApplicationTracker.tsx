import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timeline, TimelineItem, TimelineContent, TimelineDot } from '@/components/common/Timeline';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Calendar,
  Download,
  Eye,
  Loader2
} from 'lucide-react';
import { useStudentMe } from '@/hooks/useStudentMe';

export default function StudentApplicationTracker() {
  const { workflowData, isLoading } = useStudentMe();

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary h-12 w-12" />
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Synchronizing Research Lifecycle...</p>
      </div>
    );
  }

  const application = workflowData?.application;
  const workflow = workflowData?.workflow;

  if (!application || !workflow) {
    return (
      <div className="p-8 text-center max-w-2xl mx-auto py-20">
        <div className="bg-muted/30 p-10 rounded-[3rem] border border-dashed border-border/60">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
          <h3 className="text-xl font-black uppercase tracking-tight">Lifecycle Inactive</h3>
          <p className="text-muted-foreground mt-2 font-medium">You don't have an active PhD research application or the workflow has not been initiated yet.</p>
          <Button variant="premium" className="mt-8 rounded-2xl px-8" onClick={() => window.location.href = '/app/iers/phd/applications'}>Initiate Application</Button>
        </div>
      </div>
    );
  }

  const steps = workflow.steps || [];
  const completedSteps = steps.filter((s: any) => s.is_completed).length;
  const totalSteps = steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Institutional Research Lifecycle"
        description="Live cryptographic tracking of your academic and research progress through the university protocol."
        className="bg-header-gradient p-10 rounded-[2.5rem] border border-white/10 shadow-premium"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Summary Card */}
        <Card className="lg:col-span-1 border-white/5 shadow-premium bg-white/5 backdrop-blur-xl rounded-[3rem] overflow-hidden sticky top-8 h-fit">
          <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
            <CardTitle className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
              <div className="p-2 rounded-xl bg-primary text-white">
                <FileText className="h-4 w-4" />
              </div>
              Protocol Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase opacity-40 mb-1">Registration ID</p>
              <p className="text-lg font-black tracking-tight text-primary">{application.application_no}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[8px] font-black uppercase opacity-40 mb-1">Protocol Status</p>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase tracking-tighter">
                  {application.status}
                </Badge>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[8px] font-black uppercase opacity-40 mb-1">Workflow Stage</p>
                <p className="text-xs font-bold">{workflow.current_step} / {totalSteps}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                <span>Completion Index</span>
                <span>{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-indigo-500" />
              </Progress>
            </div>

            <div className="pt-4">
              <p className="text-[10px] font-black uppercase opacity-40 mb-2">Research Domain</p>
              <p className="text-sm font-bold leading-relaxed">{application.research_interest || application.research_area}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline & Actions */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-white/5 shadow-premium bg-white/5 backdrop-blur-md rounded-[3rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
                <Clock className="h-5 w-5 text-primary" />
                Workflow Execution Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <Timeline>
                {steps.map((step: any, index: number) => (
                  <TimelineItem key={step.id}>
                    <TimelineDot status={
                      step.is_completed ? 'completed' :
                        step.is_current ? 'current' : 'pending'
                    }>
                      {step.is_completed ? <CheckCircle className="h-4 w-4" /> :
                        step.is_current ? <Clock className="h-4 w-4 animate-pulse" /> :
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />}
                    </TimelineDot>
                    <TimelineContent>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-4">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 mb-1">Stage {step.step_order}</p>
                          <h4 className="text-base font-black tracking-tight">{step.step_name}</h4>
                          <p className="text-xs text-muted-foreground font-medium mt-1">
                            Approver: <span className="text-foreground/80 font-bold">{step.approver_role || step.approver_roles?.join(', ')}</span>
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Badge variant="outline" className={
                            step.is_completed ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                              step.is_current ? "bg-primary/10 text-primary border-primary/20" :
                                "bg-muted/10 text-muted-foreground border-white/5"
                          }>
                            {step.is_completed ? 'Verification Sealed' : step.is_current ? 'Active Scrutiny' : 'Protocol Wait'}
                          </Badge>
                        </div>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-premium bg-primary/5 rounded-[3rem] overflow-hidden border">
            <CardContent className="p-10 flex items-start gap-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-black tracking-tight">Institutional Advisory</h4>
                <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                  Your research lifecycle is governed by the university's automated workflow engine. Ensure all digital artifacts (synopsis, publications) are synchronized with your supervisor before the RRC review deadline.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                  <Button variant="default" className="rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest h-11">Download Ruleset</Button>
                  <Button variant="outline" className="rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest h-11 border-white/10 bg-white/5">Contact Registrar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
