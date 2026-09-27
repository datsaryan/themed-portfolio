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

const BASE_URL = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('stranger_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function fetchProfile(): Promise<ProfileData> {
  const res = await fetch(`${BASE_URL}/profile`);
  if (!res.ok) throw new Error(`Failed to fetch profile: ${res.statusText}`);
  return res.json();
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  const res = await fetch(`${BASE_URL}/projects`);
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.statusText}`);
  return res.json();
}

export async function fetchSkills(): Promise<SkillCategory[]> {
  const res = await fetch(`${BASE_URL}/skills`);
  if (!res.ok) throw new Error(`Failed to fetch skills: ${res.statusText}`);
  return res.json();
}

export async function fetchCertifications(): Promise<Certification[]> {
  const res = await fetch(`${BASE_URL}/certifications`);
  if (!res.ok) throw new Error(`Failed to fetch certifications: ${res.statusText}`);
  return res.json();
}

export async function fetchEducation(): Promise<EducationItem[]> {
  const res = await fetch(`${BASE_URL}/education`);
  if (!res.ok) throw new Error(`Failed to fetch education: ${res.statusText}`);
  return res.json();
}

export async function fetchExperience(): Promise<ExperienceItem[]> {
  const res = await fetch(`${BASE_URL}/experience`);
  if (!res.ok) throw new Error(`Failed to fetch experience: ${res.statusText}`);
  return res.json();
}

export async function submitContactMessage(message: {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}): Promise<{ id: number; status: string }> {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Transmission failed');
  }
  return res.json();
}

export async function adminLogin(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    throw new Error('Access Denied: Invalid credentials');
  }
  const data: AuthResponse = await res.json();
  localStorage.setItem('stranger_token', data.token);
  return data;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${BASE_URL}/admin/stats`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to fetch admin stats: ${res.statusText}`);
  return res.json();
}

export async function fetchAdminTransmissions(): Promise<ContactMessage[]> {
  const res = await fetch(`${BASE_URL}/admin/transmissions`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to fetch transmissions: ${res.statusText}`);
  return res.json();
}

export async function markTransmissionRead(id: number): Promise<void> {
  await fetch(`${BASE_URL}/admin/transmissions/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
}
