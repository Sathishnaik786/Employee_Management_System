import React, { useEffect, useState, useCallback } from 'react';
import { getMyMonthlyUpdates, getVisibleMonthlyUpdates } from './monthlyUpdates.api';
import MonthlyUpdateItem from './MonthlyUpdateItem';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, BookOpenCheck } from 'lucide-react';

const MonthlyUpdateList: React.FC = () => {
    const [updates, setUpdates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchUpdates = useCallback(async () => {
        setLoading(true);
        try {
            const [myRes, visibleRes] = await Promise.all([
                getMyMonthlyUpdates(),
                getVisibleMonthlyUpdates()
            ]);

            const allUpdates = [...(myRes.data || []), ...(visibleRes.data || [])];

            const uniqueUpdates = Array.from(new Map(allUpdates.map(u => [u.id, u])).values());
            const sortedUpdates = uniqueUpdates.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setUpdates(sortedUpdates);
        } catch (error) {
            console.error('Error fetching monthly updates:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUpdates();
    }, [fetchUpdates]);

    if (loading && updates.length === 0) {
        return (
            <div className="space-y-8 max-w-5xl mx-auto w-full">
                {[1, 2].map((i) => (
                    <div key={i} className="p-8 border rounded-3xl space-y-6 bg-card/60 animate-pulse border-indigo-500/5">
                        <div className="flex items-center gap-6">
                            <Skeleton className="h-16 w-16 rounded-2xl" />
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-64" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <Skeleton className="h-40 w-full rounded-2xl" />
                            <Skeleton className="h-40 w-full rounded-2xl" />
                        </div>
                        <Skeleton className="h-24 w-full rounded-2xl" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto w-full pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 px-2">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-3 text-foreground tracking-tight">
                        <BookOpenCheck className="h-8 w-8 text-indigo-600" />
                        Monthly Growth Registry
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 bg-indigo-500/5 px-3 py-1 rounded-full w-fit border border-indigo-500/10">
                        Historical Performance Backbone
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUpdates}
                    disabled={loading}
                    className="h-11 gap-3 rounded-2xl hover:bg-indigo-500/5 border-indigo-500/20 backdrop-blur-xl transition-all shadow-sm hover:shadow-indigo-500/10"
                >
                    <RefreshCw className={`h-4 w-4 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
                    <span className="font-black text-xs uppercase tracking-tighter">Sync Core Records</span>
                </Button>
            </div>

            {updates.length === 0 ? (
                <div className="text-center py-32 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/5 dark:to-purple-900/5 border-2 border-dashed border-indigo-500/10 rounded-[3rem] shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-slate-100/[0.03] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                    <div className="w-24 h-24 bg-card rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-8 ring-1 ring-border transition-transform group-hover:scale-110 duration-500">
                        <BookOpenCheck className="h-12 w-12 text-indigo-500/30" />
                    </div>
                    <h3 className="text-xl font-black text-foreground/80 tracking-tight">The Performance Vault is Empty</h3>
                    <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto font-medium leading-relaxed italic">
                        "Every legacy begins with the first documented milestone."
                    </p>
                    <p className="text-xs text-indigo-600 font-black uppercase tracking-[0.2em] mt-8 opacity-40">
                        No Monthly Reports Found
                    </p>
                </div>
            ) : (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    {updates.map((update) => (
                        <MonthlyUpdateItem
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

export default MonthlyUpdateList;
