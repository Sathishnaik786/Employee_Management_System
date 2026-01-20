import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Settings2,
    Check,
    AlertCircle,
    Search,
    Layers,
    Maximize2,
    Minimize2,
    StretchHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { ColumnConfig, DataGridProps, DensityMode } from './types';
import { Skeleton } from '@/components/ui/skeleton';
import { Can } from '@/access/Can';

const STYLES_BY_DENSITY = {
    compact: {
        cell: "py-2 px-3 text-xs",
        header: "h-9 px-3 text-[10px]",
        icon: 14
    },
    standard: {
        cell: "py-4 px-6 text-sm",
        header: "h-12 px-6 text-xs",
        icon: 16
    },
    comfortable: {
        cell: "py-6 px-8 text-base",
        header: "h-16 px-8 text-sm",
        icon: 18
    }
};

export function DataGrid<T>({
    columns,
    data,
    isLoading,
    isError,
    error,
    page,
    totalPages,
    onPageChange,
    sortBy,
    sortOrder,
    onSortChange,
    selectedIds = [],
    onSelectionChange,
    getRowId,
    bulkActions = [],
    emptyState,
    title
}: DataGridProps<T>) {
    const { hasPermission } = useAuth();

    // Density State
    const [density, setDensity] = useState<DensityMode>(() => {
        const saved = localStorage.getItem('datagrid_density');
        return (saved as DensityMode) || 'standard';
    });

    useEffect(() => {
        localStorage.setItem('datagrid_density', density);
    }, [density]);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
        const saved = localStorage.getItem(`datagrid_cols_${title || 'default'}`);
        if (saved) return JSON.parse(saved);
        const initial: Record<string, boolean> = {};
        columns.forEach(col => {
            initial[col.id] = !col.hidden;
        });
        return initial;
    });

    useEffect(() => {
        localStorage.setItem(`datagrid_cols_${title || 'default'}`, JSON.stringify(visibleColumns));
    }, [visibleColumns, title]);

    // Filter columns by permission and visibility
    const activeColumns = useMemo(() => {
        return columns.filter(col => {
            if (col.permission && !hasPermission(col.permission)) return false;
            return visibleColumns[col.id] !== false;
        });
    }, [columns, visibleColumns, hasPermission]);

    const handleSelectAll = (checked: boolean) => {
        if (!onSelectionChange) return;
        if (checked) {
            onSelectionChange(data.map(row => getRowId(row)));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (!onSelectionChange) return;
        if (checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter(sid => sid !== id));
        }
    };

    const currentStyles = STYLES_BY_DENSITY[density];

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-rose-500/5 rounded-3xl border border-rose-500/10">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-4 opacity-50" />
                <h3 className="text-xl font-black text-rose-600 uppercase tracking-widest">Protocol Failure</h3>
                <p className="text-sm text-rose-500/70 font-medium mt-2">{error?.message || 'The data uplink was terminated unexpectedly.'}</p>
                <Button
                    variant="outline"
                    className="mt-6 border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                    onClick={() => window.location.reload()}
                >
                    Attempt Re-synchronization
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Grid Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-left-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedIds.length} Selected</span>
                            <div className="h-3 w-[1px] bg-primary/20 mx-1" />
                            <div className="flex gap-1">
                                {bulkActions.map((action, idx) => (
                                    <Can key={idx} permission={action.permission || ''}>
                                        <Button
                                            size="sm"
                                            variant={action.variant || "ghost"}
                                            className="h-7 px-2 text-[10px] font-black uppercase tracking-widest rounded-lg"
                                            onClick={() => {
                                                if (action.requireConfirmation) {
                                                    if (window.confirm(action.confirmationText || 'Proceed with bulk operation?')) {
                                                        action.onClick(selectedIds);
                                                    }
                                                } else {
                                                    action.onClick(selectedIds);
                                                }
                                            }}
                                        >
                                            {action.icon && <span className="mr-1">{action.icon}</span>}
                                            {action.label}
                                        </Button>
                                    </Can>
                                ))}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-[10px] font-black uppercase tracking-widest rounded-lg text-muted-foreground"
                                    onClick={() => onSelectionChange?.([])}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {/* Density Control */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl border-border/40 gap-2 text-xs font-bold uppercase tracking-wider">
                                <Layers size={14} className="text-primary" />
                                Density
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl glass-panel-dark p-1">
                            <DropdownMenuItem onClick={() => setDensity('compact')} className="rounded-lg gap-2 text-xs font-bold p-2 cursor-pointer">
                                <Minimize2 size={14} className={density === 'compact' ? 'text-primary' : 'opacity-40'} />
                                Compact
                                {density === 'compact' && <Check size={12} className="ml-auto text-primary" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDensity('standard')} className="rounded-lg gap-2 text-xs font-bold p-2 cursor-pointer">
                                <StretchHorizontal size={14} className={density === 'standard' ? 'text-primary' : 'opacity-40'} />
                                Standard
                                {density === 'standard' && <Check size={12} className="ml-auto text-primary" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDensity('comfortable')} className="rounded-lg gap-2 text-xs font-bold p-2 cursor-pointer">
                                <Maximize2 size={14} className={density === 'comfortable' ? 'text-primary' : 'opacity-40'} />
                                Comfortable
                                {density === 'comfortable' && <Check size={12} className="ml-auto text-primary" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Column Management */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl border-border/40 gap-2 text-xs font-bold uppercase tracking-wider">
                                <Settings2 size={14} className="text-primary" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl glass-panel-dark p-1 overflow-hidden">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground p-3">Column Visibility</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                                {columns.map(col => (
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        checked={visibleColumns[col.id] !== false}
                                        onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, [col.id]: checked }))}
                                        className="rounded-lg text-xs font-bold p-2 cursor-pointer"
                                    >
                                        {col.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Grid Table */}
            <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-white/40 backdrop-blur-md shadow-premium">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-border/20 bg-muted/10">
                                {onSelectionChange && (
                                    <th className={cn(currentStyles.header, "w-12 text-center")}>
                                        <Checkbox
                                            checked={data.length > 0 && selectedIds.length === data.length}
                                            onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                            className="border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                        />
                                    </th>
                                )}
                                {activeColumns.map(col => (
                                    <th
                                        key={col.id}
                                        className={cn(
                                            currentStyles.header,
                                            "text-left font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap group/th",
                                            col.headerClassName
                                        )}
                                        style={{ width: col.width }}
                                    >
                                        <div
                                            className={cn(
                                                "flex items-center gap-2",
                                                col.sortable && "cursor-pointer select-none"
                                            )}
                                            onClick={() => {
                                                if (col.sortable) {
                                                    const newOrder = sortBy === col.id && sortOrder === 'asc' ? 'desc' : 'asc';
                                                    onSortChange(col.id, newOrder);
                                                }
                                            }}
                                        >
                                            {col.label}
                                            {col.sortable && (
                                                <div className="flex flex-col opacity-0 group-hover/th:opacity-100 transition-opacity">
                                                    <ArrowUp
                                                        size={10}
                                                        className={cn(
                                                            "transition-colors",
                                                            sortBy === col.id && sortOrder === 'asc' ? "text-primary" : "text-muted-foreground/30"
                                                        )}
                                                    />
                                                    <ArrowDown
                                                        size={10}
                                                        className={cn(
                                                            "transition-colors -mt-1",
                                                            sortBy === col.id && sortOrder === 'desc' ? "text-primary" : "text-muted-foreground/30"
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <tr key={`skeleton-${idx}`}>
                                            {onSelectionChange && <td className={currentStyles.cell}><Skeleton className="h-4 w-4 rounded" /></td>}
                                            {activeColumns.map(col => (
                                                <td key={`skeleton-cell-${col.id}`} className={currentStyles.cell}>
                                                    <Skeleton className="h-4 w-24 rounded" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : data.length > 0 ? (
                                    data.map((row, idx) => {
                                        const rowId = getRowId(row);
                                        const isSelected = selectedIds.includes(rowId);

                                        return (
                                            <motion.tr
                                                key={rowId}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={cn(
                                                    "transition-colors group",
                                                    isSelected ? "bg-primary/5" : "hover:bg-muted/10"
                                                )}
                                            >
                                                {onSelectionChange && (
                                                    <td className={cn(currentStyles.cell, "text-center")}>
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={(checked) => handleSelectRow(rowId, !!checked)}
                                                            className="border-primary/20 data-[state=checked]:bg-primary"
                                                        />
                                                    </td>
                                                )}
                                                {activeColumns.map(col => {
                                                    const content = typeof col.accessor === 'function'
                                                        ? col.accessor(row)
                                                        : (row[col.accessor] as ReactNode);

                                                    return (
                                                        <td
                                                            key={col.id}
                                                            className={cn(
                                                                currentStyles.cell,
                                                                "font-medium text-foreground/80 group-hover:text-foreground transition-colors",
                                                                col.className
                                                            )}
                                                        >
                                                            {content}
                                                        </td>
                                                    );
                                                })}
                                            </motion.tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={activeColumns.length + (onSelectionChange ? 1 : 0)} className="py-20 text-center">
                                            {emptyState || (
                                                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                                    <Search size={40} className="opacity-20 translate-y-2" />
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-black uppercase tracking-widest">No Intelligence Found</p>
                                                        <p className="text-xs font-medium italic">Current search parameters returned zero results from the archive.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-8 py-5 border-t border-border/20 flex flex-wrap items-center justify-between gap-4 bg-muted/5">
                    <div className="flex items-center gap-6">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            Resource Coverage: <span className="text-primary">{data.length}</span> Records Cached
                        </p>
                        <div className="h-4 w-[1px] bg-border/20" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            Sector: <span className="text-primary">{page}</span> of {totalPages || 1}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-border/40 disabled:opacity-30 active:scale-95 transition-all"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1 || isLoading}
                        >
                            <ChevronLeft size={14} className="mr-1" /> Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-border/40 disabled:opacity-30 active:scale-95 transition-all"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages || totalPages === 0 || isLoading}
                        >
                            Next <ChevronRight size={14} className="ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
