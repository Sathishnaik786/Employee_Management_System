import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, Calendar, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: LucideIcon;
    trend?: string;
    colorClass: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
    title, value, subtitle, icon: Icon, trend, colorClass
}) => (
    <Card className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-xl group hover:shadow-2xl transition-all duration-500">
        <CardContent className="p-6 relative">
            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full -mr-16 -mt-16 transition-all duration-700 group-hover:opacity-20", colorClass)} />

            <div className="flex items-start justify-between">
                <div className="space-y-4">
                    <div className="p-2.5 rounded-xl bg-secondary/50 w-fit">
                        <Icon className={cn("h-5 w-5", colorClass.replace('bg-', 'text-'))} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">{title}</h3>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-black tracking-tighter">{value}</span>
                            {trend && (
                                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                    <TrendingUp className="h-2.5 w-2.5" /> {trend}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mt-1">{subtitle}</p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

interface ProgressCardsProps {
    data: any;
}

export const ProgressCards: React.FC<ProgressCardsProps> = ({ data }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProgressCard
                title="Total Reports"
                value={data?.total || 0}
                subtitle="Across all types"
                icon={Calendar}
                colorClass="bg-indigo-500"
            />
            <ProgressCard
                title="Daily Synergy"
                value={`${data?.streak || 0} Days`}
                subtitle="Current active streak"
                icon={Zap}
                trend={data?.streak > 0 ? "Active" : "New"}
                colorClass="bg-amber-500"
            />
            <ProgressCard
                title="Weekly Impact"
                value={data?.weekly || 0}
                subtitle="Strategic reflection"
                icon={TrendingUp}
                colorClass="bg-emerald-500"
            />
            <ProgressCard
                title="Monthly Mastery"
                value={data?.monthly || 0}
                subtitle="Historical records"
                icon={Award}
                colorClass="bg-purple-500"
            />
        </div>
    );
};
