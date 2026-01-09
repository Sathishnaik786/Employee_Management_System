import { RouteObject } from 'react-router-dom';
import DailyStandupPage from './daily/DailyStandupPage';
import WeeklyStandoutPage from './weekly/WeeklyStandoutPage';
import MonthlyUpdatePage from './monthly/MonthlyUpdatePage';
import AnalyticsPage from './analytics/AnalyticsPage';
import AutomationPage from './automation/AutomationPage';

// Feature Flag Checks
const isDailyUpdatesEnabled = import.meta.env.VITE_ENABLE_DAILY_UPDATES === 'true';
const isWeeklyUpdatesEnabled = import.meta.env.VITE_ENABLE_WEEKLY_UPDATES === 'true';
const isMonthlyUpdatesEnabled = import.meta.env.VITE_ENABLE_MONTHLY_UPDATES === 'true';
const isAnalyticsEnabled = import.meta.env.VITE_ENABLE_UPDATE_ANALYTICS === 'true';
const isAutomationEnabled =
    import.meta.env.VITE_ENABLE_UPDATE_REMINDERS === 'true' ||
    import.meta.env.VITE_ENABLE_AI_SUMMARIES === 'true' ||
    import.meta.env.VITE_ENABLE_EXPORTS === 'true';

const routes: RouteObject[] = [];

if (isDailyUpdatesEnabled) {
    routes.push({
        path: 'updates/daily',
        element: <DailyStandupPage />,
    });
}

if (isWeeklyUpdatesEnabled) {
    routes.push({
        path: 'updates/weekly',
        element: <WeeklyStandoutPage />,
    });
}

if (isMonthlyUpdatesEnabled) {
    routes.push({
        path: 'updates/monthly',
        element: <MonthlyUpdatePage />,
    });
}

if (isAnalyticsEnabled) {
    routes.push({
        path: 'updates/analytics',
        element: <AnalyticsPage />,
    });
}

if (isAutomationEnabled) {
    routes.push({
        path: 'updates/automation',
        element: <AutomationPage />,
    });
}

export const updatesRoutes: RouteObject[] = routes;

export default updatesRoutes;
