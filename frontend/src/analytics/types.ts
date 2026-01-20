export interface TrendData {
    timestamp: string;
    value: number;
    label?: string;
}

export interface ReadinessScore {
    id: string;
    category: string;
    score: number; // 0-100
    status: 'OPTIMAL' | 'WARN' | 'CRITICAL';
    trend: 'UP' | 'DOWN' | 'STABLE';
    details?: string;
}

export interface DistributionData {
    label: string;
    value: number;
    color?: string;
}

export interface AnalyticsMetric {
    id: string;
    title: string;
    value: string | number;
    unit?: string;
    trend: number; // Percentage change
    sparkline: TrendData[];
}
