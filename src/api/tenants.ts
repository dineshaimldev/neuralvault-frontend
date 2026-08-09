import { api } from "./config";

export const listTenants = () => api("/tenants");

export const createTenant = (name: string, plan: string = "growth") => {
  return api("/tenants", {
    method: "POST",
    body: JSON.stringify({ name, plan }),
  });
};