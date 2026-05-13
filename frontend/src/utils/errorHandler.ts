import { ApiFetchError } from "../services/api";

export function extractApiError(error: unknown) {
  if (error instanceof ApiFetchError) {
    return { message: error.message, validationErrors: error.validationErrors };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Unexpected error happened." };
}
