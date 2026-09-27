import { useState, useEffect } from 'react';
import {
  ProfileData,
  ProjectItem,
  SkillCategory,
  Certification,
  EducationItem,
  ExperienceItem
} from '../types/portfolio';
import {
  FALLBACK_PROFILE,
  FALLBACK_PROJECTS,
  FALLBACK_SKILLS,
  FALLBACK_CERTIFICATIONS,
  FALLBACK_EDUCATION,
  FALLBACK_EXPERIENCE
} from './resumeData';
import {
  fetchProfile,
  fetchProjects,
  fetchSkills,
  fetchCertifications,
  fetchEducation,
  fetchExperience
} from '../services/api';

export interface UseResumeDataReturn {
  profile: ProfileData;
  projects: ProjectItem[];
  skills: SkillCategory[];
  certifications: Certification[];
  education: EducationItem[];
  experience: ExperienceItem[];
  isLoadedFromApi: boolean;
  isLoading: boolean;
}

export function useResumeData(): UseResumeDataReturn {
  const [profile, setProfile] = useState<ProfileData>(FALLBACK_PROFILE);
  const [projects, setProjects] = useState<ProjectItem[]>(FALLBACK_PROJECTS);
  const [skills, setSkills] = useState<SkillCategory[]>(FALLBACK_SKILLS);
  const [certifications, setCertifications] = useState<Certification[]>(FALLBACK_CERTIFICATIONS);
  const [education, setEducation] = useState<EducationItem[]>(FALLBACK_EDUCATION);
  const [experience, setExperience] = useState<ExperienceItem[]>(FALLBACK_EXPERIENCE);
  const [isLoadedFromApi, setIsLoadedFromApi] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAll() {
      try {
        const [
          profileRes,
          projectsRes,
          skillsRes,
          certsRes,
          eduRes,
          expRes
        ] = await Promise.all([
          fetchProfile().catch(() => null),
          fetchProjects().catch(() => null),
          fetchSkills().catch(() => null),
          fetchCertifications().catch(() => null),
          fetchEducation().catch(() => null),
          fetchExperience().catch(() => null)
        ]);

        if (!isMounted) return;

        if (profileRes) setProfile(profileRes);
        if (projectsRes && projectsRes.length > 0) setProjects(projectsRes);
        if (skillsRes && skillsRes.length > 0) setSkills(skillsRes);
        if (certsRes && certsRes.length > 0) setCertifications(certsRes);
        if (eduRes && eduRes.length > 0) setEducation(eduRes);
        if (expRes && expRes.length > 0) setExperience(expRes);

        if (profileRes || projectsRes || skillsRes) {
          setIsLoadedFromApi(true);
        }
      } catch (err) {
        console.warn('Backend unavailable, utilizing Hawkins Classified Archive cache.', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAll();
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    profile,
    projects,
    skills,
    certifications,
    education,
    experience,
    isLoadedFromApi,
    isLoading
  };
}
