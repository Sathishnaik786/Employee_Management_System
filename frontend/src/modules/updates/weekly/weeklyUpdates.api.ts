import { apiCall } from "@/services/api";

export const createWeeklyUpdate = (payload: any) =>
    apiCall("/updates", "POST", payload);

export const getMyWeeklyUpdates = () =>
    apiCall("/updates/my?type=WEEKLY", "GET");

export const getVisibleWeeklyUpdates = () =>
    apiCall("/updates/visible?type=WEEKLY", "GET");

export const addWeeklyFeedback = (id: string, comment: string) =>
    apiCall(`/updates/${id}/feedback`, "POST", { comment });
