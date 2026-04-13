export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiErrorResponse | null;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  signal?: AbortSignal;
}

const DEFAULT_TIMEOUT = 10000;

class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static fromResponse(response: Response, data?: ApiErrorResponse): ApiError {
    const code = data?.code || `HTTP_${response.status}`;
    const message = data?.message || response.statusText || "An error occurred";
    return new ApiError(message, code, response.status, data?.details);
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number },
  retries = 3
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error as Error;

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout", "TIMEOUT", 408);
      }

      if (attempt < retries - 1) {
        const backoff = Math.min(1000 * Math.pow(2, attempt), 4000);
        await delay(backoff);
      }
    }
  }

  throw new ApiError(
    lastError?.message || "Request failed",
    "REQUEST_FAILED",
    0
  );
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = `${this.baseUrl}${endpoint}`;

    if (!params) return url;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  private getAuthHeaders(): Record<string, string> {
    return {};
  }

  private mergeHeaders(
    customHeaders?: HeadersInit,
    options?: RequestOptions
  ): HeadersInit {
    const headers = new Headers(options?.headers);

    const authHeaders = this.getAuthHeaders();
    Object.entries(authHeaders).forEach(([key, value]) => {
      if (!headers.has(key)) {
        headers.set(key, value);
      }
    });

    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    if (!headers.has("Content-Type") && !headers.has("content-type")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeout = DEFAULT_TIMEOUT, headers, params, ...rest } = options;

    const url = this.buildUrl(endpoint, params);
    const mergedHeaders = this.mergeHeaders(headers, options);

    const response = await fetchWithTimeout(
      url,
      {
        ...rest,
        headers: mergedHeaders,
        credentials: "include",
      },
      options.signal ? 1 : 3
    );

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw ApiError.fromResponse(response, data);
    }

    if (data && typeof data === "object" && "data" in data) {
      return data as T;
    }

    return data as T;
  }

  async get<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
      signal: config?.signal,
    });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: config?.headers,
      timeout: config?.timeout,
      signal: config?.signal,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: config?.headers,
      timeout: config?.timeout,
      signal: config?.signal,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: config?.headers,
      timeout: config?.timeout,
      signal: config?.signal,
    });
  }

  async delete<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers: config?.headers,
      timeout: config?.timeout,
      signal: config?.signal,
    });
  }
}

export const apiClient = new ApiClient();

export { ApiError };
