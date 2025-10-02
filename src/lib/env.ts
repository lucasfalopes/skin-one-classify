const inferredDefaultBaseUrl = (() => {
  // Prefer explicit env
  const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (fromEnv && typeof fromEnv === "string" && fromEnv.trim() !== "") return fromEnv;
  // In dev, default to Vite proxy path to avoid CORS
  if (import.meta.env.DEV) return "/api";
  // In prod, fallback to same-origin API
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "";
})();

export const env = {
  API_BASE_URL: inferredDefaultBaseUrl.replace(/\/$/, ""),
};

export function assertEnv(): void {
  if (!env.API_BASE_URL) {
    // eslint-disable-next-line no-console
    console.warn("VITE_API_BASE_URL is not set. API requests will fail.");
  }
}
