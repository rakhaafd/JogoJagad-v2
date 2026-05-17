import { API_TIMEOUT_MS } from "../utils/constants";
import { clearToken, getToken } from "../utils/token";
import type { ApiErrorPayload } from "../types";

const apiBaseFromEnv = import.meta.env.VITE_URL_API?.replace(/\/$/, "");
const baseURL = apiBaseFromEnv ? `${apiBaseFromEnv}/api` : "/api";

function buildUrl(
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
) {
  const normalized = path.startsWith("http")
    ? path
    : `${baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
  if (!query) return normalized;

  const url = new URL(normalized);
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

export class ApiFetchError extends Error {
  status: number;
  validationErrors?: ApiErrorPayload["errors"];

  constructor(
    message: string,
    status: number,
    validationErrors?: ApiErrorPayload["errors"],
  ) {
    super(message);
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

interface ApiFetchOptions<TBody> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  headers?: HeadersInit;
  query?: Record<string, string | number | boolean | undefined>;
  auth?: boolean;
  signal?: AbortSignal;
}

export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  options: ApiFetchOptions<TBody> = {},
) {
  const { method = "GET", body, headers, query, auth = true, signal } = options;
  const token = getToken();
  const requestHeaders: HeadersInit = {
    Accept: "application/json",
    ...headers,
  };

  const payload = body ?? undefined;
  const shouldSendJson =
    payload && !isFormData(payload) && typeof payload !== "string";
  if (shouldSendJson) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: requestHeaders,
    body: payload
      ? shouldSendJson
        ? JSON.stringify(payload)
        : (payload as BodyInit)
      : undefined,
    signal: signal ?? controller.signal,
  }).finally(() => window.clearTimeout(timeoutId));

  let responseData: unknown = null;
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status !== 204) {
    if (contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
  }

  if (!response.ok) {
    const message =
      typeof responseData === "object" && responseData
        ? (responseData as ApiErrorPayload).message
        : response.statusText || "Request failed";
    const validationErrors =
      typeof responseData === "object" && responseData
        ? (responseData as ApiErrorPayload).errors
        : undefined;

    if (response.status === 401 && auth && token) {
      clearToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    throw new ApiFetchError(
      message ?? "Request failed",
      response.status,
      validationErrors,
    );
  }

  return responseData as TResponse;
}
