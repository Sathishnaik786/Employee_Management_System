import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { addDailyFeedback } from './dailyUpdates.api';
import { toast } from 'sonner';
import { MessageSquare, Send, Calendar } from 'lucide-react';

interface Feedback {
    id: string;
    from_user_id: string;
    comment: string;
    created_at: string;
}

interface DailyStandupItemProps {
    update: {
        id: string;
        user_id: string;
        title: string;
        content: {
            yesterday: string;
            today: string;
            blockers?: string;
        };
        created_at: string;
        feedback?: Feedback[];
    };
    currentUser: any;
    onFeedbackAdded?: () => void;
}

const DailyStandupItem: React.FC<DailyStandupItemProps> = ({ update, currentUser, onFeedbackAdded }) => {
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleAddFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            await addDailyFeedback(update.id, comment);
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

    return (
        <Card className="mb-6 overflow-hidden border-primary/5 hover:border-primary/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${update.user_id}`} />
                    <AvatarFallback>{update.user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            {isOwnUpdate ? 'Your Update' : `Update from ${update.user_id.substring(0, 8)}`}
                            {isOwnUpdate && <Badge variant="secondary" className="text-[10px] h-4">Owner</Badge>}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                        </p>
                    </div>
                    <Badge variant="outline" className="w-fit text-[11px] font-medium bg-secondary/30">
                        Daily Standup
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-2 pb-4 space-y-4">
                {update.content.yesterday && (
                    <div>
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Yesterday</h4>
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{update.content.yesterday}</p>
                    </div>
                )}

                {update.content.today && (
                    <div>
                        <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Today</h4>
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{update.content.today}</p>
                    </div>
                )}

                {update.content.blockers && (
                    <div className="bg-destructive/5 p-3 rounded-lg border border-destructive/10">
                        <h4 className="text-xs font-bold text-destructive uppercase tracking-wider mb-1">Blockers</h4>
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{update.content.blockers}</p>
                    </div>
                )}
            </CardContent>

            <Separator className="opacity-50" />

            <CardFooter className="flex flex-col items-stretch p-3 bg-secondary/5">
                <div className="flex items-center justify-between mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 gap-2 hover:bg-primary/5"
                        onClick={() => setShowFeedback(!showFeedback)}
                    >
                        <MessageSquare className="h-4 w-4" />
                        {update.feedback?.length || 0} Comments
                    </Button>
                </div>

                {showFeedback && (
                    <div className="space-y-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        {update.feedback?.map((fb) => (
                            <div key={fb.id} className="flex gap-3 bg-background/50 p-3 rounded-lg">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fb.from_user_id}`} />
                                    <AvatarFallback>{fb.from_user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                            {fb.from_user_id.substring(0, 8)}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground italic">
                                            {formatDistanceToNow(new Date(fb.created_at))} ago
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/80">{fb.comment}</p>
                                </div>
                            </div>
                        ))}

                        {!isOwnUpdate && (
                            <form onSubmit={handleAddFeedback} className="flex gap-2 mt-4">
                                <Input
                                    placeholder="Ask a question or give feedback..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="text-sm h-9 h-9 focus-visible:ring-primary"
                                    disabled={submitting}
                                />
                                <Button size="sm" type="submit" disabled={submitting || !comment.trim()} className="h-9 px-4">
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

export default DailyStandupItem;
