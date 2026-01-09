import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createWeeklyUpdate } from './weeklyUpdates.api';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

interface WeeklyStandoutFormProps {
    onSuccess?: () => void;
}

const WeeklyStandoutForm: React.FC<WeeklyStandoutFormProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        achievements: '',
        plannedVsDone: '',
        challenges: '',
        nextWeekPlan: '',
        selfRating: '4',
        title: `Weekly Stand-out - Week ${new Date().toLocaleDateString()}`
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.achievements || !formData.plannedVsDone) {
            toast.error('Please fill in at least achievements and planned vs done fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                update_type: 'WEEKLY',
                title: formData.title,
                content: {
                    achievements: formData.achievements,
                    plannedVsDone: formData.plannedVsDone,
                    challenges: formData.challenges,
                    nextWeekPlan: formData.nextWeekPlan,
                    selfRating: parseInt(formData.selfRating)
                }
            };

            await createWeeklyUpdate(payload);
            toast.success('Weekly stand-out submitted successfully!');
            setFormData({
                achievements: '',
                plannedVsDone: '',
                challenges: '',
                nextWeekPlan: '',
                selfRating: '4',
                title: `Weekly Stand-out - Week ${new Date().toLocaleDateString()}`
            });
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error('Error submitting weekly update:', error);
            toast.error(error.message || 'Failed to submit weekly update');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto shadow-xl border-primary/10 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-indigo-500 to-purple-600" />
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Week End Stand-out
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        Reflect on your accomplishments and plan for the next cycle.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="achievements" className="text-sm font-bold uppercase tracking-wider text-primary">🏆 Key Achievements *</Label>
                            <Textarea
                                id="achievements"
                                placeholder="What are you most proud of this week?"
                                value={formData.achievements}
                                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                                className="min-h-[120px] resize-none focus:ring-primary border-primary/20"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="plannedVsDone" className="text-sm font-bold uppercase tracking-wider text-green-600">📊 Planned vs Completed *</Label>
                            <Textarea
                                id="plannedVsDone"
                                placeholder="What did you plan vs what actually got done?"
                                value={formData.plannedVsDone}
                                onChange={(e) => setFormData({ ...formData, plannedVsDone: e.target.value })}
                                className="min-h-[120px] resize-none focus:ring-green-500 border-green-500/20"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="challenges" className="text-sm font-bold uppercase tracking-wider text-amber-600">🚧 Challenges Encountered</Label>
                        <Textarea
                            id="challenges"
                            placeholder="Any roadblocks or lessons learned?"
                            value={formData.challenges}
                            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                            className="min-h-[100px] resize-none focus:ring-amber-500 border-amber-500/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nextWeekPlan" className="text-sm font-bold uppercase tracking-wider text-indigo-600">🔜 Next Week's Priorities</Label>
                        <Textarea
                            id="nextWeekPlan"
                            placeholder="What's the main focus for next week?"
                            value={formData.nextWeekPlan}
                            onChange={(e) => setFormData({ ...formData, nextWeekPlan: e.target.value })}
                            className="min-h-[100px] resize-none focus:ring-indigo-500 border-indigo-500/20"
                        />
                    </div>

                    <div className="pt-4 border-t border-border/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <Label className="text-sm font-bold">Self Rating</Label>
                                <p className="text-xs text-muted-foreground">How would you rate your performance this week?</p>
                            </div>
                            <Select
                                value={formData.selfRating}
                                onValueChange={(val) => setFormData({ ...formData, selfRating: val })}
                            >
                                <SelectTrigger className="w-[180px] border-primary/20">
                                    <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                                    <SelectItem value="4">⭐⭐⭐⭐ Great</SelectItem>
                                    <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                                    <SelectItem value="2">⭐⭐ Fair</SelectItem>
                                    <SelectItem value="1">⭐ Poor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-secondary/5 border-t border-border/50 pt-6">
                    <Button
                        type="submit"
                        className="w-full sm:w-auto ml-auto bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-8"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Post Weekly Stand-out'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default WeeklyStandoutForm;
