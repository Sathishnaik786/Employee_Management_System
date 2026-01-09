import { apiCall } from "@/services/api";

export const createMonthlyUpdate = (payload: any) =>
    apiCall("/updates", "POST", payload);

export const getMyMonthlyUpdates = () =>
    apiCall("/updates/my?type=MONTHLY", "GET");

export const getVisibleMonthlyUpdates = () =>
    apiCall("/updates/visible?type=MONTHLY", "GET");

export const addMonthlyFeedback = (id: string, comment: string) =>
    apiCall(`/updates/${id}/feedback`, "POST", { comment });
