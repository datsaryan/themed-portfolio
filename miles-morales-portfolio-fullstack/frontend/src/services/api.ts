// Thin client for the backend REST API. If VITE_API_BASE_URL isn't set, or the
// backend isn't reachable, callers fall back to the static resumeData.ts
// content — the site works standalone even with no backend deployed.

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');

export function isApiConfigured(): boolean {
  return Boolean(API_BASE);
}

export type FetchFailure = 'not-configured' | 'http' | 'network' | 'timeout' | 'aborted';
export type FetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: FetchFailure; status?: number };

interface RequestOptions {
  /** Caller-owned cancellation (e.g. a retry superseding this attempt). */
  signal?: AbortSignal;
  /** Hard cap so a hung backend can't hold the caller forever. */
  timeoutMs?: number;
}

// Unlike getJson, this reports *why* a request failed, which the boot
// cinematic needs to tell "backend is down" from "nothing to fetch".
async function request<T>(path: string, opts: RequestOptions = {}): Promise<FetchResult<T>> {
  if (!API_BASE) return { ok: false, reason: 'not-configured' };

  const controller = new AbortController();
  let timedOut = false;
  const timer = opts.timeoutMs
    ? setTimeout(() => { timedOut = true; controller.abort(); }, opts.timeoutMs)
    : undefined;
  const onCallerAbort = () => controller.abort();
  opts.signal?.addEventListener('abort', onCallerAbort, { once: true });
  if (opts.signal?.aborted) controller.abort();

  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
    if (!res.ok) return { ok: false, reason: 'http', status: res.status };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    if (timedOut) return { ok: false, reason: 'timeout' };
    if (controller.signal.aborted) return { ok: false, reason: 'aborted' };
    return { ok: false, reason: 'network' };
  } finally {
    if (timer) clearTimeout(timer);
    opts.signal?.removeEventListener('abort', onCallerAbort);
  }
}

async function getJson<T>(path: string): Promise<T | null> {
  const result = await request<T>(path);
  if (result.ok) return result.data;
  if (result.reason !== 'not-configured') {
    console.warn(`[api] GET ${path} failed (${result.reason}), using static fallback`);
  }
  return null;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function submitContactMessage(payload: ContactPayload): Promise<boolean> {
  if (!API_BASE) return false;
  // Cap how long the visitor waits before we fall back to the mailto flow.
  // A free-tier backend cold start or a network hiccup should never leave
  // the send button hanging indefinitely.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return res.ok;
  } catch (err) {
    console.warn('[api] POST /api/contact failed', err);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = { getJson, request };
