import React, { useEffect, useState } from 'react';
import { getTeamAnalytics } from './analytics.api';
import { ProgressCard } from './ProgressCards';
import { ConsistencyChart } from './ConsistencyChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, LayoutList, Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ManagerTeamDashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getTeamAnalytics();
                setData(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="space-y-8 animate-pulse"><Skeleton className="h-64 w-full rounded-3xl" /></div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProgressCard
                    title="Team Size"
                    value={data?.uniqueContributors || 0}
                    subtitle="Active contributors"
                    icon={Users}
                    colorClass="bg-blue-500"
                />
                <ProgressCard
                    title="Team Output"
                    value={data?.totalUpdates || 0}
                    subtitle="Total reports submitted"
                    icon={LayoutList}
                    colorClass="bg-indigo-600"
                />
                <ProgressCard
                    title="Compliance"
                    value="94%"
                    subtitle="Average submission rate"
                    icon={Trophy}
                    colorClass="bg-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ConsistencyChart data={data?.byType} />

                <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl group">
                    <CardHeader>
                        <CardTitle className="text-lg font-black tracking-tight uppercase">Team Engagement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-6 bg-secondary/20 rounded-2xl border border-secondary/30">
                            <h4 className="text-sm font-black text-muted-foreground uppercase mb-4">Engagement Insights</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center justify-between text-sm">
                                    <span className="font-bold">Daily Logs Momentum</span>
                                    <span className="text-indigo-500 font-black">{data?.byType?.DAILY || 0} logs</span>
                                </li>
                                <li className="flex items-center justify-between text-sm">
                                    <span className="font-bold">Weekly Reflection Rate</span>
                                    <span className="text-emerald-500 font-black">{data?.byType?.WEEKLY || 0} reports</span>
                                </li>
                                <li className="flex items-center justify-between text-sm">
                                    <span className="font-bold">Monthly Strategy Syncs</span>
                                    <span className="text-purple-500 font-black">{data?.byType?.MONTHLY || 0} reports</span>
                                </li>
                            </ul>
                        </div>
                        <p className="text-xs text-muted-foreground italic text-center">
                            Team data is aggregated based on employees reporting directly to you.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ManagerTeamDashboard;
