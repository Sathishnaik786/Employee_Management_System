import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Inbox, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowItem {
    id: string;
    title: string;
    description: string;
    status: string;
    timestamp: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface WorkflowInboxProps {
    items: WorkflowItem[];
    onAction?: (id: string) => void;
    loading?: boolean;
}

export const WorkflowInbox: React.FC<WorkflowInboxProps> = ({
    items,
    onAction,
    loading = false
}) => {
    return (
        <Card className="border-border/40 shadow-premium bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden h-full">
            <CardHeader className="p-6 border-b border-border/10 bg-muted/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Inbox size={18} />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest">Protocol Inbox</CardTitle>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Pending Approval Workflow</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                        {items.length} Pending
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border/10">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div key={item.id} className="group p-5 hover:bg-muted/30 transition-all cursor-pointer flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h5 className="text-xs font-bold truncate text-foreground">{item.title}</h5>
                                        {item.priority === 'HIGH' && (
                                            <Badge className="h-4 text-[8px] bg-rose-500/10 text-rose-600 border-rose-500/20 uppercase font-black tracking-tighter">Urgent</Badge>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                                    <div className="flex items-center gap-3 mt-2 text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">
                                        <span className="flex items-center gap-1"><Clock size={10} /> {item.timestamp}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><AlertCircle size={10} /> {item.status}</span>
                                    </div>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                                    onClick={() => onAction?.(item.id)}
                                >
                                    <ChevronRight size={14} />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 rounded-full bg-muted/20 text-muted-foreground/30">
                                    <Inbox size={32} />
                                </div>
                            </div>
                            <h5 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Inbox Liquidated</h5>
                            <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-tight">No pending protocol approvals</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
