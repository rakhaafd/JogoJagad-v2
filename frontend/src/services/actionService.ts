import { disasterService } from "./disasterService";

export const actionService = {
  listHistory: disasterService.userActions,
  submit: disasterService.submitAction,
  verify: disasterService.verifyAction,
  listPending: () => disasterService.adminActions("pending"),
};
