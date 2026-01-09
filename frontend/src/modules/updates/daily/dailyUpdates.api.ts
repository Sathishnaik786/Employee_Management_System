import { apiCall } from "@/services/api";

export const createDailyUpdate = (payload: any) =>
    apiCall("/updates", "POST", payload);

export const getMyDailyUpdates = () =>
    apiCall("/updates/my?type=DAILY", "GET");

export const getVisibleDailyUpdates = () =>
    apiCall("/updates/visible?type=DAILY", "GET");

export const addDailyFeedback = (id: string, comment: string) =>
    apiCall(`/updates/${id}/feedback`, "POST", { comment });
