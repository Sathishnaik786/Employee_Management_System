/**
 * ManagementDashboardV2
 *
 * Future entry point for the Management Dashboard V2.
 * This component will provide high-level strategic insights and institutional KPIs.
 */

import React, { useEffect, useState } from 'react';
import StatCard from '../cards/StatCard';
import DataTableWrapper from '../tables/DataTableWrapper';
import ChartContainer from '../charts/ChartContainer';
import { analyticsService } from '../../services/analytics.service';
import { ManagerTeamProgressData } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

const ManagementDashboardV2: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<ManagerTeamProgressData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!user?.id) return;

            try {
                // Using getManagerProgress which fits the "Management" role profile best in the current API schema
                const response = await analyticsService.getManagerProgress(user.id);
                if (response.success) {
                    setStats(response.data);
                } else {
                    console.error('Failed to load analytics:', response.message);
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [user?.id]);

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
                Management Dashboard
            </h1>

            {/* KPI Section */}
            <section style={{ marginBottom: spacing.xl }}>
                <h2 style={{
                    fontSize: typography.subheading.fontSize,
                    fontWeight: typography.subheading.fontWeight,
                    marginBottom: spacing.md,
                    color: colors.muted
                }}>
                    Strategic Overview
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md }}>
                    {/* Card 1 */}
                    <div>
                        <StatCard title="Team Members" value={getValue(stats?.teamSize)} />
                    </div>

                    {/* Card 2 */}
                    <div>
                        <StatCard title="Attendance" value={getValue(stats?.teamPresentToday)} />
                    </div>

                    {/* Card 3 */}
                    <div>
                        <StatCard title="Pending Leaves" value={getValue(stats?.teamPendingLeaveRequests)} />
                    </div>

                    {/* Card 4 */}
                    <div>
                        <StatCard title="Completed Items" value={getValue(stats?.teamCompletedWorkItems)} />
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
                    Institutional Analytics
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
                        Team Progress Overview
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
                    Governance Updates
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
                            Strategic Initiatives
                        </strong>
                    </div>
                    <DataTableWrapper>
                        <div style={{ padding: spacing.md, color: colors.muted, fontSize: typography.body.fontSize }}>
                            <p style={{ marginBottom: spacing.xs }}>Total Work Items: <span style={{ color: colors.primary }}>{getValue(stats?.teamWorkItems)}</span></p>
                            <p style={{ marginBottom: spacing.xs }}>Completed Work Items: <span style={{ color: colors.primary }}>{getValue(stats?.teamCompletedWorkItems)}</span></p>
                            <p style={{ marginBottom: spacing.xs }}>Active Staff Count: <span style={{ color: colors.primary }}>{getValue(stats?.teamPresentToday)}</span></p>
                            <p style={{ fontSize: typography.caption.fontSize, color: colors.muted, marginTop: spacing.md }}>(Detailed metrics pending backend aggregation)</p>
                        </div>
                    </DataTableWrapper>
                </div>
            </section>
        </div>
    );
};

export default ManagementDashboardV2;
