import {
  ProfileData,
  ProjectItem,
  SkillCategory,
  Certification,
  EducationItem,
  ExperienceItem,
  ContactMessage,
  AdminStats,
  AuthResponse
} from '../types/portfolio';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:8080';

export function isApiConfigured(): boolean {
  return Boolean(API_BASE);
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function fetchProfile(): Promise<ProfileData | null> {
  try {
    const res = await fetch(`${API_BASE}/api/profile`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchProjects(): Promise<ProjectItem[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchSkills(): Promise<SkillCategory[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/skills`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchCertifications(): Promise<Certification[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/certifications`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchEducation(): Promise<EducationItem[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/education`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchExperience(): Promise<ExperienceItem[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/experience`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function submitContactMessage(payload: ContactPayload): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Signal lost during transmission.' };
    }
    const data = await res.json();
    return { success: true, message: data.status || 'Transmission successfully logged in Hawkins archives.' };
  } catch (err) {
    return { success: false, message: 'Transmission relay offline. Please send direct message via email.' };
  }
}

export async function adminLogin(username: string, password: string): Promise<AuthResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAdminTransmissions(token: string): Promise<ContactMessage[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAdminStats(token: string): Promise<AdminStats | null> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}
