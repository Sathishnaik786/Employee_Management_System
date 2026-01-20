import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useFaculty } from '@/hooks/useFaculty';
import { DataGrid } from '@/components/data-grid/DataGrid';
import { ColumnConfig } from '@/components/data-grid/types';
import { Faculty } from '@/types';
import { GraduationCap, Mail, Briefcase } from 'lucide-react';

export default function FacultyDirectory() {
    const { items, isLoading, meta, handlePageChange, handleSortChange, sort } = useFaculty({ limit: 10 });

    const columns: ColumnConfig<Faculty>[] = [
        {
            id: 'fullName',
            label: 'Faculty Member',
            sortable: true,
            accessor: (row) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                        {row.fullName[0]}
                    </div>
                    <div>
                        <p className="font-bold">{row.fullName}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium italic">
                            <Mail size={10} /> {row.email}
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'facultyId',
            label: 'Institutional ID',
            accessor: (row) => <span className="text-xs font-mono font-bold text-primary">{row.facultyId}</span>
        },
        {
            id: 'department',
            label: 'Department',
            sortable: true,
            accessor: (row) => (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted/40 text-[10px] font-black tracking-wider text-muted-foreground border border-border/30 uppercase">
                    {row.department}
                </div>
            )
        },
        {
            id: 'expertise',
            label: 'Expertise',
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <Briefcase size={12} className="text-primary/60" />
                    <span className="text-xs font-medium">{row.expertise}</span>
                </div>
            )
        },
    ];

    return (
        <div className="p-8 space-y-8">
            <PageHeader
                title="Faculty Directory"
                description="Manage and view institutional faculty profiles and research supervisors."
                className="bg-header-gradient p-10 rounded-[2.5rem] border border-white/10 shadow-premium"
            />

            <DataGrid
                title="Institutional Faculty"
                columns={columns}
                data={items || []}
                isLoading={isLoading}
                getRowId={(row) => row.id}
                page={meta?.page || 1}
                totalPages={meta?.totalPages || 1}
                onPageChange={handlePageChange}
                sortBy={sort.sortBy}
                sortOrder={sort.sortOrder}
                onSortChange={handleSortChange}
            />
        </div>
    );
}
