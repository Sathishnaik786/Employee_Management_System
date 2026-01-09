import React, { useEffect, useState } from 'react';
import { getMyAnalytics } from './analytics.api';
import { ProgressCards } from './ProgressCards';
import { ConsistencyChart } from './ConsistencyChart';
import { TrendChart } from './TrendChart';
import { Skeleton } from '@/components/ui/skeleton';

const EmployeeProgressDashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getMyAnalytics();
                setData(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return (
        <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-3xl" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="h-[400px] rounded-3xl" />
                <Skeleton className="h-[400px] rounded-3xl" />
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            <ProgressCards data={data} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ConsistencyChart data={data} />
                <TrendChart recentUpdates={data?.recent || []} />
            </div>
        </div>
    );
};

export default EmployeeProgressDashboard;
