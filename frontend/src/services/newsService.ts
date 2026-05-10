import { api } from "./api";
import type { NewsDetailResponse, NewsListResponse, NewsUpsertPayload } from "../types";

function toNewsFormData(payload: NewsUpsertPayload) {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("category", payload.category);
  form.append("content", payload.content);
  if (payload.thumbnail) form.append("thumbnail", payload.thumbnail);
  return form;
}

export const newsService = {
  async list() {
    const { data } = await api.get<NewsListResponse>("/news");
    return data.news;
  },

  async detail(id: number) {
    const { data } = await api.get<NewsDetailResponse>(`/news/${id}`);
    return data.news;
  },

  async create(payload: NewsUpsertPayload) {
    const { data } = await api.post<NewsDetailResponse>("/admin/news", toNewsFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.news;
  },

  async update(id: number, payload: NewsUpsertPayload) {
    const { data } = await api.post<NewsDetailResponse>(
      `/admin/news/${id}`,
      toNewsFormData(payload),
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data.news;
  },

  async remove(id: number) {
    const { data } = await api.delete<{ message: string }>(`/admin/news/${id}`);
    return data;
  },

  async like() {
    throw new Error("News like endpoint is not available in current backend API.");
  },

  async postComment() {
    throw new Error("News comment endpoint is not available in current backend API.");
  },
};
