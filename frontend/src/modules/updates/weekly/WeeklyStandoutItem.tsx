import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { addWeeklyFeedback } from './weeklyUpdates.api';
import { toast } from 'sonner';
import { MessageSquare, Send, Calendar, Star, Trophy, Target, Ban, ArrowRight } from 'lucide-react';

interface Feedback {
    id: string;
    from_user_id: string;
    comment: string;
    created_at: string;
}

interface WeeklyStandoutItemProps {
    update: {
        id: string;
        user_id: string;
        title: string;
        content: {
            achievements: string;
            plannedVsDone: string;
            challenges?: string;
            nextWeekPlan?: string;
            selfRating: number;
        };
        created_at: string;
        feedback?: Feedback[];
    };
    currentUser: any;
    onFeedbackAdded?: () => void;
}

const WeeklyStandoutItem: React.FC<WeeklyStandoutItemProps> = ({ update, currentUser, onFeedbackAdded }) => {
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleAddFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            await addWeeklyFeedback(update.id, comment);
            setComment('');
            toast.success('Feedback added');
            if (onFeedbackAdded) onFeedbackAdded();
        } catch (error: any) {
            toast.error(error.message || 'Failed to add feedback');
        } finally {
            setSubmitting(false);
        }
    };

    const isOwnUpdate = update.user_id === currentUser?.id;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`h-3 w-3 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'}`}
            />
        ));
    };

    return (
        <Card className="mb-8 overflow-hidden border-2 border-primary/5 hover:border-primary/10 transition-all duration-300 group shadow-md hover:shadow-xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 to-indigo-500/40" />
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm transition-transform group-hover:scale-105">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${update.user_id}`} />
                    <AvatarFallback>{update.user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                            {isOwnUpdate ? 'Your Weekly Review' : `Weekly Stand-out - ${update.user_id.substring(0, 8)}`}
                            {isOwnUpdate && <Badge variant="secondary" className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">Author</Badge>}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            Published {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-primary hover:bg-primary font-bold px-3 py-1">WEEKLY</Badge>
                        <div className="flex gap-0.5">{renderStars(update.content.selfRating)}</div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-2 pb-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-2 text-primary">
                            <Trophy className="h-4 w-4" />
                            <h4 className="text-xs font-black uppercase tracking-widest">Achievements</h4>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{update.content.achievements}</p>
                    </div>

                    <div className="space-y-3 bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                            <Target className="h-4 w-4" />
                            <h4 className="text-xs font-black uppercase tracking-widest">Planned vs Done</h4>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{update.content.plannedVsDone}</p>
                    </div>
                </div>

                {update.content.challenges && (
                    <div className="space-y-2 px-1">
                        <div className="flex items-center gap-2 text-amber-600">
                            <Ban className="h-3 w-3" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Challenges</h4>
                        </div>
                        <p className="text-sm text-foreground/80 pl-5 border-l-2 border-amber-200 dark:border-amber-900/50">{update.content.challenges}</p>
                    </div>
                )}

                {update.content.nextWeekPlan && (
                    <div className="space-y-2 px-1">
                        <div className="flex items-center gap-2 text-indigo-500">
                            <ArrowRight className="h-3 w-3" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Next Week</h4>
                        </div>
                        <p className="text-sm text-foreground/80 pl-5 border-l-2 border-indigo-200 dark:border-indigo-900/50 font-medium italic">{update.content.nextWeekPlan}</p>
                    </div>
                )}
            </CardContent>

            <Separator className="opacity-50" />

            <CardFooter className="flex flex-col items-stretch p-4 bg-secondary/5">
                <div className="flex items-center justify-between mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 gap-2 hover:bg-primary/5 font-bold"
                        onClick={() => setShowFeedback(!showFeedback)}
                    >
                        <MessageSquare className="h-4 w-4" />
                        {update.feedback?.length || 0} Professional Feedback
                    </Button>
                </div>

                {showFeedback && (
                    <div className="space-y-4 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {update.feedback?.map((fb) => (
                            <div key={fb.id} className="flex gap-3 bg-background/80 p-4 rounded-xl border border-border/50 shadow-sm relative">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fb.from_user_id}`} />
                                    <AvatarFallback>{fb.from_user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black text-muted-foreground tracking-tighter uppercase">
                                            User {fb.from_user_id.substring(0, 8)}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground tabular-nums">
                                            {formatDistanceToNow(new Date(fb.created_at))} ago
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/80 leading-snug">{fb.comment}</p>
                                </div>
                            </div>
                        ))}

                        {!isOwnUpdate && (
                            <form onSubmit={handleAddFeedback} className="flex gap-2 mt-2 sticky bottom-0 bg-transparent py-2">
                                <Input
                                    placeholder="Share a thought or congratulations..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="text-sm h-10 rounded-xl focus-visible:ring-primary border-primary/20 bg-background"
                                    disabled={submitting}
                                />
                                <Button size="sm" type="submit" disabled={submitting || !comment.trim()} className="h-10 px-6 rounded-xl shadow-md">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

export default WeeklyStandoutItem;
