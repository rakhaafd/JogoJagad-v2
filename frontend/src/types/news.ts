import type { User } from "./auth";

export interface NewsItem {
  id: number;
  author_id: number;
  title: string;
  category: string;
  content: string;
  thumbnail_path: string;
  created_at: string;
  updated_at: string;
  author?: Pick<User, "id" | "name" | "role">;
}

export interface NewsListResponse {
  news: NewsItem[];
}

export interface NewsDetailResponse {
  news: NewsItem;
}

export interface NewsUpsertPayload {
  title: string;
  category: string;
  content: string;
  thumbnail?: File;
}
