import { apiCall } from "@/services/api";

export const getMyAnalytics = () =>
    apiCall("/updates/analytics/me", "GET");

export const getTeamAnalytics = () =>
    apiCall("/updates/analytics/team", "GET");

export const getOrgAnalytics = () =>
    apiCall("/updates/analytics/org", "GET");
