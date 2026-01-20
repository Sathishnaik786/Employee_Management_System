import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, XCircle, Clock, ShieldAlert, FileSearch } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { phdApi, workflowApi } from '@/services/api';

interface WorkflowInstance {
    id: string;
    entity_id: string;
    current_step: number;
    status: string;
    workflow_id: string;
    created_at: string;
    workflow: {
        name: string;
    };
}

interface WorkflowStep {
    id: string;
    step_name: string;
    step_order: number;
    approver_roles: string[];
}

export default function PhDScrutiny() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, hasPermission } = useAuth();
    const [instance, setInstance] = useState<WorkflowInstance | null>(null);
    const [application, setApplication] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            let targetApp: any = null;

            if (id) {
                const appRes = await phdApi.getById(id);
                if (appRes.success) {
                    targetApp = appRes.data;
                    setApplication(targetApp);
                }
            } else {
                // Load first app with UNDER_SCRUTINY if no ID
                const allRes = await phdApi.getAll();
                if (allRes.success) {
                    targetApp = allRes.data.find((a: any) => a.status === 'UNDER_SCRUTINY');
                    if (targetApp) {
                        setApplication(targetApp);
                    }
                }
            }

            if (targetApp) {
                // Find workflow instance for this entity
                const { data: instData, error: instError } = await (supabase as any)
                    .from('workflow_instances')
                    .select('*, workflow:workflows(name)')
                    .eq('entity_id', targetApp.id)
                    .eq('entity_type', 'phd_application')
                    .eq('status', 'IN_PROGRESS')
                    .maybeSingle();

                if (instError) throw instError;

                if (instData) {
                    setInstance(instData);

                    // Get current step
                    const { data: stepData, error: stepError } = await (supabase as any)
                        .from('workflow_steps')
                        .select('*')
                        .eq('workflow_id', instData.workflow_id)
                        .eq('step_order', instData.current_step)
                        .maybeSingle();

                    if (stepError) throw stepError;
                    setCurrentStep(stepData);
                }
            }
        } catch (err: any) {
            toast.error("Failed to load scrutiny protocol: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: 'APPROVE' | 'REJECT') => {
        if (!instance || !currentStep) return;

        try {
            const apiAction = action === 'APPROVE' ? 'APPROVE' : 'REJECT';
            const res = await workflowApi.approveStep(instance.id, {
                action: apiAction,
                remarks
            });

            if (res.success) {
                toast.success(`Application ${action === 'APPROVE' ? 'Qualified' : 'Rejected'} successfully`);
                queryClient.invalidateQueries({ queryKey: ['student', 'me', 'workflows'] });
                navigate('/app/iers/drc/applications');
            }
        } catch (err: any) {
            toast.error(err.message || "Action failed");
        }
    };

    const isStepAuthorized = currentStep && hasPermission(PERMISSIONS.PHD_WORKFLOW_ACTION);

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );

    if (!application || !instance) return (
        <div className="p-12 text-center space-y-6 max-w-lg mx-auto min-h-[60vh] flex flex-col justify-center">
            <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                <FileSearch className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-widest text-foreground">Scrutiny Sync Missing</h2>
                <p className="text-muted-foreground font-medium italic">"No applications currently under scrutiny found in the institutional queue."</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/app/iers/drc/applications')} className="rounded-xl px-8 w-fit mx-auto">
                Return to Queue
            </Button>
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <PageHeader
                title="Application Scrutiny"
                description={`Reviewing: ${application.application_no} | Initiated: ${new Date(instance.created_at).toLocaleDateString()}`}
            />

            <div className="grid grid-cols-12 gap-8">
                {/* Applicant Profile Summary */}
                <Card className="col-span-12 lg:col-span-4 rounded-[2.5rem] bg-muted/5 border-white/5 shadow-premium">
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary">Identity Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-xl">
                                {application.student_name?.[0] || 'A'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-foreground leading-none truncate">{application.student_name}</p>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1 truncate">{application.research_area}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                <span className="text-muted-foreground/60">Category</span>
                                <span className="text-foreground">{application.category || 'GENERAL'}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                <span className="text-muted-foreground/60">PET Type</span>
                                <span className="text-foreground">{application.pet_exemption_type || 'EXEMPTED'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter">
                                <span className="text-muted-foreground/60">Current State</span>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-2 h-5 text-[9px] uppercase font-black">
                                    {application.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Scrutiny Decision Logic */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <Card className="border-primary/20 bg-primary/5 rounded-[2.5rem] shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4" /> Active Scrutiny Gate
                                </CardTitle>
                                <Badge className="bg-primary text-primary-foreground font-black uppercase rounded-lg px-3">
                                    Stage {instance.current_step}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h2 className="text-2xl font-black text-foreground mb-4">{currentStep?.step_name || 'Harden Scrutiny Stage'}</h2>
                            <p className="text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
                                Verify documents and research proposal. Qualifying the application moves it to Interview Scheduling.
                                Rejection effectively terminates this lifecycle instance.
                            </p>
                        </CardContent>
                    </Card>

                    {!isStepAuthorized ? (
                        <div className="p-8 border-2 border-dashed border-rose-500/20 rounded-[2.5rem] bg-rose-500/5 flex flex-col items-center gap-4 text-center">
                            <ShieldAlert className="h-12 w-12 text-rose-500" />
                            <div className="space-y-1">
                                <h4 className="text-lg font-black uppercase tracking-widest text-rose-600">Decision Lock Active</h4>
                                <p className="text-sm text-rose-500/80 font-medium italic">"Authority Level {user?.role} does not possess the signing keys for this gate."</p>
                            </div>
                        </div>
                    ) : (
                        <Card className="rounded-[2.5rem] shadow-premium overflow-hidden border-white/5">
                            <CardHeader className="bg-white/5 border-b border-white/5">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Officer Remarks & Findings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <Textarea
                                    placeholder="Enter detailed findings and technical observations for this applicant..."
                                    className="min-h-[160px] rounded-3xl border-muted/20 focus:ring-primary/40 bg-muted/10 resize-none p-6 text-sm font-medium leading-relaxed"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Button
                                        className="h-16 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
                                        onClick={() => handleAction('APPROVE')}
                                        disabled={!remarks}
                                    >
                                        <CheckCircle2 className="mr-3 h-5 w-5" /> QUALIFY APPLICANT
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="h-16 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] text-rose-600 border-rose-200 hover:bg-rose-50 shadow-xl shadow-rose-500/5"
                                        onClick={() => handleAction('REJECT')}
                                        disabled={!remarks}
                                    >
                                        <XCircle className="mr-3 h-5 w-5" /> REJECT APPLICATION
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
