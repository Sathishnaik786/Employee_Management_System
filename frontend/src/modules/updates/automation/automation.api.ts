import { apiCall } from "@/services/api";

export const getIntelligenceSummary = (type: string) =>
    apiCall(`/updates/intelligence/summary?type=${type}`, "GET");

export const triggerReminders = () =>
    apiCall("/updates/automation/reminders", "POST");

export const exportUpdates = (type?: string) =>
    apiCall(`/updates/governance/export${type ? `?type=${type}` : ''}`, "GET");
