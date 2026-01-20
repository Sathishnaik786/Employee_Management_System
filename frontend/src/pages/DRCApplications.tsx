import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataGrid } from '@/components/data-grid/DataGrid';
import { ColumnConfig } from '@/components/data-grid/types';
import { PhDApplication } from '@/types';
import { phdApi } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function DRCApplications() {
    const [applications, setApplications] = useState<PhDApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await phdApi.getAll();
            if (res.success) {
                setApplications(res.data);
            }
        } catch (err: any) {
            toast.error('Failed to load PhD applications queue');
        } finally {
            setLoading(false);
        }
    };

    const handleScrutinize = async (id: string) => {
        try {
            setActionLoading(id);
            const res = await phdApi.startScrutiny(id);
            if (res.success) {
                toast.success('Scrutiny protocol initiated');
                navigate(`/app/iers/drc/scrutiny/${id}`);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to initiate scrutiny');
        } finally {
            setActionLoading(null);
        }
    };

    const columns: ColumnConfig<PhDApplication>[] = [
        {
            id: 'application_no',
            label: 'App ID',
            accessor: (row) => <span className="font-mono font-bold text-primary">{row.application_no}</span>
        },
        {
            id: 'student_name',
            label: 'Applicant',
            accessor: (row) => <span className="font-semibold">{row.student_name || row.student?.fullName || 'N/A'}</span>
        },
        {
            id: 'research_area',
            label: 'Research Area',
            accessor: (row) => <span className="text-xs opacity-70">{(row as any).research_interest || row.research_area}</span>
        },
        {
            id: 'status',
            label: 'Status',
            accessor: (row) => (
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter">
                    {row.status.replace('_', ' ')}
                </Badge>
            )
        },
        {
            id: 'actions',
            label: 'Gate Control',
            accessor: (row) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/app/iers/drc/applications/${row.id}`)}
                        disabled={!!actionLoading}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    {row.status === 'SUBMITTED' && (
                        <Button
                            variant="premium"
                            size="sm"
                            className="h-8 text-[9px] uppercase font-black"
                            onClick={() => handleScrutinize(row.id)}
                            disabled={!!actionLoading}
                        >
                            {actionLoading === row.id ? (
                                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1" />
                            ) : (
                                <FileSearch className="h-3 w-3 mr-1" />
                            )}
                            Scrutinize
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="p-8 space-y-8">
            <PageHeader
                title="DRC Application Queue"
                description="Monitor and manage Ph.D admissions lifecycle and institutional gates."
                className="bg-header-gradient p-10 rounded-[2.5rem] border border-white/10 shadow-premium"
            />

            <DataGrid
                title="Active Applications"
                columns={columns}
                data={applications}
                isLoading={loading}
                getRowId={(row) => row.id}
                page={1}
                totalPages={1}
                onPageChange={() => { }}
                sortBy="application_no"
                sortOrder="desc"
                onSortChange={() => { }}
            />
        </div>
    );
}
