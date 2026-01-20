import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { slideUpVariants } from '@/animations/motionVariants';
import { ShieldAlert, Search, Filter, Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminAudit() {
    const [logs, setLogs] = useState([
        { id: 1, action: 'ROLE_CHANGED', user: 'Admin', module: 'Auth', entityId: 'U-101', timestamp: '2026-01-15 12:00:03', details: 'Sneha Patel promoted to RECRUITER' },
        { id: 2, action: 'PERMISSION_UPDATED', user: 'Admin', module: 'RBAC', entityId: 'P-502', timestamp: '2026-01-15 11:45:12', details: 'Added NAAC readiness view to IQAC_MEMBER' },
        { id: 3, action: 'WORKFLOW_MODIFIED', user: 'Admin', module: 'Workflow', entityId: 'W-01', timestamp: '2026-01-15 11:30:45', details: 'PhD Scrutiny timeout adjusted to 15 days' },
        { id: 4, action: 'SECURITY_ALERT', user: 'System', module: 'Auth', entityId: 'IP-192.168.1.1', timestamp: '2026-01-15 10:20:11', details: 'Rate limit triggered for /api/auth/login' },
    ]);

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
            <motion.div variants={slideUpVariants} initial="initial" animate="animate">
                <PageHeader
                    title="Centralized Audit Trail"
                    description="Immutable record of all system-wide administrative and security events."
                    className="bg-header-gradient p-10 rounded-[2.5rem] border border-white/10 shadow-premium"
                />
            </motion.div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-12">
                    <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-premium rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-6">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-6 h-6 text-primary" />
                                <CardTitle className="text-xl font-bold tracking-tight">System Logs</CardTitle>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input className="pl-10 w-64 bg-white/50 border-white/20" placeholder="Filter logs..." />
                                </div>
                                <Filter className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-black text-muted-foreground border-b border-white/10">
                                        <tr>
                                            <th className="px-6 py-4">Timestamp</th>
                                            <th className="px-6 py-4">Action</th>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Module</th>
                                            <th className="px-6 py-4">Target ID</th>
                                            <th className="px-6 py-4">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-primary/5 transition-colors group">
                                                <td className="px-6 py-4 text-xs font-medium text-slate-500">{log.timestamp}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${log.action.includes('SECURITY') ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold">{log.user}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{log.module}</td>
                                                <td className="px-6 py-4 text-xs font-mono text-slate-400">{log.entityId}</td>
                                                <td className="px-6 py-4 text-sm text-slate-700">{log.details}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
