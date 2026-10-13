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

// Downloads a file from the backend (e.g. a PDF) and saves it in the browser.
// The server's Content-Disposition names the file; `fallbackName` is used otherwise.
export async function download(path: string, fallbackName: string, token?: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    const message = body?.message;
    throw new ApiError(
      (Array.isArray(message) ? message[0] : message) ?? "Could not download the file. Please try again.",
      response.status,
    );
  }
  const name =
    /filename="?([^";]+)"?/.exec(response.headers.get("Content-Disposition") ?? "")?.[1] ?? fallbackName;
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
