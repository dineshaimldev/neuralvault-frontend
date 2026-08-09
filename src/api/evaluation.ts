import { api } from "./config";

export const triggerEvaluation = () => {
  return api("/evaluation/run", { method: "POST" });
};

export const getEvalScores = () => api("/evaluation/scores");

export const getEvalRuns = () => api("/evaluation/runs");