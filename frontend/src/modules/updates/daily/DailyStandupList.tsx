import React, { useEffect, useState, useCallback } from 'react';
import { getMyDailyUpdates, getVisibleDailyUpdates } from './dailyUpdates.api';
import DailyStandupItem from './DailyStandupItem';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, LayoutList } from 'lucide-react';

const DailyStandupList: React.FC = () => {
    const [updates, setUpdates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchUpdates = useCallback(async () => {
        setLoading(true);
        try {
            const [myRes, visibleRes] = await Promise.all([
                getMyDailyUpdates(),
                getVisibleDailyUpdates()
            ]);

            const allUpdates = [...(myRes.data || []), ...(visibleRes.data || [])];

            // Filter out duplicates (if any) and sort by date desc
            const uniqueUpdates = Array.from(new Map(allUpdates.map(u => [u.id, u])).values());
            const sortedUpdates = uniqueUpdates.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setUpdates(sortedUpdates);
        } catch (error) {
            console.error('Error fetching updates:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUpdates();
    }, [fetchUpdates]);

    if (loading && updates.length === 0) {
        return (
            <div className="space-y-4 max-w-2xl mx-auto w-full">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-xl space-y-4 bg-card">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-foreground/80">
                    <LayoutList className="h-5 w-5 text-primary" />
                    Recent Daily Logs
                </h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUpdates}
                    disabled={loading}
                    className="h-8 gap-2 rounded-full hover:bg-primary/5 border-primary/20"
                >
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {updates.length === 0 ? (
                <div className="text-center py-20 bg-secondary/5 border-2 border-dashed border-primary/10 rounded-3xl">
                    <p className="text-muted-foreground text-sm">No daily updates found.</p>
                    <p className="text-xs text-muted-foreground mt-1">Be the first to share what you're working on!</p>
                </div>
            ) : (
                <div className="space-y-2 animate-in fade-in duration-500">
                    {updates.map((update) => (
                        <DailyStandupItem
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

export default DailyStandupList;
