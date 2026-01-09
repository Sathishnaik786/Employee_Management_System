import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { createMonthlyUpdate, getMyMonthlyUpdates } from './monthlyUpdates.api';
import { toast } from 'sonner';
import { CalendarDays, Rocket, Target, Brain, AlertTriangle, FastForward } from 'lucide-react';

interface MonthlyUpdateFormProps {
    onSuccess?: () => void;
}

const MonthlyUpdateForm: React.FC<MonthlyUpdateFormProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        goalsPlanned: '',
        goalsAchieved: '',
        keyContributions: '',
        learnings: '',
        risks: '',
        nextMonthGoals: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.goalsAchieved || !formData.keyContributions) {
            toast.error('Please report your achievements and key contributions.');
            return;
        }

        setLoading(true);
        try {
            // Check for duplicates (Frontend check for UX)
            const myUpdates = await getMyMonthlyUpdates();
            const existing = myUpdates.data?.find((u: any) => u.content.month === formData.month);

            if (existing) {
                toast.error(`You have already submitted a report for ${formData.month}.`);
                setLoading(false);
                return;
            }

            const payload = {
                update_type: 'MONTHLY',
                title: `Monthly Growth Report - ${formData.month}`,
                content: { ...formData }
            };

            await createMonthlyUpdate(payload);
            toast.success('Monthly update submitted successfully!');

            // Reset form (except month might be useful to keep if they want to adjust, but better reset)
            setFormData({
                month: new Date().toISOString().slice(0, 7),
                goalsPlanned: '',
                goalsAchieved: '',
                keyContributions: '',
                learnings: '',
                risks: '',
                nextMonthGoals: ''
            });

            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error('Error submitting monthly update:', error);
            toast.error(error.message || 'Failed to submit monthly update');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-indigo-500/10 overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <span className="p-2 bg-indigo-500/10 rounded-lg">
                            <CalendarDays className="h-6 w-6 text-indigo-600" />
                        </span>
                        Performance & Growth Report
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Document your journey, milestones, and strategic goals for the month.
                    </p>
                </CardHeader>

                <CardContent className="space-y-8">
                    <div className="flex flex-col sm:flex-row gap-6 p-4 bg-secondary/20 rounded-2xl border border-secondary/30">
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="month" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Reporting Month</Label>
                            <Input
                                id="month"
                                type="month"
                                value={formData.month}
                                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                className="bg-background font-bold border-indigo-500/20"
                                required
                            />
                        </div>
                        <div className="flex-[2] flex items-center">
                            <p className="text-xs text-muted-foreground italic">
                                Tip: Monthly reports are critical for performance reviews. Be specific about outcomes.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="goalsPlanned" className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                <Target className="h-4 w-4" /> Goals Planned
                            </Label>
                            <Textarea
                                id="goalsPlanned"
                                placeholder="What were the primary objectives for this month?"
                                value={formData.goalsPlanned}
                                onChange={(e) => setFormData({ ...formData, goalsPlanned: e.target.value })}
                                className="min-h-[120px] resize-none focus:ring-indigo-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="goalsAchieved" className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                                <Rocket className="h-4 w-4" /> Goals Achieved *
                            </Label>
                            <Textarea
                                id="goalsAchieved"
                                placeholder="What results were delivered?"
                                value={formData.goalsAchieved}
                                onChange={(e) => setFormData({ ...formData, goalsAchieved: e.target.value })}
                                className="min-h-[120px] resize-none focus:ring-indigo-500 rounded-xl border-indigo-500/30"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="keyContributions" className="flex items-center gap-2 text-sm font-bold text-purple-600">
                            <Rocket className="h-4 w-4" /> Strategic Contributions *
                        </Label>
                        <Textarea
                            id="keyContributions"
                            placeholder="Highlight significant impact on projects or team processes."
                            value={formData.keyContributions}
                            onChange={(e) => setFormData({ ...formData, keyContributions: e.target.value })}
                            className="min-h-[100px] resize-none focus:ring-purple-500 rounded-xl border-purple-500/30"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="learnings" className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                                <Brain className="h-4 w-4" /> Growth & Learnings
                            </Label>
                            <Textarea
                                id="learnings"
                                placeholder="What new skills or knowledge did you acquire?"
                                value={formData.learnings}
                                onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                                className="min-h-[100px] resize-none focus:ring-emerald-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="risks" className="flex items-center gap-2 text-sm font-bold text-rose-600">
                                <AlertTriangle className="h-4 w-4" /> Blockers & Risks
                            </Label>
                            <Textarea
                                id="risks"
                                placeholder="What hindered your progress or poses a future risk?"
                                value={formData.risks}
                                onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
                                className="min-h-[100px] resize-none focus:ring-rose-500 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <Label htmlFor="nextMonthGoals" className="flex items-center gap-2 text-sm font-bold text-blue-600">
                            <FastForward className="h-4 w-4" /> Next Month Objectives
                        </Label>
                        <Textarea
                            id="nextMonthGoals"
                            placeholder="What are the key priorities for the upcoming month?"
                            value={formData.nextMonthGoals}
                            onChange={(e) => setFormData({ ...formData, nextMonthGoals: e.target.value })}
                            className="min-h-[100px] resize-none focus:ring-blue-500 rounded-xl bg-blue-50/10"
                        />
                    </div>
                </CardContent>

                <CardFooter className="bg-secondary/10 border-t border-border/50 py-6">
                    <Button
                        type="submit"
                        className="w-full sm:w-auto ml-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 px-10 rounded-2xl shadow-xl shadow-indigo-500/20"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Authorize & Submit Monthly Report'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default MonthlyUpdateForm;
