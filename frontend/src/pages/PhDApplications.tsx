import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    CreditCard,
    ShieldCheck,
    UserCheck,
    FileSearch,
    Loader2,
    Calendar,
    AlertCircle
} from 'lucide-react';
import { phdApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { PhDApplication, PhDStatus } from '@/types';
import { toast } from 'sonner';
import { PERMISSIONS } from '@/access/permissions';

export default function PhDApplications() {
    const { id } = useParams();
    const { user, hasPermission } = useAuth();
    const [application, setApplication] = useState<PhDApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [lifecycle, setLifecycle] = useState<{ id: string, academic_year: string, status: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchApplication(), fetchLifecycle()]);
            setLoading(false);
        }
        init();
    }, []);

    const fetchLifecycle = async () => {
        try {
            const res = await phdApi.getActiveLifecycle();
            if (res.success) {
                setLifecycle(res.data);
            }
        } catch (err) {
            console.error('Lifecycle sync failed', err);
        }
    };

    const fetchApplication = async () => {
        try {
            if (id) {
                const res = await phdApi.getById(id);
                if (res.success) {
                    setApplication(res.data);
                }
            } else {
                const res = await phdApi.getAll();
                if (res.success && res.data.length > 0) {
                    setApplication(res.data[0]);
                }
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to load application data');
        }
    };

    const handleExemptionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!application) return;
        try {
            setActionLoading(true);
            await phdApi.applyExemption(application.id, {
                exemption_type: 'FACULTY_QUOTA',
                proof_url: 'https://institutional.storage/proofs/exemption-doc.pdf'
            });
            toast.success('PET Exemption requested successfully');
            fetchApplication();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleInitiatePayment = async () => {
        if (!application) return;
        try {
            setActionLoading(true);
            await phdApi.initiatePayment(application.id, {
                amount: 25000,
                payment_method: 'UPI_COLLECT'
            });
            toast.success('Payment portal initiated');
            fetchApplication();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmPayment = async () => {
        if (!application) return;
        try {
            setActionLoading(true);
            await phdApi.confirmPayment(application.id, {
                transaction_ref: `TXN-${Date.now()}`,
                status: 'COMPLETED'
            });
            toast.success('Payment confirmed! Proceeding to guide allocation.');
            fetchApplication();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-primary h-12 w-12" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Synchronizing Admissions Cloud...</p>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="p-8 text-center max-w-2xl mx-auto py-20">
                <Card className="border-dashed border-2 rounded-[3rem] bg-muted/30">
                    <CardContent className="p-12">
                        <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
                        <h3 className="text-xl font-black uppercase tracking-tight">
                            {lifecycle ? `BOS ${lifecycle.academic_year} Lifecycle Active` : 'No Active Program Lifecycle'}
                        </h3>
                        <p className="text-muted-foreground mt-2 font-medium">
                            {lifecycle
                                ? 'Ph.D admission portal is currently open for the current academic session.'
                                : 'Institutional Ph.D admission cycles are currently closed. Check regular notifications.'}
                        </p>

                        {lifecycle ? (
                            <Button
                                variant="premium"
                                className="mt-8 rounded-2xl px-8 h-12"
                                onClick={() => navigate('/app/iers/phd/applications/new')}
                            >
                                Start New Application
                            </Button>
                        ) : (
                            <Button
                                disabled
                                variant="outline"
                                className="mt-8 rounded-2xl px-8 h-12 opacity-50"
                            >
                                Request Application (Closed)
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stages = [
        { key: 'SUBMITTED', label: 'Application Submitted', icon: FileText },
        { key: 'SCRUTINY_APPROVED', label: 'DRC Scrutiny', icon: FileSearch },
        { key: 'INTERVIEW_COMPLETED', label: 'Panel Interview', icon: Calendar },
        { key: 'DOCUMENTS_VERIFIED', label: 'Document Verification', icon: ShieldCheck },
        { key: 'PAYMENT_COMPLETED', label: 'Fee Payment', icon: CreditCard },
        { key: 'GUIDE_ALLOCATED', label: 'Guide Allocation', icon: UserCheck }
    ];

    const getStageStatus = (stageKey: string) => {
        const statusOrder = ['DRAFT', 'SUBMITTED', 'SCRUTINY_APPROVED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'DOCUMENTS_VERIFIED', 'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'GUIDE_ALLOCATED'];
        const currentIdx = statusOrder.indexOf(application.status);
        const stageIdx = statusOrder.indexOf(stageKey);

        if (stageIdx < currentIdx) return 'completed';
        if (stageKey === application.status || (stageKey === 'SCRUTINY_APPROVED' && application.status === 'SUBMITTED')) return 'current';
        return 'pending';
    };

    const isOverdue = application.due_at && new Date() > new Date(application.due_at);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <PageHeader
                title="Ph.D Program Lifecycle"
                description={`Institutional Protocol: ${application.application_no} | Status: ${application.status.replace('_', ' ')}`}
                className="bg-header-gradient p-10 rounded-[2.5rem] border border-white/10 shadow-premium"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Timeline & Audit View */}
                <div className="lg:col-span-3 space-y-8">
                    <Card className="rounded-[3rem] shadow-premium overflow-hidden border-white/5 bg-white/5 backdrop-blur-md">
                        <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                            <CardTitle className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
                                <Clock className="h-5 w-5 text-primary" /> Multi-Stage Admission Flow
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <Timeline>
                                {stages.map((stage, index) => {
                                    const status = getStageStatus(stage.key);
                                    return (
                                        <TimelineItem key={stage.key}>
                                            <TimelineDot status={status as any}>
                                                <stage.icon className="h-4 w-4" />
                                            </TimelineDot>
                                            <TimelineContent>
                                                <div className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${status === 'current' ? 'bg-primary/10 border-primary/20 bg-glow-primary scale-[1.01]' :
                                                    status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/10' :
                                                        'bg-white/5 border-white/5 opacity-40 grayscale-[0.5]'
                                                    }`}>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Phase {index + 1}</p>
                                                            {status === 'current' && (
                                                                <Badge variant="outline" className="text-[9px] bg-primary/20 text-primary border-none animate-pulse">In Progress</Badge>
                                                            )}
                                                        </div>
                                                        <h4 className="text-base font-black tracking-tight flex items-center gap-2">
                                                            {stage.label}
                                                            {status === 'completed' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                                                        </h4>

                                                        {/* Step Details (Audit Context) */}
                                                        {status === 'completed' && (
                                                            <p className="text-[10px] text-muted-foreground mt-2 font-medium italic">
                                                                Validated by Institutional Authority
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="text-right">
                                                        {status === 'current' && isOverdue ? (
                                                            <div className="flex flex-col items-end gap-1">
                                                                <Badge variant="destructive" className="animate-bounce text-[9px] font-black uppercase">SLA Breach</Badge>
                                                                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">Escalated to DRCS</p>
                                                            </div>
                                                        ) : (
                                                            <Badge variant="outline" className={
                                                                status === 'completed' ? 'text-emerald-500 bg-emerald-500/10 border-none' :
                                                                    status === 'current' ? 'text-primary bg-primary/10 border-none' :
                                                                        'text-muted-foreground bg-muted/10 border-none'
                                                            }>
                                                                {status.toUpperCase()}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TimelineContent>
                                        </TimelineItem>
                                    );
                                })}
                            </Timeline>
                        </CardContent>
                    </Card>

                    {/* Institutional Audit Snippet (Task 3) */}
                    <Card className="rounded-[2.5rem] border-white/5 bg-black/20 backdrop-blur-xl">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-60">Forensic Audit Trail (Last 5 Events)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                            {[
                                ...(application.scrutiny || []),
                                ...(application.interviews || []),
                                ...(application.payment || []),
                                ...(application.guide_allocation ? [application.guide_allocation] : [])
                            ].sort((a, b) => new Date(b.created_at || b.reviewed_at || b.paid_at || b.allocated_at).getTime() - new Date(a.created_at || a.reviewed_at || a.paid_at || a.allocated_at).getTime())
                                .slice(0, 5).map((log, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <ShieldCheck className="h-4 w-4 text-primary shrink-0 opacity-50" />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold uppercase tracking-tight">
                                                {log.decision || log.recommendation || (log.amount ? 'Payment' : 'Allocation')}
                                            </p>
                                            <p className="text-[10px] opacity-60 line-clamp-1">{log.remarks || 'Institutional decision recorded.'}</p>
                                        </div>
                                        <p className="text-[10px] font-black uppercase opacity-40 tabular-nums">
                                            {new Date(log.reviewed_at || log.paid_at || log.allocated_at || log.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            {(application.scrutiny?.length === 0 && application.interviews?.length === 0) && (
                                <p className="text-xs text-center p-8 opacity-40 font-medium">Initial application phase. No audit records available.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Action Sidebar */}
                <div className="space-y-8">
                    {/* Hardened SLA Card */}
                    <Card className={`rounded-[2.5rem] border-2 shadow-2xl transition-all duration-500 ${isOverdue ? 'border-rose-500/50 bg-rose-500/5 shadow-rose-500/10' : 'border-primary/20 bg-primary/5 shadow-primary/10'}`}>
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className={`h-6 w-6 ${isOverdue ? 'text-rose-500 animate-pulse' : 'text-primary'}`} />
                                    <h4 className="font-black uppercase text-xs tracking-widest">Stage Deadline</h4>
                                </div>
                                {isOverdue && <Badge className="bg-rose-500 text-white border-none animate-pulse">LATE</Badge>}
                            </div>
                            <div>
                                <p className="text-4xl font-black tabular-nums tracking-tighter">
                                    {application.due_at ? new Date(application.due_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }) : '---'}
                                </p>
                                <p className={`text-[10px] font-bold uppercase mt-1 ${isOverdue ? 'text-rose-500' : 'opacity-60'}`}>
                                    {isOverdue ? 'CRITICAL SYSTEM BREACH' : 'INSTITUTIONAL DUE DATE'}
                                </p>
                            </div>
                            {application.due_at && (
                                <Progress value={isOverdue ? 100 : 65} className={`h-1.5 rounded-full ${isOverdue ? '[&>div]:bg-rose-600' : ''}`} />
                            )}
                        </CardContent>
                    </Card>

                    {/* Sealed Action Container (Task 1 & 4) */}
                    <Card className="rounded-[2.5rem] shadow-premium bg-white/5 border-white/5 overflow-hidden">
                        <CardHeader className="bg-primary/20 p-6 border-b border-white/5">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" /> Hardened Gate
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">

                            {/* Idempotent Payment Flow (Task 2) */}
                            {application.status === 'DOCUMENTS_VERIFIED' && (
                                <div className="space-y-4">
                                    <div className="p-5 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20">
                                        <p className="text-[10px] text-emerald-500 font-black uppercase mb-1">Pre-Check: PASS</p>
                                        <p className="text-xs font-medium leading-relaxed">Admission eligibility confirmed by DRC. High-priority fee portal unlocked.</p>
                                    </div>
                                    <Button
                                        onClick={handleInitiatePayment}
                                        disabled={actionLoading}
                                        className="w-full rounded-[1.5rem] h-14 bg-primary hover:bg-primary/80 shadow-lg shadow-primary/20 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                                    >
                                        <CreditCard className="h-4 w-4" /> Open Payment Portal
                                    </Button>
                                </div>
                            )}

                            {application.status === 'PAYMENT_PENDING' && (
                                <div className="space-y-4">
                                    <div className="p-6 bg-slate-900 border border-white/10 rounded-[2rem] text-center">
                                        <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Loader2 className="h-5 w-5 text-primary animate-spin" />
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest mb-1 text-primary">Pending Verification</p>
                                        <p className="text-[10px] opacity-60 font-medium">Verify transaction reference to unblock final allocation.</p>
                                    </div>
                                    <Button
                                        onClick={handleConfirmPayment}
                                        disabled={actionLoading}
                                        variant="outline"
                                        className="w-full rounded-[1.5rem] h-14 border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                                    >
                                        Confirm Transaction
                                    </Button>
                                    <p className="text-[9px] text-center opacity-40 font-black uppercase tracking-tighter">Institutional Integrity Check Required</p>
                                </div>
                            )}

                            {application.status === 'PAYMENT_COMPLETED' && (
                                <div className="p-8 border-2 border-dashed border-primary/20 rounded-[2rem] text-center space-y-4 bg-primary/5">
                                    <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <UserCheck className="h-8 w-8 text-primary shadow-primary" />
                                    </div>
                                    <div>
                                        <h5 className="font-black uppercase text-xs tracking-widest text-primary">Supervisor Queue</h5>
                                        <p className="text-[10px] leading-relaxed opacity-70 font-medium mt-3 px-2">Allocation system unblocked. Final supervisor assignment is in progress by HOD Office.</p>
                                    </div>
                                </div>
                            )}

                            {/* Blocked Reasoning System (Task 1) */}
                            {['SUBMITTED', 'SCRUTINY_APPROVED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED'].includes(application.status) && (
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center gap-4 text-center p-8 bg-amber-500/5 rounded-[2rem] border border-amber-500/20">
                                        <Clock className="h-10 w-10 text-amber-500 opacity-40 animate-pulse" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-amber-600 mb-2">System Locked</p>
                                            <p className="text-xs font-black uppercase tracking-tight opacity-70">Reason: Scrutiny in progress</p>
                                            <p className="text-[10px] font-medium leading-relaxed mt-4 opacity-50 px-2 italic">Institutional payment gates open only after physical document verification by DRC.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {application.status === 'GUIDE_ALLOCATED' && (
                                <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] text-center animate-in fade-in zoom-in">
                                    <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                                    <h4 className="font-black uppercase text-xs tracking-[0.2em] text-emerald-500">Program Initiated</h4>
                                    <p className="text-[10px] font-medium opacity-70 mt-4 leading-loose">Lifecycle complete. You are now a registered Ph.D scholar of the University.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
