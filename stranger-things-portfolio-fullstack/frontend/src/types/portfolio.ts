export interface ProfileData {
  id?: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  leetcodeUrl: string;
  location: string;
  avatarUrl?: string;
}

export interface ProjectItem {
  id?: number;
  title: string;
  description: string;
  techStack: string;
  githubUrl: string;
  liveUrl?: string | null;
  imageUrl?: string | null;
  featured: boolean;
  displayOrder: number;
}

export interface SkillItem {
  id?: number;
  name: string;
  proficiency: number;
}

export interface SkillCategory {
  id?: number;
  categoryName: string;
  displayOrder: number;
  skills: SkillItem[];
}

export interface Certification {
  id?: number;
  title: string;
  issuer: string;
  issuedDate: string;
  credentialUrl?: string | null;
  description: string;
}

export interface EducationItem {
  id?: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  cgpa: string;
  startYear: number;
  endYear: number;
  expected: boolean;
  description: string;
}

export interface ExperienceItem {
  id?: number;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  skillsUsed: string;
}

export interface ContactMessage {
  id?: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  submittedAt?: string;
  isRead?: boolean;
}

export interface AdminStats {
  totalProjects: number;
  totalSkillCategories: number;
  totalCertifications: number;
  totalMessages: number;
  unreadMessages: number;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  expiresIn: number;
}
