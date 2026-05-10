import axios from "axios";

export function extractApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      "Request failed";
    const validationErrors = (error.response?.data as { errors?: Record<string, string[]> })
      ?.errors;
    return { message, validationErrors };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Unexpected error happened." };
}
