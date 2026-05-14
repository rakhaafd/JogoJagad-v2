export function getStorageUrl(path: string): string {
  const baseURL = import.meta.env.VITE_URL_API
    ? import.meta.env.VITE_URL_API.replace("/api", "")
    : "http://127.0.0.1:8000";
  return `${baseURL}/storage/${path}`;
}
