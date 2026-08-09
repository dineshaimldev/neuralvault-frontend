import { api } from "./config";

export const queryDocuments = (
  question: string,
  useHyde: boolean = false,
  useReranking: boolean = true,
  topK: number = 5
) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return api("/query", {
    method: "POST",
    body: JSON.stringify({
      question,
      tenant_id: user.tenant_id,
      top_k: topK,
      use_hyde: useHyde,
      use_reranking: useReranking,
    }),
  });
};