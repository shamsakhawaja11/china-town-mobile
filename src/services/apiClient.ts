import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/api';

export type ApiErrorKind = 'network' | 'timeout' | 'http';

export class ApiError extends Error {
  status: number;
  kind: ApiErrorKind;

  constructor(message: string, status: number, kind: ApiErrorKind) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = 'ApiError';
    this.status = status;
    this.kind = kind;
  }
}       

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

function extractMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;
    if (Array.isArray(message)) {
      return message.filter((m) => typeof m === 'string').join('\n');
    }
    if (typeof message === 'string') {
      return message;
    }
  }
  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers } = options;

  const controller = new AbortController();

  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if ((error as { name?: string })?.name === 'AbortError') {
      throw new ApiError(
        'The server took too long to respond. Please try again.',
        0,
        'timeout',
      );
    }
    throw new ApiError(
      "Can't reach the server. Check your connection and try again.",
      0,
      'network',
    );
  } finally {
    clearTimeout(timer);
  }

  const text = await response.text();
  let data: unknown;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = undefined;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      extractMessage(data, `Request failed with status ${response.status}`),
      response.status,
      'http',
    );
  }

  return data as T;
}