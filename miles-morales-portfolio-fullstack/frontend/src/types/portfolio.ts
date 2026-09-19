export type WorldMode = 'hawkins' | 'upsidedown';

export interface ProfileData {
  id: number;
  name: string;
  heroCodename?: string;
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

export interface ProjectItem {
  id: string;
  missionNumber: string;
  title: string;
  subtitle: string;
  dates: string;
  sector: string;
  summary: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  accentColor: string;
  displayOrder: number;
  techStack: string[];
  bullets: string[];
  metrics: string[];
}

export interface SkillCategory {
  id: number;
  category: string;
  suitModule?: string;
  icon: string;
  description: string;
  displayOrder: number;
  skills: string[];
}

export interface Certification {
  id: number;
  title: string;
  issuer?: string | null;
  dates?: string | null;
  link?: string | null;
  type: 'internship' | 'workshop' | 'certification' | 'practice';
  description: string;
  displayOrder: number;
}

export interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  cgpa: string;
  timeline: string;
  relevantCoursework: string[];
}

export interface ExperienceItem {
  id: number;
  role: string;
  organization: string;
  dates: string;
  location: string;
  type: string;
  description: string;
  bullets: string[];
  techStack: string[];
  displayOrder: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}

export interface AdminStats {
  totalMessages: number;
  totalProjects: number;
  totalSkills: number;
  totalCertifications: number;
  systemStatus: string;
  databaseEngine: string;
  environment: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  role: string;
  expiresInMs: number;
}
