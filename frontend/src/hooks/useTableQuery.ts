import { useState, useMemo, useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

interface UseTableQueryOptions<T, F> {
    queryKey: any[];
    fetchFn: (params: any) => Promise<{ data: T[]; meta: any }>;
    initialFilters?: F;
    initialSort?: { sortBy: string; sortOrder: 'asc' | 'desc' };
    initialPage?: number;
    initialLimit?: number;
    enabled?: boolean;
}

/**
 * Standardized hook for table data fetching with server-side pagination, sorting, and filtering.
 */
export function useTableQuery<T, F = any>({
    queryKey,
    fetchFn,
    initialFilters = {} as F,
    initialSort = { sortBy: 'created_at', sortOrder: 'desc' },
    initialPage = 1,
    initialLimit = 10,
    enabled = true,
}: UseTableQueryOptions<T, F>) {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [filters, setFilters] = useState<F>(initialFilters);
    const [sort, setSort] = useState(initialSort);

    // Memoize params to avoid unnecessary re-renders
    const params = useMemo(() => ({
        page,
        limit,
        ...filters,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
    }), [page, limit, filters, sort]);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isPlaceholderData,
    } = useQuery({
        queryKey: [...queryKey, params],
        queryFn: () => fetchFn(params),
        placeholderData: keepPreviousData,
        enabled: enabled,
    });

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handleLimitChange = useCallback((newLimit: number) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when limit changes
    }, []);

    const handleFilterChange = useCallback((newFilters: Partial<F>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPage(1); // Reset to first page when filters change
    }, []);

    const handleSortChange = useCallback((sortBy: string) => {
        setSort(prev => ({
            sortBy,
            sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }));
        setPage(1);
    }, []);

    return {
        // Data & States
        items: data?.data || [],
        meta: data?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
        isLoading,
        isError,
        error,
        isPlaceholderData,

        // Controls
        page,
        limit,
        filters,
        sort,

        // Setters
        handlePageChange,
        handleLimitChange,
        handleFilterChange,
        handleSortChange,
        refetch,
    };
}
