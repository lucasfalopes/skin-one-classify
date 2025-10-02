export const TOKEN_STORAGE_KEY = "skinone-token";

export function getAuthToken(): string | null {
  try {
    const fromStorage = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (fromStorage) return fromStorage;
    // Fallback to cookies
    if (typeof document !== "undefined") {
      const cookies = document.cookie?.split(";") ?? [];
      for (const c of cookies) {
        const [rawKey, ...rest] = c.trim().split("=");
        if (rawKey === TOKEN_STORAGE_KEY) {
          return decodeURIComponent(rest.join("="));
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    // Let other tabs know
    window.dispatchEvent(new StorageEvent("storage", { key: TOKEN_STORAGE_KEY, newValue: token }));
    // Also persist in cookie to remember sessions
    try {
      const isSecure = typeof window !== "undefined" && window.location && window.location.protocol === "https:";
      const attrs = [
        `${TOKEN_STORAGE_KEY}=${encodeURIComponent(token)}`,
        "Path=/",
        "SameSite=Lax",
        // 30 days
        `Max-Age=${60 * 60 * 24 * 30}`,
      ];
      if (isSecure) attrs.push("Secure");
      document.cookie = attrs.join("; ");
    } catch {}
  } catch {
    // ignore
  }
}

export function clearAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.dispatchEvent(new StorageEvent("storage", { key: TOKEN_STORAGE_KEY, newValue: null }));
    try {
      // Delete cookie
      document.cookie = `${TOKEN_STORAGE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
    } catch {}
  } catch {
    // ignore
  }
}

export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
