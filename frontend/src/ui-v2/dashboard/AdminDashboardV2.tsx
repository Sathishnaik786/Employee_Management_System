/**
 * AdminDashboardV2
 *
 * Future entry point for the Admin Dashboard V2.
 * This component will aggregate widgets, charts, and tables for the main dashboard view.
 */

import React, { useEffect, useState } from 'react';
import StatCard from '../cards/StatCard';
import DataTableWrapper from '../tables/DataTableWrapper';
import ChartContainer from '../charts/ChartContainer';
// Using relative imports for safety if @ alias is not fully configured for this new folder
import { analyticsService } from '../../services/analytics.service';
import { AdminOverviewData } from '../../types';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

const AdminDashboardV2: React.FC = () => {
    const [stats, setStats] = useState<AdminOverviewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await analyticsService.getAdminOverview();
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
    }, []);

    const getValue = (val: number | undefined) => {
        if (loading) return 'Loading...';
        return val !== undefined ? val : '—';
    };

    return (
        <div style={{
            /* Integrated with AppLayout: No local padding/bg overrides needed */
            fontFamily: typography.fontFamily,
        }}>
            {/* Page Title */}
            <h1 style={{
                marginBottom: spacing.lg,
                fontSize: typography.heading.fontSize,
                fontWeight: typography.heading.fontWeight,
                color: colors.primary
            }}>
                Admin Dashboard
            </h1>

            {/* KPI Section */}
            <section style={{ marginBottom: spacing.xl }}>
                <h2 style={{
                    fontSize: typography.subheading.fontSize,
                    fontWeight: typography.subheading.fontWeight,
                    marginBottom: spacing.md,
                    color: colors.muted
                }}>
                    Overview
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md }}>
                    {/* Card 1 */}
                    <div style={{
                        padding: 0 /* Reset default padding as StatCard handles it now inside the component if we used it fully, but strictly we should just use StatCard. However, StatCard has its own container styles now. So we should remove wrapper styles here or move them. 
                       Wait, the task says "Replace inline styles... Improve section headers".
                       The previous code had a wrapper div around StatCard with border/padding.
                       Since StatCard NOW has its own border and background (from Step 259), we should REMOVE the wrapper styling here to avoid double borders.
                       */
                    }}>
                        {/* We pass the label as 'title' to StatCard. The previous code had a separate div for label. 
                           StatCard takes 'title' and 'value'. 
                           Let's simplify and rely on StatCard's internal styling. 
                        */}
                        <StatCard title="Total Employees" value={getValue(stats?.totalEmployees)} />
                    </div>

                    {/* Card 2 */}
                    <div>
                        <StatCard title="Active Employees" value={getValue(stats?.activeEmployees)} />
                    </div>

                    {/* Card 3 */}
                    <div>
                        <StatCard title="Present Today" value={getValue(stats?.presentToday)} />
                    </div>

                    {/* Card 4 */}
                    <div>
                        <StatCard title="Pending Leaves" value={getValue(stats?.pendingLeaveRequests)} />
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
                    Analytics
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
                        Department Distribution
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
                    Recent Activity
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
                            System Status
                        </strong>
                    </div>
                    <DataTableWrapper>
                        <div style={{ padding: spacing.md, color: colors.muted, fontSize: typography.body.fontSize }}>
                            <p style={{ marginBottom: spacing.xs }}>Total Departments: <span style={{ color: colors.primary }}>{getValue(stats?.totalDepartments)}</span></p>
                            <p style={{ marginBottom: spacing.xs }}>Total Work Items: <span style={{ color: colors.primary }}>{getValue(stats?.totalWorkItems)}</span></p>
                            <p>Approved Leaves: <span style={{ color: colors.primary }}>{getValue(stats?.approvedLeaveRequests)}</span></p>
                        </div>
                    </DataTableWrapper>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboardV2;
