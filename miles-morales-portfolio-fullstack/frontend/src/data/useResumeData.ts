import { useSyncExternalStore } from 'react';
import { RESUME_DATA } from './resumeData';
import {
  fetchProfile,
  fetchProjects,
  fetchSkills,
  fetchCertifications,
  fetchEducation,
  fetchExperience
} from '../services/api';

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

  try {
    const [profile, projects, skills, certs, education, experience] = await Promise.all([
      fetchProfile(),
      fetchProjects(),
      fetchSkills(),
      fetchCertifications(),
      fetchEducation(),
      fetchExperience()
    ]);

    const updates: Partial<ResumeDataShape> = {};

    if (profile) {
      updates.personal = profile;
    }
    if (projects && projects.length > 0) {
      updates.projects = projects;
    }
    if (skills && skills.length > 0) {
      updates.skills = skills;
    }
    if (certs && certs.length > 0) {
      updates.certifications = certs;
    }
    if (education && education.length > 0) {
      updates.education = education;
    }
    if (experience && experience.length > 0) {
      updates.experience = experience;
    }

    if (Object.keys(updates).length > 0) {
      setState(updates);
    }
  } catch (err) {
    // Graceful fallback to static resumeData.ts
  }
}

export function useResumeData(): ResumeDataShape {
  void fetchLiveData();
  return useSyncExternalStore(subscribe, getSnapshot);
}
