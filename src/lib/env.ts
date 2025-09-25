export const env = {
  API_BASE_URL: (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, ""),
};

export function assertEnv(): void {
  if (!env.API_BASE_URL) {
    // eslint-disable-next-line no-console
    console.warn("VITE_API_BASE_URL is not set. API requests will fail.");
  }
}
