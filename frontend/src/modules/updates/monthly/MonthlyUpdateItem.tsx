import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format, parseISO } from 'date-fns';
import { addMonthlyFeedback } from './monthlyUpdates.api';
import { toast } from 'sonner';
import { MessageSquare, Send, Calendar, Target, Rocket, Lightbulb, AlertOctagon, TrendingUp, UserCheck } from 'lucide-react';

interface Feedback {
    id: string;
    from_user_id: string;
    comment: string;
    created_at: string;
}

interface MonthlyUpdateItemProps {
    update: {
        id: string;
        user_id: string;
        title: string;
        content: {
            month: string;
            goalsPlanned?: string;
            goalsAchieved: string;
            keyContributions: string;
            learnings?: string;
            risks?: string;
            nextMonthGoals?: string;
        };
        created_at: string;
        feedback?: Feedback[];
    };
    currentUser: any;
    onFeedbackAdded?: () => void;
}

const MonthlyUpdateItem: React.FC<MonthlyUpdateItemProps> = ({ update, currentUser, onFeedbackAdded }) => {
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleAddFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            await addMonthlyFeedback(update.id, comment);
            setComment('');
            toast.success('Professional review added');
            if (onFeedbackAdded) onFeedbackAdded();
        } catch (error: any) {
            toast.error(error.message || 'Failed to add feedback');
        } finally {
            setSubmitting(false);
        }
    };

    const isOwnUpdate = update.user_id === currentUser?.id;

    const displayMonth = update.content.month
        ? format(parseISO(`${update.content.month}-01`), 'MMMM yyyy')
        : 'Unknown Date';

    return (
        <Card className="mb-10 overflow-hidden border border-indigo-500/10 shadow-xl bg-card transition-all hover:shadow-2xl hover:border-indigo-500/30">
            <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <CardHeader className="flex flex-row items-center gap-5 pb-6 bg-secondary/5">
                <Avatar className="h-14 w-14 ring-4 ring-indigo-500/10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${update.user_id}`} />
                    <AvatarFallback>{update.user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="text-xl font-black text-foreground tracking-tight">
                                {isOwnUpdate ? 'Your Performance Review' : `Monthly Alignment - ${update.user_id.substring(0, 8)}`}
                            </h3>
                            <p className="text-sm font-bold text-indigo-600 flex items-center gap-1.5 mt-1">
                                <Calendar className="h-4 w-4" />
                                Reporting Cycle: {displayMonth}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge className="bg-indigo-600 font-black px-4 py-1 text-[10px] tracking-widest uppercase">Monthly</Badge>
                            {isOwnUpdate && (
                                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                    <UserCheck className="h-3 w-3" /> Certified Report
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="py-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <Target className="h-3.5 w-3.5 text-slate-400" /> Planned Objectives
                        </h4>
                        <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 text-sm italic text-foreground/70 leading-relaxed min-h-[80px]">
                            {update.content.goalsPlanned || 'No specific goals were documented for this period.'}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                            <Rocket className="h-3.5 w-3.5" /> Delivered Outcomes
                        </h4>
                        <div className="p-4 bg-indigo-50/10 dark:bg-indigo-900/10 rounded-2xl border border-indigo-200 dark:border-indigo-800/30 text-sm font-medium text-foreground leading-relaxed min-h-[80px]">
                            {update.content.goalsAchieved}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 flex items-center gap-2 px-1">
                        <TrendingUp className="h-3.5 w-3.5" /> Strategic Value Added
                    </h4>
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-2xl border border-purple-200 dark:border-purple-800/30 text-sm text-foreground leading-relaxed font-semibold">
                        {update.content.keyContributions}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/30">
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-2">
                            <Lightbulb className="h-3.5 w-3.5" /> Capabilities Gained
                        </h4>
                        <p className="text-sm text-foreground/80 leading-relaxed border-l-2 border-emerald-200 dark:border-emerald-800 pl-4">
                            {update.content.learnings || 'N/A'}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 flex items-center gap-2">
                            <AlertOctagon className="h-3.5 w-3.5" /> Risk Analysis
                        </h4>
                        <p className="text-sm text-foreground/80 leading-relaxed border-l-2 border-rose-200 dark:border-rose-800 pl-4">
                            {update.content.risks || 'No critical risks identified.'}
                        </p>
                    </div>
                </div>

                {update.content.nextMonthGoals && (
                    <div className="mt-6 p-4 bg-secondary/30 rounded-2xl border border-secondary dashed">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Upcoming Targets</h4>
                        <p className="text-sm text-foreground/90 font-medium italic">
                            " {update.content.nextMonthGoals} "
                        </p>
                    </div>
                )}
            </CardContent>

            <Separator className="opacity-30" />

            <CardFooter className="flex flex-col items-stretch p-6 bg-secondary/5">
                <div className="flex items-center justify-between mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-9 gap-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-black text-indigo-600 transition-all uppercase tracking-tighter"
                        onClick={() => setShowFeedback(!showFeedback)}
                    >
                        <MessageSquare className="h-4 w-4" />
                        {update.feedback?.length || 0} Peer / Management Reviews
                    </Button>
                    <p className="text-[10px] text-muted-foreground font-medium tabular-nums">
                        Archived {format(new Date(update.created_at), 'PPP')}
                    </p>
                </div>

                {showFeedback && (
                    <div className="space-y-5 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        {update.feedback?.map((fb) => (
                            <div key={fb.id} className="flex gap-4 p-5 bg-background border border-border/50 rounded-2xl shadow-sm transition-all hover:border-indigo-500/20">
                                <Avatar className="h-9 w-9 border-2 border-secondary/50">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fb.from_user_id}`} />
                                    <AvatarFallback>{fb.from_user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
                                            Reviewer ID: {fb.from_user_id.substring(0, 8)}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground italic">
                                            {format(new Date(fb.created_at), 'MM/dd HH:mm')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/90 leading-normal">{fb.comment}</p>
                                </div>
                            </div>
                        ))}

                        {!isOwnUpdate && (
                            <form onSubmit={handleAddFeedback} className="flex gap-3 mt-4 pt-4 border-t border-border/50">
                                <Input
                                    placeholder="Provide a performance review or recognition..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="text-sm h-12 rounded-2xl focus-visible:ring-indigo-500 border-indigo-500/20 bg-background/50 shadow-inner"
                                    disabled={submitting}
                                />
                                <Button size="sm" type="submit" disabled={submitting || !comment.trim()} className="h-12 px-8 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </form>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

export default MonthlyUpdateItem;
