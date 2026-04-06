import API from "../../api/client";

export const getPlans = () => API.get("/plans");
export const createPlan = (data) => API.post("/plans", data);
export const deletePlan = (planId) => API.delete(`/plans/${planId}`);

export const subscribePlan = (planId) => API.post("/subscriptions/create", { planId });
export const getMySubscription = () => API.get("/subscriptions/me");
export const cancelMySubscription = () => API.post("/subscriptions/cancel");
export const changeMyPlan = (newPlanId) =>
  API.post("/subscriptions/changeplan", { newPlanId });