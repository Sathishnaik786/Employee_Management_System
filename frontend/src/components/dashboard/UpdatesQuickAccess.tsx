import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    ClipboardList,
    LayoutTemplate,
    BookOpenCheck,
    BarChart3,
    Cpu,
    ArrowRight
} from 'lucide-react';

export const UpdatesQuickAccess: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            id: 'daily',
            title: 'Daily Update',
            icon: ClipboardList,
            href: '/app/updates/daily',
            enabled: import.meta.env.VITE_ENABLE_DAILY_UPDATES === 'true',
            color: 'text-blue-500'
        },
        {
            id: 'weekly',
            title: 'Weekly Report',
            icon: LayoutTemplate,
            href: '/app/updates/weekly',
            enabled: import.meta.env.VITE_ENABLE_WEEKLY_UPDATES === 'true',
            color: 'text-emerald-500'
        },
        {
            id: 'monthly',
            title: 'Monthly Review',
            icon: BookOpenCheck,
            href: '/app/updates/monthly',
            enabled: import.meta.env.VITE_ENABLE_MONTHLY_UPDATES === 'true',
            color: 'text-purple-500'
        },
        {
            id: 'analytics',
            title: 'Analytics',
            icon: BarChart3,
            href: '/app/updates/analytics',
            enabled: import.meta.env.VITE_ENABLE_UPDATE_ANALYTICS === 'true',
            color: 'text-amber-500'
        },
        {
            id: 'automation',
            title: 'Intelligence',
            icon: Cpu,
            href: '/app/updates/automation',
            enabled: (
                import.meta.env.VITE_ENABLE_UPDATE_REMINDERS === 'true' ||
                import.meta.env.VITE_ENABLE_AI_SUMMARIES === 'true' ||
                import.meta.env.VITE_ENABLE_EXPORTS === 'true'
            ),
            color: 'text-indigo-500'
        }
    ].filter(f => f.enabled);

    if (features.length === 0) return null;

    return (
        <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-black tracking-tight uppercase flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Quick Reporting
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {features.map((feature) => (
                        <Button
                            key={feature.id}
                            variant="outline"
                            className="h-auto py-6 flex-col gap-3 rounded-2xl border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all group"
                            onClick={() => navigate(feature.href)}
                        >
                            <div className={`p-2 rounded-xl bg-background shadow-sm transition-transform group-hover:scale-110`}>
                                <feature.icon className={`h-5 w-5 ${feature.color}`} />
                            </div>
                            <div className="text-center">
                                <span className="block text-xs font-black uppercase tracking-widest text-slate-900/80 dark:text-white/80 group-hover:text-primary transition-colors">{feature.title}</span>
                                <ArrowRight className="h-3 w-3 mx-auto mt-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                            </div>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
