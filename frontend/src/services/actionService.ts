import { apiFetch } from "./api";
import { disasterService } from "./disasterService";

export interface VerifyActionPayload {
  category?: string;
  notes?: string;
}

const baseActionService = {
  async list() {
    return apiFetch<any>("/admin/actions");
  },

  async verify(id: string | number, payload: VerifyActionPayload) {
    return apiFetch<any>(`/admin/actions/${id}/verify`, {
      method: "POST",
      body: payload,
    });
  },
};

// Backwards-compatible aliases used across the app
export const actionService: any = Object.assign(baseActionService, {
  listHistory: disasterService.userActions,
  submit: disasterService.submitAction,
  verifyAction: disasterService.verifyAction,
  verify: (id: number | string, payload: any) =>
    disasterService.verifyAction(Number(id), payload),
  listPending: (status?: string) => disasterService.adminActions(status),
  detail: disasterService.actionDetail,
  update: disasterService.updateAction,
  delete: disasterService.deleteAction,
});
