import { api } from "./api";
import type {
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
    const { data } = await api.get<DonationCampaignsResponse>(endpoint);
    return data.campaigns;
  },

  async campaignDetail(id: number, admin = false) {
    const endpoint = admin ? `/admin/donations/${id}` : `/donations/${id}`;
    const { data } = await api.get<{ campaign: DonationCampaignsResponse["campaigns"][number] }>(
      endpoint,
    );
    return data.campaign;
  },

  async donate(campaignId: number, payload: DonationCreatePayload) {
    const { data } = await api.post<DonateResponse>(`/donations/${campaignId}/donate`, payload);
    return data;
  },

  async history() {
    const { data } = await api.get<DonationHistoryResponse>("/donations/history");
    return data.donations;
  },

  async createCampaign(payload: DonationCampaignUpsertPayload) {
    const { data } = await api.post<{ campaign: DonationCampaignsResponse["campaigns"][number] }>(
      "/admin/donations",
      toCampaignFormData(payload),
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data.campaign;
  },

  async updateCampaign(id: number, payload: DonationCampaignUpsertPayload) {
    const { data } = await api.post<{ campaign: DonationCampaignsResponse["campaigns"][number] }>(
      `/admin/donations/${id}`,
      toCampaignFormData(payload),
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data.campaign;
  },

  async deleteCampaign(id: number) {
    const { data } = await api.delete<{ message: string }>(`/admin/donations/${id}`);
    return data;
  },
};
