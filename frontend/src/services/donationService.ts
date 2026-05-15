import { apiFetch } from "./api";
import type {
  DonationCampaignDetail,
  DonationCampaignDetailResponse,
  DonationCampaignsResponse,
  DonationCampaignUpsertPayload,
  DonationCreatePayload,
  DonationHistoryResponse,
  DonateResponse,
} from "../types";

function toCampaignFormData(payload: DonationCampaignUpsertPayload) {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("description", payload.description);
  form.append("target_amount", String(payload.target_amount));
  if (payload.image) form.append("image", payload.image);
  return form;
}

export const donationService = {
  async listCampaigns(admin = false) {
    const endpoint = admin ? "/admin/donations" : "/donations";
    const data = await apiFetch<DonationCampaignsResponse>(endpoint);
    return data.campaigns;
  },

  async campaignDetail(id: number, admin = false) {
    const endpoint = admin ? `/admin/donations/${id}` : `/donations/${id}`;
    const data = await apiFetch<DonationCampaignDetailResponse>(endpoint);
    return data.campaign;
  },

  async donate(campaignId: number, payload: DonationCreatePayload) {
    return apiFetch<DonateResponse>(`/donations/${campaignId}/donate`, {
      method: "POST",
      body: payload,
    });
  },

  async history() {
    const data = await apiFetch<DonationHistoryResponse>("/donations/history");
    return data.donations;
  },

  async createCampaign(payload: DonationCampaignUpsertPayload) {
    const data = await apiFetch<{
      campaign: DonationCampaignsResponse["campaigns"][number];
    }>("/admin/donations", {
      method: "POST",
      body: toCampaignFormData(payload),
    });
    return data.campaign;
  },

  async updateCampaign(id: number, payload: DonationCampaignUpsertPayload) {
    const data = await apiFetch<{
      campaign: DonationCampaignsResponse["campaigns"][number];
    }>(`/admin/donations/${id}`, {
      method: "POST",
      body: toCampaignFormData(payload),
    });
    return data.campaign;
  },

  async deleteCampaign(id: number) {
    return apiFetch<{ message: string }>(`/admin/donations/${id}`, {
      method: "DELETE",
    });
  },
};
