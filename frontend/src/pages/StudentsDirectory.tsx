import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useStudents } from '@/hooks/useStudents';
import { DataGrid } from '@/components/data-grid/DataGrid';
import { ColumnConfig } from '@/components/data-grid/types';
import { Student } from '@/types';
import { Mail, GraduationCap } from 'lucide-react';

export default function StudentsDirectory() {
    const { items, isLoading, meta, handlePageChange, handleSortChange, sort } = useStudents({ limit: 10 });

    const columns: ColumnConfig<Student>[] = [
        {
            id: 'fullName',
            label: 'Student Name',
            sortable: true,
            accessor: (row) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-black">
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
            id: 'studentId',
            label: 'Institutional ID',
            accessor: (row) => <span className="text-xs font-mono font-bold text-indigo-600">{row.studentId}</span>
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
            id: 'programType',
            label: 'Academic Program',
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <GraduationCap size={12} className="text-indigo-500/60" />
                    <span className="text-xs font-black uppercase tracking-widest">{row.programType}</span>
                </div>
            )
        },
    ];

    return (
        <div className="p-8 space-y-8">
            <PageHeader
                title="Student Registry"
                description="Comprehensive database of all enrolled students and research scholars."
                className="bg-header-gradient p-10 rounded-[2.5rem] border border-white/10 shadow-premium"
            />

            <DataGrid
                title="Enrolled Scholars"
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
