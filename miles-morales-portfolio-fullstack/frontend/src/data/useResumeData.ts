// Serves RESUME_DATA-shaped content to components, synchronously and from a
// static fallback on first render (so the UI never has to show a loading
// state), then silently upgrades to live backend data in the background if
// VITE_API_BASE_URL is configured and reachable.
//
// This is the seam between the frontend and backend: every component below
// keeps reading the same shape it always did (personal, education, missions,
// skillCategories, credentials) — only the *source* of that data changes.

import { useSyncExternalStore } from 'react';
import { RESUME_DATA, ProjectItem, SkillCategory, CertificationItem } from './resumeData';
import { api, isApiConfigured } from '../services/api';
import { LOAD } from '../boot/bootConfig';

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

export type LoadOutcome = 'ok' | 'failed';

interface ProfileDto {
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
}

// One shared in-flight load. Every caller (the boot cinematic, every
// useResumeData() render, StrictMode's double-mount) gets the same promise, so
// the backend is only ever hit once per attempt.
let inflight: Promise<LoadOutcome> | null = null;
let controller: AbortController | null = null;

/** Dev-only: ?simulate=fail|500|slow exercises the boot cinematic's paths. */
function readSimulation(): 'fail' | '500' | 'slow' | null {
  if (!import.meta.env.DEV) return null;
  const v = new URLSearchParams(window.location.search).get('simulate');
  return v === 'fail' || v === '500' || v === 'slow' ? v : null;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function runLoad(signal: AbortSignal): Promise<LoadOutcome> {
  const sim = readSimulation();
  if (sim === 'fail' || sim === '500') {
    await sleep(600);
    return 'failed';
  }
  if (sim === 'slow') await sleep(LOAD.TIMEOUT_S * 1000 + 2000);

  // No backend configured => the static content *is* the app; nothing to wait on.
  if (!isApiConfigured()) return 'ok';

  const opts = { signal, timeoutMs: LOAD.REQUEST_TIMEOUT_MS };
  const [profile, missions, skillCategories, credentials] = await Promise.all([
    api.request<ProfileDto>('/api/profile', opts),
    api.request<ProjectItem[]>('/api/projects', opts),
    api.request<SkillCategory[]>('/api/skills', opts),
    api.request<CertificationItem[]>('/api/certifications', opts),
  ]);
  if (signal.aborted) return 'failed';

  const updates: Partial<ResumeDataShape> = {};

  if (profile.ok) {
    const p = profile.data;
    updates.personal = {
      name: p.name,
      heroCodename: p.heroCodename,
      title: p.title,
      tagline: p.tagline,
      phone: p.phone,
      email: p.email,
      location: p.location,
      status: p.status,
      links: {
        github: p.githubUrl,
        linkedin: p.linkedinUrl,
        leetcode: p.leetcodeUrl,
        resumePdf: p.resumePdfPath,
      },
      summary: p.summary,
    };
    updates.education = {
      institution: p.institution,
      degree: p.degree,
      cgpa: p.cgpa,
      timeline: p.timeline,
      relevantCoursework: p.relevantCoursework,
    };
  }

  if (missions.ok && missions.data.length) updates.missions = missions.data;
  if (skillCategories.ok && skillCategories.data.length) updates.skillCategories = skillCategories.data;
  if (credentials.ok && credentials.data.length) updates.credentials = credentials.data;

  if (Object.keys(updates).length) setState(updates);

  // The profile is the readiness gate. Secondary endpoints failing just means
  // those sections keep their static content, exactly as before.
  return profile.ok ? 'ok' : 'failed';
}

/** Start (or join) the live-data load. Safe to call from anywhere, any number of times. */
export function loadLiveData(): Promise<LoadOutcome> {
  if (!inflight) {
    controller = new AbortController();
    inflight = runLoad(controller.signal);
  }
  return inflight;
}

/** Abort the current attempt and start a clean one (used by "Try again"). */
export function restartLiveData(): Promise<LoadOutcome> {
  controller?.abort();
  inflight = null;
  return loadLiveData();
}

export function useResumeData(): ResumeDataShape {
  // Fire-and-forget: safe to call on every render, only does work once.
  void loadLiveData();
  return useSyncExternalStore(subscribe, getSnapshot);
}
