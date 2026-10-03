import type { ApiErrorBody } from "@nakka/types/users";

// VITE_API_URL is the backend's address (e.g. http://localhost:8080); routes live under /api.
const API_URL = `${(import.meta.env.VITE_API_URL ?? "http://localhost:8080").replace(/\/+$/, "")}/api`;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

// Calls the backend. Pass `token` for endpoints that need a signed-in user.
export async function request<T>(
  path: string,
  { token, ...init }: RequestInit & { token?: string } = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(
      "Can't reach the server. Check your connection and try again.",
      0,
    );
  }

  if (response.status === 204) return undefined as T;
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = (body as ApiErrorBody | null)?.message;
    throw new ApiError(
      (Array.isArray(message) ? message[0] : message) ??
        "Something went wrong. Please try again.",
      response.status,
    );
  }
  return body as T;
}
