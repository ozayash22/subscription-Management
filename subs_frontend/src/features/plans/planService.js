import API from "../../api/client";

export const getPlans = () => API.get("/plans");
export const createPlan = (data) => API.post("/plans", data);
export const subscribePlan = (planId) =>
  API.post("/subscriptions/create", { planId });