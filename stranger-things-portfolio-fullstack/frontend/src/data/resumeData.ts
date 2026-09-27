import { ProfileData, ProjectItem, SkillCategory, Certification, EducationItem, ExperienceItem } from '../types/portfolio';

export const FALLBACK_PROFILE: ProfileData = {
  name: "Aryan Singh",
  title: "Full-Stack Developer | Java · Spring Boot · React",
  bio: "B.Tech CSE student at OP Jindal University with a passion for building robust, scalable full-stack applications. Experienced in Java backend development with Spring Boot, JWT authentication, and RESTful API design, as well as modern React + TypeScript frontends. Lover of clean code, system design, and the Upside Down.",
  email: "aryansobdh@gmail.com",
  phone: "+91 8602879043",
  githubUrl: "https://github.com/datsaryan",
  linkedinUrl: "https://www.linkedin.com/in/aryan-singh-19b0a2293/",
  leetcodeUrl: "https://leetcode.com/u/datsaryan/",
  location: "Raigarh, Chhattisgarh, India",
  avatarUrl: "https://avatars.githubusercontent.com/u/datsaryan"
};

export const FALLBACK_PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: "HireTrack ATS",
    description: "A full-stack Applicant Tracking System built with Spring Boot and React. Features include JWT-based RBAC (Admin, HR, Candidate roles), Flyway database migrations, RESTful API design with comprehensive JUnit & Mockito test coverage, and a responsive Tailwind CSS frontend with real-time job tracking.",
    techStack: "Java, Spring Boot, Spring Security, JWT, RBAC, Flyway, PostgreSQL, React, TypeScript, Tailwind CSS, JUnit, Mockito, Maven",
    githubUrl: "https://github.com/datsaryan/hire-track-ats",
    liveUrl: null,
    imageUrl: null,
    featured: true,
    displayOrder: 1
  },
  {
    id: 2,
    title: "Face-Based Attendance System",
    description: "An intelligent attendance management system leveraging computer vision and facial recognition. Automates attendance marking using real-time face detection, stores records in a structured database, and provides an admin dashboard for monitoring and reporting.",
    techStack: "Python, OpenCV, Face Recognition, Numpy, Pandas, SQLite, Tkinter",
    githubUrl: "https://github.com/datsaryan/face-attendance-system",
    liveUrl: null,
    imageUrl: null,
    featured: true,
    displayOrder: 2
  },
  {
    id: 3,
    title: "InAmigos Foundation Website",
    description: "Official website for the InAmigos Foundation NGO. Built a fully responsive, multi-page website with modern UI/UX principles. Includes sections for about, events, gallery, team, and contact with form integration.",
    techStack: "HTML5, CSS3, JavaScript, React, REST API",
    githubUrl: "https://github.com/datsaryan/inamigos-foundation",
    liveUrl: null,
    imageUrl: null,
    featured: false,
    displayOrder: 3
  },
  {
    id: 4,
    title: "Personal Portfolio Full-Stack",
    description: "A production-quality full-stack personal portfolio with a Stranger Things aesthetic. Spring Boot REST API backend with JWT authentication, React + TypeScript + Tailwind CSS frontend, dual world mode (Hawkins ↔ Upside Down), CRT scanlines, procedural audio engine, and animated spore particles.",
    techStack: "Java, Spring Boot, Spring Security, JWT, React, TypeScript, Tailwind CSS, Vite, PostgreSQL, H2, Flyway, Docker",
    githubUrl: "https://github.com/datsaryan/themed-portfolio",
    liveUrl: null,
    imageUrl: null,
    featured: true,
    displayOrder: 4
  }
];

export const FALLBACK_SKILLS: SkillCategory[] = [
  {
    id: 1,
    categoryName: "Languages",
    displayOrder: 1,
    skills: [
      { name: "Java", proficiency: 90 },
      { name: "Python", proficiency: 80 },
      { name: "C", proficiency: 70 },
      { name: "C++", proficiency: 72 },
      { name: "SQL", proficiency: 85 },
      { name: "JavaScript", proficiency: 82 },
      { name: "TypeScript", proficiency: 78 }
    ]
  },
  {
    id: 2,
    categoryName: "Backend & APIs",
    displayOrder: 2,
    skills: [
      { name: "Spring Boot", proficiency: 88 },
      { name: "REST APIs", proficiency: 90 },
      { name: "JWT Auth", proficiency: 85 },
      { name: "RBAC", proficiency: 80 },
      { name: "Spring Security", proficiency: 82 },
      { name: "Flyway", proficiency: 75 }
    ]
  },
  {
    id: 3,
    categoryName: "Frontend",
    displayOrder: 3,
    skills: [
      { name: "React", proficiency: 82 },
      { name: "Vite", proficiency: 78 },
      { name: "HTML5", proficiency: 88 },
      { name: "CSS3", proficiency: 85 },
      { name: "Tailwind CSS", proficiency: 80 }
    ]
  },
  {
    id: 4,
    categoryName: "Databases",
    displayOrder: 4,
    skills: [
      { name: "PostgreSQL", proficiency: 82 },
      { name: "MySQL", proficiency: 80 },
      { name: "H2 (In-Memory)", proficiency: 75 }
    ]
  },
  {
    id: 5,
    categoryName: "DevOps & Tools",
    displayOrder: 5,
    skills: [
      { name: "Git", proficiency: 88 },
      { name: "Docker", proficiency: 72 },
      { name: "Maven", proficiency: 82 }
    ]
  },
  {
    id: 6,
    categoryName: "Testing",
    displayOrder: 6,
    skills: [
      { name: "JUnit", proficiency: 82 },
      { name: "Mockito", proficiency: 78 },
      { name: "Pytest", proficiency: 70 }
    ]
  },
  {
    id: 7,
    categoryName: "CS Fundamentals",
    displayOrder: 7,
    skills: [
      { name: "Data Structures & Algorithms", proficiency: 85 },
      { name: "Object-Oriented Programming", proficiency: 88 },
      { name: "System Design", proficiency: 75 },
      { name: "Computer Networks", proficiency: 72 }
    ]
  }
];

export const FALLBACK_CERTIFICATIONS: Certification[] = [
  {
    id: 1,
    title: "InAmigos Foundation Web Development Internship",
    issuer: "InAmigos Foundation",
    issuedDate: "2024",
    credentialUrl: null,
    description: "Completed an intensive web development internship building production-ready features for the InAmigos Foundation digital presence."
  },
  {
    id: 2,
    title: "Artificial Intelligence & Machine Learning Workshop",
    issuer: "OP Jindal University",
    issuedDate: "2024",
    credentialUrl: null,
    description: "Attended hands-on AI & ML workshop covering supervised learning, neural networks, and Python-based ML pipelines."
  },
  {
    id: 3,
    title: "IBM Full Stack Web Developer Certificate",
    issuer: "IBM / Coursera",
    issuedDate: "2024",
    credentialUrl: null,
    description: "Completed IBM's comprehensive full-stack web developer course covering cloud-native development, microservices, and DevOps fundamentals."
  },
  {
    id: 4,
    title: "NPTEL Internet of Things Certificate",
    issuer: "NPTEL / IIT",
    issuedDate: "2024",
    credentialUrl: null,
    description: "Earned NPTEL certification in Internet of Things, covering embedded systems, sensor integration, and IoT protocols."
  },
  {
    id: 5,
    title: "LeetCode — Consistent Problem Solver",
    issuer: "LeetCode",
    issuedDate: "2024",
    credentialUrl: "https://leetcode.com/u/datsaryan/",
    description: "Regular competitive programming practice focusing on data structures, dynamic programming, graphs, and binary search."
  }
];

export const FALLBACK_EDUCATION: EducationItem[] = [
  {
    id: 1,
    institution: "OP Jindal University, Raigarh",
    degree: "Bachelor of Technology",
    fieldOfStudy: "Computer Science & Engineering",
    cgpa: "7.8 / 10.0",
    startYear: 2023,
    endYear: 2027,
    expected: true,
    description: "Core coursework: Data Structures & Algorithms, OOP, Database Management, Operating Systems, Computer Networks, Software Engineering, System Design."
  }
];

export const FALLBACK_EXPERIENCE: ExperienceItem[] = [
  {
    id: 1,
    organization: "InAmigos Foundation",
    role: "Web Developer Intern",
    startDate: "2023",
    endDate: "2024",
    isCurrent: false,
    description: "Developed and maintained the InAmigos Foundation website. Implemented responsive UI components, integrated backend APIs, and ensured cross-browser compatibility. Collaborated with design team to deliver pixel-perfect implementations.",
    skillsUsed: "HTML, CSS, JavaScript, React, REST APIs"
  }
];
