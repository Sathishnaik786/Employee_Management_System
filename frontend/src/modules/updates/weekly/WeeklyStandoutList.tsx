import React, { useEffect, useState, useCallback } from 'react';
import { getMyWeeklyUpdates, getVisibleWeeklyUpdates } from './weeklyUpdates.api';
import WeeklyStandoutItem from './WeeklyStandoutItem';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, LayoutTemplate } from 'lucide-react';

const WeeklyStandoutList: React.FC = () => {
    const [updates, setUpdates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchUpdates = useCallback(async () => {
        setLoading(true);
        try {
            const [myRes, visibleRes] = await Promise.all([
                getMyWeeklyUpdates(),
                getVisibleWeeklyUpdates()
            ]);

            const allUpdates = [...(myRes.data || []), ...(visibleRes.data || [])];

            // Filter unique by ID (though backend should handle visible appropriately)
            const uniqueUpdates = Array.from(new Map(allUpdates.map(u => [u.id, u])).values());
            const sortedUpdates = uniqueUpdates.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setUpdates(sortedUpdates);
        } catch (error) {
            console.error('Error fetching weekly updates:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUpdates();
    }, [fetchUpdates]);

    if (loading && updates.length === 0) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto w-full">
                {[1, 2].map((i) => (
                    <div key={i} className="p-6 border rounded-2xl space-y-6 bg-card animate-pulse shadow-sm">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-32 w-full rounded-xl" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                        </div>
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                    <h2 className="text-xl font-black flex items-center gap-2 text-foreground">
                        <LayoutTemplate className="h-6 w-6 text-primary" />
                        Weekly Stand-outs
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Impact Reports from the team</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUpdates}
                    disabled={loading}
                    className="h-9 gap-2 rounded-xl hover:bg-primary/5 border-primary/20 backdrop-blur-sm"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Registry
                </Button>
            </div>

            {updates.length === 0 ? (
                <div className="text-center py-24 bg-gradient-to-br from-secondary/5 to-primary/5 border-2 border-dashed border-primary/10 rounded-[2rem] shadow-inner">
                    <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
                        <LayoutTemplate className="h-8 w-8 text-primary/40" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground/80">The weekly archive is empty</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto font-medium leading-relaxed">
                        No weekly stand-outs have been submitted yet. Be the first to wrap up the week!
                    </p>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    {updates.map((update) => (
                        <WeeklyStandoutItem
                            key={update.id}
                            update={update}
                            currentUser={user}
                            onFeedbackAdded={fetchUpdates}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeeklyStandoutList;
