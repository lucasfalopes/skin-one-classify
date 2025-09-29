import { getAuthHeader } from "./auth";

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
    this.baseUrl = (options.baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  private buildUrl(path: string): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${this.baseUrl}${cleanPath}`;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
    const headers: HeadersInit = {
      ...getAuthHeader(),
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    };

    const response = await withTimeout(
      this.fetchImpl(this.buildUrl(path), { ...init, headers })
    );

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await response.json().catch(() => null) : await response.text();

    if (!response.ok) {
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
    return this.request<T>(path, { method: "PUT", body: JSON.stringify(data) });
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

export interface UploadResponse { upload_batch_id: string; uploaded: number }
export interface ClassifyRequest {
  image_id: string;
  stage: "estagio1" | "estagio2" | "estagio3" | "estagio4" | "nao_classificavel" | "dtpi";
  observations?: string;
}
export interface ClassifyResponse { id: string; image_id: string; stage: string; created_at: string }

export const endpoints = {
  register: () => "/auth/register/",
  login: () => "/auth/login/",
  me: () => "/auth/me/",
  upload: () => "/images/upload/",
  listImages: () => "/images/",
  classify: () => "/classifications/",
};
