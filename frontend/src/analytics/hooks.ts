import { useMemo } from 'react';
import { AnalyticsMetric, TrendData, ReadinessScore, DistributionData } from './types';

export function useAnalyticsMetric(metricId: string) {
    // In a real app, this would fetch from /api/analytics/metrics/:id
    return useMemo(() => {
        const mockMetrics: Record<string, AnalyticsMetric> = {
            placement_ctc: {
                id: 'placement_ctc',
                title: 'Average CTC Protocol',
                value: '₹8.4 LPA',
                trend: 12.5,
                sparkline: [
                    { timestamp: 'Jan', value: 6.2 },
                    { timestamp: 'Feb', value: 6.8 },
                    { timestamp: 'Mar', value: 7.1 },
                    { timestamp: 'Apr', value: 8.4 },
                ]
            },
            phd_completion: {
                id: 'phd_completion',
                title: 'Scholar Lifecycle Completion',
                value: '74%',
                trend: -2.1,
                sparkline: [
                    { timestamp: '2021', value: 80 },
                    { timestamp: '2022', value: 78 },
                    { timestamp: '2023', value: 76 },
                    { timestamp: '2024', value: 74 },
                ]
            }
        };

        return {
            data: mockMetrics[metricId] || null,
            loading: false,
            error: null
        };
    }, [metricId]);
}

export function useTrendData(trendId: string) {
    return useMemo(() => {
        const mockTrends: Record<string, TrendData[]> = {
            enrollment_trend: [
                { timestamp: '2020', value: 1200 },
                { timestamp: '2021', value: 1350 },
                { timestamp: '2022', value: 1480 },
                { timestamp: '2023', value: 1620 },
                { timestamp: '2024', value: 1800 },
            ]
        };

        return {
            data: mockTrends[trendId] || [],
            loading: false
        };
    }, [trendId]);
}

export function useReadinessScores(model: 'NAAC' | 'PHD' | 'PLACEMENT') {
    return useMemo(() => {
        if (model === 'NAAC') {
            return [
                { id: 'c1', category: 'Curricular Aspects', score: 85, status: 'OPTIMAL', trend: 'UP' },
                { id: 'c2', category: 'Teaching-Learning', score: 92, status: 'OPTIMAL', trend: 'STABLE' },
                { id: 'c3', category: 'Research & Innovation', score: 45, status: 'CRITICAL', trend: 'DOWN' },
                { id: 'c4', category: 'Infrastructure', score: 78, status: 'WARN', trend: 'UP' },
                { id: 'c5', category: 'Student Support', score: 65, status: 'WARN', trend: 'STABLE' },
                { id: 'c6', category: 'Governance', score: 88, status: 'OPTIMAL', trend: 'UP' },
                { id: 'c7', category: 'Institutional Values', score: 90, status: 'OPTIMAL', trend: 'STABLE' },
            ] as ReadinessScore[];
        }
        return [] as ReadinessScore[];
    }, [model]);
}
