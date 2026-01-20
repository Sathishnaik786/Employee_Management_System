/**
 * PrincipalDashboardV2
 *
 * Future entry point for the Principal Dashboard V2.
 * This component will handle academic oversight, degree awards, and institutional audits.
 */

import React, { useEffect, useState } from 'react';
import StatCard from '../cards/StatCard';
import DataTableWrapper from '../tables/DataTableWrapper';
import ChartContainer from '../charts/ChartContainer';
import { analyticsService } from '../../services/analytics.service';
import { AdminOverviewData } from '../../types';

import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

const PrincipalDashboardV2: React.FC = () => {
    const [stats, setStats] = useState<AdminOverviewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Using getAdminOverview as the high-level operational proxy for the Principal
                const response = await analyticsService.getAdminOverview();
                if (response.success) {
                    setStats(response.data);
                } else {
                    console.error('Failed to load Principal analytics:', response.message);
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const getValue = (val: number | undefined) => {
        if (loading) return 'Loading...';
        return val !== undefined ? val : '—';
    };

    return (
        <div style={{
            /* Integrated with AppLayout */
            fontFamily: typography.fontFamily,
        }}>
            {/* Page Title */}
            <h1 style={{
                marginBottom: spacing.lg,
                fontSize: typography.heading.fontSize,
                fontWeight: typography.heading.fontWeight,
                color: colors.primary
            }}>
                Principal Dashboard
            </h1>

            {/* KPI Section */}
            <section style={{ marginBottom: spacing.xl }}>
                <h2 style={{
                    fontSize: typography.subheading.fontSize,
                    fontWeight: typography.subheading.fontWeight,
                    marginBottom: spacing.md,
                    color: colors.muted
                }}>
                    Academic Oversight
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md }}>
                    {/* Card 1 */}
                    <div>
                        <StatCard title="Pending Approvals" value={getValue(stats?.totalWorkItems)} />
                    </div>

                    {/* Card 2 */}
                    <div>
                        <StatCard title="Degree Awards (Queue)" value="—" />
                        <p style={{ fontSize: typography.caption.fontSize, color: colors.muted, marginTop: spacing.xs }}>(Pending backend metric)</p>
                    </div>

                    {/* Card 3 */}
                    <div>
                        <StatCard title="Audit Score" value="—" />
                        <p style={{ fontSize: typography.caption.fontSize, color: colors.muted, marginTop: spacing.xs }}>(Pending backend metric)</p>
                    </div>

                    {/* Card 4 */}
                    <div>
                        <StatCard title="Active Faculty" value={getValue(stats?.activeEmployees)} />
                    </div>
                </div>
            </section>

            {/* Analytics Section */}
            <section style={{ marginBottom: spacing.xl }}>
                <h2 style={{
                    fontSize: typography.subheading.fontSize,
                    fontWeight: typography.subheading.fontWeight,
                    marginBottom: spacing.md,
                    color: colors.muted
                }}>
                    Academic Performance
                </h2>
                <div style={{
                    padding: spacing.lg,
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    borderRadius: spacing.sm,
                    minHeight: '300px'
                }}>
                    <h3 style={{
                        fontSize: typography.body.fontSize,
                        fontWeight: '600',
                        marginBottom: spacing.md,
                        color: colors.primary
                    }}>
                        Result Analysis
                    </h3>
                    <ChartContainer data={stats} />
                </div>
            </section>

            {/* Recent Activity Section */}
            <section>
                <h2 style={{
                    fontSize: typography.subheading.fontSize,
                    fontWeight: typography.subheading.fontWeight,
                    marginBottom: spacing.md,
                    color: colors.muted
                }}>
                    Approval Queue
                </h2>
                <div style={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: spacing.sm,
                    overflow: 'hidden',
                    backgroundColor: colors.background
                }}>
                    <div style={{
                        padding: `${spacing.sm} ${spacing.md}`,
                        borderBottom: `1px solid ${colors.border}`,
                        backgroundColor: colors.secondary
                    }}>
                        <strong style={{
                            fontSize: typography.body.fontSize,
                            color: colors.primary
                        }}>
                            Degree Awards
                        </strong>
                    </div>
                    <DataTableWrapper>
                        <div style={{ padding: spacing.md, color: colors.muted, fontSize: typography.body.fontSize }}>
                            <p style={{ marginBottom: spacing.xs }}>Total Items in Queue: <span style={{ color: colors.primary }}>{getValue(stats?.totalWorkItems)}</span></p>
                            <p style={{ marginBottom: spacing.xs }}>Pending Processing: <span style={{ color: colors.primary }}>{getValue(stats?.pendingLeaveRequests)}</span></p>
                            <p style={{ marginBottom: spacing.xs }}>Batch Status: <span style={{ color: colors.primary }}>{loading ? 'Checking...' : 'Active'}</span></p>
                        </div>
                    </DataTableWrapper>
                </div>
            </section>
        </div>
    );
};

export default PrincipalDashboardV2;
