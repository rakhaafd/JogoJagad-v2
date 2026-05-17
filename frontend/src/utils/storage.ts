export function getStorageUrl(path: string): string {
  const baseURL = import.meta.env.VITE_URL_API
    ? import.meta.env.VITE_URL_API.replace(/\/?api\/?$/, "")
    : "";
  return `${baseURL}/storage/${path}`;
}
