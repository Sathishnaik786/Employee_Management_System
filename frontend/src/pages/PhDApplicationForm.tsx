import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { phdApi, studentsApi } from '@/services/api';
import { toast } from 'sonner';
import { Loader2, Save, AlertCircle } from 'lucide-react';

export default function PhDApplicationForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [studentId, setStudentId] = useState<string | undefined>();
    const [formData, setFormData] = useState({
        research_interest: '',
        pg_score: '',
        pg_specialization: '',
        program: 'PhD'
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setInitializing(true);
                const res = await studentsApi.getMe();
                if (res.data) {
                    setStudentId(res.data.id);
                }
            } catch (err: any) {
                if (err.status === 404) {
                    toast.error("Identity Breach: Student profile not found.");
                } else {
                    toast.error("Cloud Protocol Error: Failed to sync identity.");
                }
            } finally {
                setInitializing(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!studentId) {
            toast.error("Student profile not initialized. Contact admin.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                student_id: studentId,
                research_interest: formData.research_interest,
                pg_score: parseFloat(formData.pg_score),
                pg_specialization: formData.pg_specialization,
                program: formData.program
            };

            const res = await phdApi.create(payload);
            if (res.success) {
                toast.success('Application created in DRAFT state');
                // Automatically submit for this flow if required, 
                // but user says "On submit: Call POST /iers/phd/applications"
                // and "Expected Result: Status = SUBMITTED"

                await phdApi.submit(res.data.id);
                toast.success('Application submitted successfully!');
                navigate('/app/iers/phd/applications');
            }
        } catch (err: any) {
            toast.error(err.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    if (initializing) {
        return (
            <div className="p-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-primary h-12 w-12" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Initializing Research Protocol...</p>
            </div>
        );
    }

    if (!studentId) {
        return (
            <div className="p-12 text-center max-w-xl mx-auto space-y-6">
                <AlertCircle className="h-16 w-16 text-rose-500 mx-auto" />
                <h2 className="text-2xl font-black uppercase">Identity Breach</h2>
                <p className="text-muted-foreground font-medium">Student profile not initialized in the IERS Cloud. Please contact the institutional administrator to verify your academic identity.</p>
                <Button variant="outline" className="rounded-2xl" onClick={() => navigate('/app/iers/phd/applications')}>Return to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <PageHeader
                title="New Ph.D Admission Protocol"
                description="Secure Institutional Application Gateway | Academic Session 2026-27"
                className="bg-header-gradient p-10 rounded-[2.5rem] border border-white/10 shadow-premium"
            />

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card className="rounded-[2.5rem] border-white/5 bg-white/5 backdrop-blur-md overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Research & Program</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase opacity-60">Research Interest Area</Label>
                                <Input
                                    className="rounded-xl bg-white/5 border-white/10 h-12"
                                    placeholder="e.g. Distributed Ledger Systems for Institutional Governance"
                                    value={formData.research_interest}
                                    onChange={(e) => setFormData({ ...formData, research_interest: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-white/5 bg-white/5 backdrop-blur-md overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Academic Excellence records</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase opacity-60">PG CGPA / Percentage</Label>
                                <Input
                                    className="rounded-xl bg-white/5 border-white/10 h-12"
                                    placeholder="8.5 or 85%"
                                    value={formData.pg_score}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        pg_score: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase opacity-60">Master's Specialization</Label>
                                <Input
                                    className="rounded-xl bg-white/5 border-white/10 h-12"
                                    placeholder="M.Tech Computer Science"
                                    value={formData.pg_specialization}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        pg_specialization: e.target.value
                                    })}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pb-12">
                    <Button
                        type="button"
                        variant="ghost"
                        className="rounded-2xl px-8 font-bold"
                        onClick={() => navigate('/app/iers/phd/applications')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="rounded-2xl px-12 h-14 bg-primary hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 flex items-center gap-3"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Initialize & Submit Application
                    </Button>
                </div>
            </form>
        </div>
    );
}
