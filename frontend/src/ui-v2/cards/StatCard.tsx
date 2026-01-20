/**
 * StatCard
 *
 * Future presentational component for displaying statistics.
 *
 * Intended features:
 * - Display title, value, and trend (percentage)
 * - Support for icons
 * - Different visual variants (primary, danger, success)
 */

import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

interface StatCardProps {
    title?: string;
    value?: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title = "Title", value = "Value" }) => {
    return (
        <div style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: spacing.sm, // Using 8px from spacing.sm
            padding: spacing.lg,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
            <h3 style={{
                margin: 0,
                fontSize: typography.caption.fontSize,
                fontWeight: typography.caption.fontWeight,
                color: colors.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {title}
            </h3>
            <p style={{
                margin: `${spacing.xs} 0 0 0`,
                fontSize: typography.heading.fontSize,
                fontWeight: typography.heading.fontWeight as any, // Cast to avoid TS issues if string
                color: colors.primary,
                lineHeight: 1.2
            }}>
                {value}
            </p>
        </div>
    );
};

export default StatCard;
