import { getAuthHeader } from "./auth";
import { env } from "./env";

// CSRF helpers (for Django-style CSRF protection)
function readCookie(name: string): string | null {
  try {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie?.split(";") ?? [];
    for (const c of cookies) {
      const [rawKey, ...rest] = c.trim().split("=");
      if (rawKey === name) {
        return decodeURIComponent(rest.join("="));
      }
    }
    return null;
  } catch {
    return null;
  }
}

function getCsrfToken(): string | null {
  // Common cookie names: Django uses 'csrftoken'; some setups use 'XSRF-TOKEN' or 'csrf_token'
  return (
    readCookie("csrftoken") ??
    readCookie("XSRF-TOKEN") ??
    readCookie("csrf_token") ??
    null
  );
}

function isCsrfProtectedMethod(method?: string): boolean {
  const m = (method ?? "GET").toUpperCase();
  return !["GET", "HEAD", "OPTIONS", "TRACE"].includes(m);
}

export interface ApiClientOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const DEFAULT_TIMEOUT_MS = 30_000;

function withTimeout<T>(promise: Promise<T>, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new ApiError("Request timed out", 408));
    }, timeoutMs);
  });
  return Promise.race([promise, timeout]);
}

export class ApiClient {
  private baseUrl: string;
  private fetchImpl: typeof fetch;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? env.API_BASE_URL ?? "").replace(/\/$/, "");
    const rawFetch = (options.fetchImpl ?? (globalThis as any).fetch) as typeof fetch;
    // Bind to globalThis to avoid "Illegal invocation" in some browsers when called as a method
    this.fetchImpl = rawFetch.bind(globalThis) as typeof fetch;
  }

  private buildUrl(path: string): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${this.baseUrl}${cleanPath}`;
  }

  private async ensureCsrfCookie(): Promise<void> {
    if (typeof document === "undefined") return;
    if (getCsrfToken()) return;
    try {
      // Prefer a dedicated CSRF endpoint if available
      const tryUrls = ["/auth/csrf/", "/auth/me/"];
      for (const p of tryUrls) {
        try {
          await this.fetchImpl(this.buildUrl(p), {
            method: "GET",
            credentials: "include",
            headers: { "X-Requested-With": "XMLHttpRequest" },
          });
          if (getCsrfToken()) break;
        } catch {}
      }
    } catch {}
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
    const method = (init.method || "GET").toUpperCase();
    const headers: HeadersInit = {
      ...getAuthHeader(),
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    };

    // Attempt to ensure CSRF cookie exists for unsafe methods
    if (isCsrfProtectedMethod(method) && typeof document !== "undefined" && !getCsrfToken()) {
      await this.ensureCsrfCookie();
    }

    // Add CSRF header for unsafe methods when a CSRF cookie is present
    if (isCsrfProtectedMethod(method)) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        (headers as Record<string, string>)["X-CSRFToken"] = csrfToken;
      }
      // Helps some backends distinguish AJAX requests
      (headers as Record<string, string>)["X-Requested-With"] = "XMLHttpRequest";
    }

    if (import.meta.env.DEV) {
      try {
        const isJsonBody = !isFormData && init.body && typeof init.body === "string";
        const parsed = isJsonBody ? JSON.parse(init.body as string) : undefined;
        const safe = parsed && typeof parsed === "object" && parsed !== null && "password" in parsed
          ? { ...(parsed as any), password: "***" }
          : parsed;
        // eslint-disable-next-line no-console
        console.log("[DEBUG] request", { url: this.buildUrl(path), method: init.method || "GET", body: safe });
      } catch {}
    }

    const response = await withTimeout(
      this.fetchImpl(this.buildUrl(path), {
        // Always include credentials so CSRF/session cookies are sent/received
        credentials: "include",
        ...init,
        headers,
      })
    );

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await response.json().catch(() => null) : await response.text();

    if (!response.ok) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log("[DEBUG] response-error", {
          url: this.buildUrl(path),
          method: init.method || "GET",
          status: response.status,
          body,
        });
      }
      throw new ApiError(
        (isJson && body && (body.message || body.detail)) || response.statusText || "Request failed",
        response.status,
        body
      );
    }

    return body as T;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  post<T>(path: string, data?: unknown): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data ?? {});
    return this.request<T>(path, { method: "POST", body });
  }

  put<T>(path: string, data?: unknown): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data ?? {});
    return this.request<T>(path, { method: "PUT", body });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export const api = new ApiClient();

// Domain types
export interface LoginResponse { token: string; user: { id: string; name: string; email: string } }
export interface RegisterRequest { name: string; email: string; password: string; coren: string; specialty: string; institution: string }
export interface LoginRequest { email: string; password: string }

export interface UploadResponse { success: boolean; error?: string }
export interface UploadedImage { id: string; url: string }
export interface UploadSingleResponse { image: UploadedImage }
export interface UploadBatchWithStageResponse { upload_batch_id: string; uploaded: number; stage: ClassifyRequest["stage"]; classified?: number }
export interface ClassifyRequest {
  image_id: string;
  stage: "estagio1" | "estagio2" | "estagio3" | "estagio4" | "nao_classificavel" | "dtpi";
  observations?: string;
}
export interface ClassifyResponse { id: string; image_id: string; stage: string; created_at: string }

// Admin types
export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  classification_count: number;
  last_active?: string;
}

export interface AdminMetrics {
  total_users: number;
  total_images: number;
  classified_images_count: number;
  unclassified_images_count: number;
  classifications_per_category: Record<string, number>;
  classifications_by_user: AdminUserSummary[];
  daily_classifications?: Array<{ date: string; count: number }>;
}

export const endpoints = {
  register: () => "/auth/register/",
  login: () => "/auth/login/",
  // Present in some screens for compatibility; can be no-op on backend
  loginWithGoogle: () => "/auth/google/",
  me: () => "/auth/me/",
  upload: () => "/images/upload/",
  uploadSingle: () => "/images/upload/single/",
  uploadBatchWithStage: (stage: ClassifyRequest["stage"]) => `/images/upload/with-stage/?stage=${encodeURIComponent(stage)}`,
  listImages: () => "/images/",
  classify: () => "/classifications/",
  admin: {
    metrics: (params?: { from?: string; to?: string }) => {
      const search = new URLSearchParams();
      if (params?.from) search.set("from", params.from);
      if (params?.to) search.set("to", params.to);
      const qs = search.toString();
      return `/admin/metrics/${qs ? `?${qs}` : ""}`;
    },
    users: (params?: { q?: string; limit?: number; offset?: number }) => {
      const search = new URLSearchParams();
      if (params?.q) search.set("q", params.q);
      if (typeof params?.limit === "number") search.set("limit", String(params.limit));
      if (typeof params?.offset === "number") search.set("offset", String(params.offset));
      const qs = search.toString();
      return `/admin/users/${qs ? `?${qs}` : ""}`;
    },
  },
};
