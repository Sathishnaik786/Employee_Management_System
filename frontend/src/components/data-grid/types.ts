import { Permission } from "@/access/permissions";
import { ReactNode } from "react";

export type DensityMode = 'compact' | 'standard' | 'comfortable';

export interface ColumnConfig<T> {
    id: string;
    label: string;
    accessor: keyof T | ((row: T) => ReactNode);
    sortable?: boolean;
    permission?: Permission | string;
    className?: string;
    headerClassName?: string;
    hidden?: boolean;
    width?: string;
}

export interface DataGridProps<T> {
    columns: ColumnConfig<T>[];
    data: T[];
    isLoading?: boolean;
    isError?: boolean;
    error?: any;

    // Pagination
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;

    // Sorting
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onSortChange: (field: string, order: 'asc' | 'desc') => void;

    // Selection
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
    getRowId: (row: T) => string;

    // Bulk Actions
    bulkActions?: BulkAction[];

    // Extra UI
    emptyState?: ReactNode;
    title?: string;
}

export interface BulkAction {
    label: string;
    icon?: ReactNode;
    onClick: (ids: string[]) => void | Promise<void>;
    permission?: Permission | string;
    variant?: 'default' | 'destructive' | 'outline' | 'premium';
    requireConfirmation?: boolean;
    confirmationText?: string;
}
