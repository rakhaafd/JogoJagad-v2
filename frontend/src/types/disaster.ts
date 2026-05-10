import type { User } from "./auth";

export type RegionStatus = "aman" | "waspada" | "bahaya";

export interface Region {
  id: number;
  name: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  status: RegionStatus;
  disaster_type: string | null;
  polygon: [number, number][];
  description: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface RegionListResponse {
  regions: Region[];
}

export interface RegionDetailResponse {
  region: Region;
}

export interface RegionPayload {
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  status: RegionStatus;
  description?: string;
  disaster_type?: string;
  polygon?: [number, number][];
}

export type ActionStatus = "pending" | "verified";

export interface ActionVerification {
  id: number;
  action_id: number;
  admin_id: number;
  category: "Minor" | "Moderate" | "Major";
  points_awarded: number;
  notes: string | null;
  verified_at: string;
}

export interface ActionReport {
  id: number;
  user_id: number;
  title: string;
  action_type: string;
  description: string;
  photo_path: string;
  status: ActionStatus;
  created_at: string;
  updated_at: string;
  user?: Pick<User, "id" | "name" | "email">;
  verification?: ActionVerification | null;
}

export interface ActionListResponse {
  actions: ActionReport[];
}

export interface ActionDetailResponse {
  action: ActionReport;
}

export interface ActionCreatePayload {
  title: string;
  action_type: string;
  description: string;
  photo: File;
}

export interface ActionVerifyPayload {
  category: "Minor" | "Moderate" | "Major";
  notes?: string;
}
