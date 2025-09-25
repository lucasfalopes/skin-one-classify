export const TOKEN_STORAGE_KEY = "skinone-token";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    // Let other tabs know
    window.dispatchEvent(new StorageEvent("storage", { key: TOKEN_STORAGE_KEY, newValue: token }));
  } catch {
    // ignore
  }
}

export function clearAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.dispatchEvent(new StorageEvent("storage", { key: TOKEN_STORAGE_KEY, newValue: null }));
  } catch {
    // ignore
  }
}

export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
