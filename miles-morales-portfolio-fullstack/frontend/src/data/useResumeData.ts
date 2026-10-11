// Serves RESUME_DATA-shaped content to components, synchronously and from a
// static fallback on first render (so the UI never has to show a loading
// state), then silently upgrades to live backend data in the background if
// VITE_API_BASE_URL is configured and reachable.
//
// This is the seam between the frontend and backend: every component below
// keeps reading the same shape it always did (personal, education, missions,
// skillCategories, credentials) — only the *source* of that data changes.

import { useEffect, useSyncExternalStore } from 'react';
import { RESUME_DATA, ProjectItem, SkillCategory, CertificationItem } from './resumeData';
import { api, ApiError, ApiErrorKind, isApiConfigured } from '../services/api';
import { BOOT_TIMEOUT_MS } from '../boot/bootConfig';
import { BootSimulation, getBootSimulation } from '../boot/bootDebug';

type ResumeDataShape = typeof RESUME_DATA;

let state: ResumeDataShape = RESUME_DATA;
const listeners = new Set<() => void>();

function setState(partial: Partial<ResumeDataShape>) {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

// ---------------------------------------------------------------------------
// Load status. The boot cinematic (src/boot) reacts to this — it is the real
// "is the app/API ready" signal, not a timer.
//   idle    – nothing requested yet
//   loading – the backend calls are in flight
//   ready   – live backend data applied
//   static  – no backend configured; the built-in content is the source
//   failed  – a backend call errored or the timeout elapsed (fallback content
//             still works, so the UI can offer "enter anyway")
// ---------------------------------------------------------------------------
export type ResumeLoadStatus = 'idle' | 'loading' | 'ready' | 'static' | 'failed';

export interface LoadFailure {
  kind: ApiErrorKind | 'unknown';
  status?: number;
  path?: string;
  message: string;
}

export interface ResumeLoadState {
  status: ResumeLoadStatus;
  failure: LoadFailure | null;
  attempt: number;
}

let loadState: ResumeLoadState = { status: 'idle', failure: null, attempt: 0 };
const loadListeners = new Set<() => void>();
let inflight: Promise<void> | null = null;

function setLoadState(next: ResumeLoadState) {
  loadState = next;
  loadListeners.forEach((l) => l());
}

export function subscribeResumeLoad(listener: () => void) {
  loadListeners.add(listener);
  return () => {
    loadListeners.delete(listener);
  };
}

export function getResumeLoadState() {
  return loadState;
}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new ApiError('aborted', 'Request aborted'));
      },
      { once: true }
    );
  });
}

// Dev/QA rehearsal of each outcome (see boot/bootDebug.ts).
async function simulate(mode: BootSimulation, attempt: number, signal: AbortSignal) {
  switch (mode) {
    case 'fast':
      return sleep(150, signal);
    case 'slow':
      return sleep(5500, signal);
    case 'timeout':
      return sleep(BOOT_TIMEOUT_MS * 3, signal); // never settles before the real timeout
    case 'fail':
    case 'fail-always':
      await sleep(700, signal);
      if (mode === 'fail-always' || attempt === 1) throw new ApiError('http', 'HTTP 500', 500, '/api/projects');
      return;
    case 'down':
    case 'down-always':
      await sleep(400, signal);
      if (mode === 'down-always' || attempt === 1) throw new ApiError('network', 'Failed to fetch', undefined, '/api/profile');
      return;
  }
}

async function runLoad(attempt: number) {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, BOOT_TIMEOUT_MS);

  try {
    const sim = getBootSimulation();
    if (sim) {
      await simulate(sim, attempt, controller.signal);
    } else {
      await fetchLiveData(controller.signal);
    }
    setLoadState({ status: sim || isApiConfigured() ? 'ready' : 'static', failure: null, attempt });
  } catch (err) {
    controller.abort(); // cancel any sibling requests still in flight
    const failure: LoadFailure = timedOut
      ? { kind: 'timeout', message: `No response within ${BOOT_TIMEOUT_MS / 1000}s` }
      : err instanceof ApiError
        ? { kind: err.kind, status: err.status, path: err.path, message: err.message }
        : { kind: 'unknown', message: err instanceof Error ? err.message : 'Unknown error' };
    setLoadState({ status: 'failed', failure, attempt });
  } finally {
    clearTimeout(timer);
    inflight = null;
  }
}

/**
 * Starts (or joins) the single load. Concurrent callers share one in-flight
 * promise, so there is never a duplicate API call; only an explicit retry
 * (after a failure) starts a new attempt.
 */
export function loadResume(options?: { force?: boolean }): Promise<void> {
  if (inflight) return inflight;
  if (!options?.force && loadState.status !== 'idle') return Promise.resolve();

  if (!isApiConfigured() && !getBootSimulation()) {
    setLoadState({ status: 'static', failure: null, attempt: loadState.attempt });
    return Promise.resolve();
  }

  const attempt = loadState.attempt + 1;
  setLoadState({ status: 'loading', failure: null, attempt });
  inflight = runLoad(attempt);
  return inflight;
}

export function retryResumeLoad() {
  return loadResume({ force: true });
}

async function fetchLiveData(signal: AbortSignal) {
  const [profile, missions, skillCategories, credentials] = await Promise.all([
    api.fetchJson<{
      name: string;
      heroCodename: string;
      title: string;
      tagline: string;
      phone: string;
      email: string;
      location: string;
      status: string;
      githubUrl: string;
      linkedinUrl: string;
      leetcodeUrl: string;
      resumePdfPath: string;
      summary: string;
      institution: string;
      degree: string;
      cgpa: string;
      timeline: string;
      relevantCoursework: string[];
    }>('/api/profile', signal),
    api.fetchJson<ProjectItem[]>('/api/projects', signal),
    api.fetchJson<SkillCategory[]>('/api/skills', signal),
    api.fetchJson<CertificationItem[]>('/api/certifications', signal),
  ]);

  const updates: Partial<ResumeDataShape> = {};

  if (profile) {
    updates.personal = {
      name: profile.name,
      heroCodename: profile.heroCodename,
      title: profile.title,
      tagline: profile.tagline,
      phone: profile.phone,
      email: profile.email,
      location: profile.location,
      status: profile.status,
      links: {
        github: profile.githubUrl,
        linkedin: profile.linkedinUrl,
        leetcode: profile.leetcodeUrl,
        resumePdf: profile.resumePdfPath,
      },
      summary: profile.summary,
    };
    updates.education = {
      institution: profile.institution,
      degree: profile.degree,
      cgpa: profile.cgpa,
      timeline: profile.timeline,
      relevantCoursework: profile.relevantCoursework,
    };
  }

  if (missions && missions.length) updates.missions = missions;
  if (skillCategories && skillCategories.length) updates.skillCategories = skillCategories;
  if (credentials && credentials.length) updates.credentials = credentials;

  if (Object.keys(updates).length) setState(updates);
}

export function useResumeData(): ResumeDataShape {
  // Safe on every render: loadResume() is idempotent and dedupes. It runs in
  // an effect (not during render) so store updates can't trigger React's
  // "update while rendering" warning.
  useEffect(() => {
    void loadResume();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useResumeLoadState(): ResumeLoadState {
  return useSyncExternalStore(subscribeResumeLoad, getResumeLoadState);
}
