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
import { api } from '../services/api';

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

let hasFetched = false;

async function fetchLiveData() {
  if (hasFetched) return;
  hasFetched = true;

  const [profile, missions, skillCategories, credentials] = await Promise.all([
    api.getJson<{
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
    }>('/api/profile'),
    api.getJson<ProjectItem[]>('/api/projects'),
    api.getJson<SkillCategory[]>('/api/skills'),
    api.getJson<CertificationItem[]>('/api/certifications'),
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
  // Fire-and-forget: safe to call on every render, only does work once.
  void fetchLiveData();
  return useSyncExternalStore(subscribe, getSnapshot);
}
