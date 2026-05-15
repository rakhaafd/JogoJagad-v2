export type DonationStatus =
  | "pending"
  | "paid"
  | "expired"
  | "PENDING"
  | "PAID"
  | "EXPIRED";

export interface DonationUser {
  id: number;
  name: string;
  total_points?: number;
}

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
  currency?: string;
  status: DonationStatus;
  provider?: string;
  checkout_url: string | null;
  external_id: string;
  paid_at: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
  campaign?: DonationCampaign;
  user?: DonationUser;
}

export interface DonationCampaignDetail extends DonationCampaign {
  donations: Donation[];
}

export interface DonationCampaignsResponse {
  campaigns: DonationCampaign[];
}

export interface DonationCampaignDetailResponse {
  campaign: DonationCampaignDetail;
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
