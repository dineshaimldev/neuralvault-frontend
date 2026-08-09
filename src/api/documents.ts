import { api, API_BASE_URL } from "./config";

export const listDocuments = (search?: string) => {
  const params = search ? `?search=${search}` : "";
  return api(`/documents${params}`);
};

export const uploadDocument = async (file: File, collectionTag?: string) => {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();
  formData.append("file", file);
  if (collectionTag) {
    formData.append("collection_tag", collectionTag);
  }

  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Upload failed");
  return data;
};

export const getDocumentChunks = (documentId: string) => {
  return api(`/documents/${documentId}/chunks`);
};

export const deleteDocument = (documentId: string) => {
  return api(`/documents/${documentId}`, { method: "DELETE" });
};