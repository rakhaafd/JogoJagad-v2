import type { User } from "./auth";

export type DonationStatus = "PENDING" | "PAID" | "EXPIRED";

export interface DonationCampaign {
  id: number;
  title: string;
  description: string;
  image_path: string | null;
  target_amount: number;
  current_amount: number;
  donations_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: number;
  user_id: number;
  donation_campaign_id: number;
  amount: number;
  status: DonationStatus;
  checkout_url: string | null;
  external_id: string;
  paid_at: string | null;
  metadata?: Record<string, unknown> | null;
  campaign?: DonationCampaign;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface DonationCampaignsResponse {
  campaigns: DonationCampaign[];
}

export interface DonationHistoryResponse {
  donations: Donation[];
}

export interface DonationCreatePayload {
  amount: number;
}

export interface DonateResponse {
  message: string;
  checkout_url: string;
  donation: Donation;
}

export interface DonationCampaignUpsertPayload {
  title: string;
  description: string;
  target_amount: number;
  image?: File;
}
