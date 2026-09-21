// Thin client for the backend REST API. If VITE_API_BASE_URL isn't set, or the
// backend isn't reachable, callers fall back to the static resumeData.ts
// content — the site works standalone even with no backend deployed.

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');

export function isApiConfigured(): boolean {
  return Boolean(API_BASE);
}

async function getJson<T>(path: string): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[api] GET ${path} failed, using static fallback`, err);
    return null;
  }
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

export const api = { getJson };
