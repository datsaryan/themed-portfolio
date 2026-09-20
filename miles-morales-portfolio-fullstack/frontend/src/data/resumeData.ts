export interface ProjectItem {
  id: string;
  missionNumber: string;
  title: string;
  subtitle: string;
  dates: string;
  sector: string;
  techStack: string[];
  summary: string;
  bullets: string[];
  githubUrl?: string;
  liveUrl?: string;
  metrics?: string[];
  accentColor?: string;
}

export interface SkillCategory {
  category: string;
  suitModule: string;
  icon: string;
  skills: string[];
  description: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  dates?: string;
  link?: string;
  type: 'internship' | 'workshop' | 'certification' | 'practice';
  description: string;
}

export const RESUME_DATA = {
  personal: {
    name: "Aryan Singh",
    heroCodename: "SPIDER // EARTH-1610",
    title: "Full Stack Engineer",
    tagline: "YOUR FRIENDLY NEIGHBORHOOD FULL STACK ENGINEER",
    phone: "+91 8602879043",
    email: "aryansobdh@gmail.com",
    location: "Raigarh, India",
    status: "ACTIVE OPERATIVE // OPEN TO OPPORTUNITIES",
    links: {
      github: "https://github.com/datsaryan",
      linkedin: "https://www.linkedin.com/in/aryan-singh-19b0a2293/",
      leetcode: "https://leetcode.com/u/datsaryan/",
      resumePdf: "/Aryan_FullStack_Resume.pdf",
    },
    summary:
      "Full-stack engineering student with hands-on experience building end-to-end web applications spanning REST APIs, relational databases, and modern JavaScript frontends. Comfortable owning a feature from schema design through UI, with practical experience in authentication, authorization, and multi-tenant systems. Strong Data Structures & Algorithms foundation from active LeetCode practice.",
  },

  education: {
    institution: "OP Jindal University, Raigarh",
    degree: "B.Tech, Computer Science Engineering",
    cgpa: "7.8 / 10",
    timeline: "Expected June 2027",
    relevantCoursework: [
      "Data Structures",
      "Computer Networks",
      "NLP",
      "Computer Vision",
      "Artificial Intelligence",
      "Machine Learning",
      "Deep Learning",
      "Database Management",
      "Operating Systems",
      "Programming Language Principles",
    ],
  },

  missions: [
    {
      id: "hiretrack",
      missionNumber: "MISSION 01",
      title: "HireTrack",
      subtitle: "Full-Stack Applicant Tracking System (ATS)",
      dates: "May 2026 – July 2026",
      sector: "ENTERPRISE RECRUITMENT SYSTEMS",
      techStack: [
        "Java",
        "Spring Boot",
        "PostgreSQL",
        "Flyway",
        "React",
        "Vite",
        "JWT",
        "Docker",
        "Maven",
        "JUnit",
        "Mockito",
      ],
      summary:
        "Full-stack multi-tenant applicant tracking platform with organization-scoped isolation, Kanban workflow, and automated scorecards.",
      bullets: [
        "Designed and built a full-stack, multi-tenant applicant tracking system with 25+ REST endpoints across a Spring Boot API, PostgreSQL + Flyway migrations, JWT-based auth, RBAC, and organization-scoped data isolation for managing job postings, candidates, and interview pipelines.",
        "Built a React (Vite) frontend with a drag-and-drop Kanban board for candidate pipeline tracking, a hiring dashboard, and an Interviews module with many-to-many interviewer assignments and structured scorecards, backed by an activity log, cutting manual pipeline-tracking effort by an estimated 40%.",
        "Wrote 50+ unit/integration tests with JUnit and Mockito achieving over 80% backend code coverage, containerized PostgreSQL with Docker, and managed the build with Maven.",
        "Used Claude AI (Claude Code) as an AI pair-programming assistant for architecture planning, debugging, and implementing backend features, accelerating feature delivery against a structured project spec.",
      ],
      githubUrl: "https://github.com/datsaryan/hiretrack",
      metrics: ["25+ REST Endpoints", "80%+ Code Coverage", "40% Pipeline Efficiency", "50+ Tests"],
      accentColor: "#e62429",
    },
    {
      id: "face-attendance",
      missionNumber: "MISSION 02",
      title: "Face-Based Attendance System",
      subtitle: "Biometric Computer Vision Pipeline",
      dates: "Dec 2025 – Feb 2026",
      sector: "COMPUTER VISION & RECON",
      techStack: [
        "OpenCV",
        "Tkinter",
        "NumPy",
        "Pandas",
        "Pillow",
        "Python-CSV",
        "Pytest-Shutil",
      ],
      summary:
        "Automated biometric attendance system tracking 300+ students in real-time with sub-second recognition latency.",
      bullets: [
        "Engineered a real-time facial recognition attendance pipeline using Haar cascades, automating tracking for 300+ students and reducing administrative overhead.",
        "Built modular pipelines for dataset collection, preprocessing, face detection, and live recognition, boosting identification accuracy by 15% and cutting processing time by 25%.",
        "Built a Tkinter GUI for non-technical staff to manage 120+ student attendance records, using CSV + Pandas for storage and retrieval in under 2 seconds, with recognition latency under 1 second per frame; validated modules with Pytest.",
      ],
      githubUrl: "https://github.com/datsaryan/Face-Recognition-Based-Attendance-Monitoring-System",
      metrics: ["300+ Students Tracked", "<1s Frame Latency", "+15% Accuracy Boost", "<2s Data Retrieval"],
      accentColor: "#a855f7",
    },
    {
      id: "inamigos-ngo",
      missionNumber: "MISSION 03",
      title: "InAmigos Foundation Website",
      subtitle: "NGO Awareness & Donation Platform",
      dates: "Apr 2026 – May 2026",
      sector: "CIVIL SOCIETY & PUBLIC WEB",
      techStack: ["HTML5", "CSS3", "Vanilla JavaScript"],
      summary:
        "High-performance mobile-responsive web platform for a real NGO with live Razorpay payment processing.",
      bullets: [
        "Built a fully static, mobile-responsive single-page site for a real NGO across 10 sections using Flexbox/Grid across 3 breakpoints, achieving a 90+ Lighthouse performance score and sub-2-second page load time, with a live Razorpay donation gateway and a volunteer sign-up form.",
      ],
      githubUrl: "https://github.com/datsaryan/InAmigos-Projects",
      metrics: ["90+ Lighthouse Score", "<2s Page Load Time", "10 Custom Sections", "Live Razorpay Integration"],
      accentColor: "#ffd600",
    },
    {
      id: "portfolio-fullstack",
      missionNumber: "MISSION 04",
      title: "Personal Portfolio Full-Stack",
      subtitle: "Decoupled Web Architecture",
      dates: "Aug 2026 – Sep 2026",
      sector: "SYSTEM ARCHITECTURE & DEPLOYMENT",
      techStack: [
        "React",
        "Vite",
        "Java",
        "Spring Boot",
        "PostgreSQL",
        "Flyway",
        "Docker",
        "Vercel",
        "Render",
        "Neon",
      ],
      summary:
        "Full-stack decoupled portfolio served by a Spring Boot REST API, versioned PostgreSQL schema, and multi-cloud deployment.",
      bullets: [
        "Rebuilt a static HTML portfolio as a full-stack application, replacing hardcoded content with a React (Vite) frontend served by a Spring Boot REST API across 4 endpoints (/api/projects, /api/skills, /api/certifications, /api/contact).",
        "Modeled and versioned the PostgreSQL schema with Flyway migrations, decoupling content updates (projects, skills, certifications) from frontend code changes.",
        "Containerized PostgreSQL and the backend with Docker Compose, cutting local environment setup to 2 commands, and deployed the stack across 3 free-tier platforms (Neon, Render, Vercel) with a documented CORS and deployment guide.",
      ],
      liveUrl: "https://portfolio-eight-woad-18.vercel.app",
      metrics: ["4 Spring REST Endpoints", "Dockerized Compose Stack", "3-Cloud Architecture", "Zero-Downtime Flyway"],
      accentColor: "#00f0ff",
    },
  ] as ProjectItem[],

  skillCategories: [
    {
      category: "Languages",
      suitModule: "CORE SYNAPSE LOGIC",
      icon: "Terminal",
      skills: ["Java", "Python", "C", "C++", "SQL", "JavaScript"],
      description: "Low-level system fundamentals and high-level algorithmic execution.",
    },
    {
      category: "Backend & APIs",
      suitModule: "NEURAL BACKBONE / APIs",
      icon: "Server",
      skills: ["Spring Boot", "REST APIs", "JWT Auth", "RBAC", "Flyway"],
      description: "Scalable micro-architectures, enterprise security, and transactional integrity.",
    },
    {
      category: "Frontend",
      suitModule: "OPTICAL HUD & UI",
      icon: "Layout",
      skills: ["React", "Vite", "HTML5", "CSS3", "JavaScript"],
      description: "Kinetic interfaces, state management, and high-frequency rendering.",
    },
    {
      category: "Databases",
      suitModule: "PERSISTENT MEMORY CORES",
      icon: "Database",
      skills: ["PostgreSQL", "SQL", "MySQL"],
      description: "Relational modeling, migration pipelines, and optimized query plans.",
    },
    {
      category: "Tools & DevOps",
      suitModule: "TACTICAL TOOLING & DEPLOY",
      icon: "Wrench",
      skills: ["Git", "GitHub", "Docker", "Maven", "VS Code"],
      description: "Containerized workflows, version control, and automated build pipelines.",
    },
    {
      category: "Testing & Quality",
      suitModule: "INTEGRITY SHIELDS",
      icon: "ShieldCheck",
      skills: ["JUnit", "Mockito", "Pytest"],
      description: "Test-driven verification, behavioral mocking, and regression prevention.",
    },
    {
      category: "CS Concepts",
      suitModule: "NEURAL FOUNDATIONS",
      icon: "Cpu",
      skills: [
        "Data Structures",
        "Algorithms",
        "OOP",
        "System Design basics",
        "Complexity Analysis",
      ],
      description: "Rigorous algorithmic discipline and asymptotic efficiency.",
    },
  ] as SkillCategory[],

  credentials: [
    {
      title: "InAmigos Foundation Internship",
      issuer: "InAmigos Foundation",
      type: "internship",
      link: "https://drive.google.com/drive/u/2/folders/13wFVZXq9aytveHus7OP1GpGb9iN_i9cl",
      description: "Awarded appreciation certificate for web development, production responsiveness, and payment gateway delivery.",
    },
    {
      title: "AI & Machine Learning Software Workshops",
      issuer: "Industry Engineering Consortium",
      dates: "Jan 2026 – Feb 2026",
      type: "workshop",
      description: "Participated in hands-on workshops covering practical ML implementation, emerging technologies, and modern developer tooling.",
    },
    {
      title: "Active Algorithmic Mastery & LeetCode",
      issuer: "LeetCode (Self-directed)",
      type: "practice",
      link: "https://leetcode.com/u/datsaryan/",
      description: "Regularly solves algorithmic challenges covering Trees, Graphs, Dynamic Programming, and Arrays.",
    },
    {
      title: "IBM Web Development Certificate",
      issuer: "IBM / YourLearning",
      type: "certification",
      link: "https://skills.yourlearning.ibm.com/certificate/share/30c6fbdeddewogICJsZWFybmVyQ05VTSIgOiAiNzc1MTU3OVJFRyIsCiAgIm9iamVjdFR5cGUiIDogIkFDVElWSVRZIiwKICAib2JqZWN0SWQiIDogIlVSTC03NEQ0NDI0MTIxRTMiCn0a030fe9500-10",
      description: "Professional certification validating web application architecture, client-side engineering, and standards compliance.",
    },
    {
      title: "Introduction to IoT Certification",
      issuer: "NPTEL / IIT",
      type: "certification",
      link: "https://drive.google.com/file/d/1r910n2UXHTJkGke2zjC3cP9q_9YSJ2fI/view",
      description: "Comprehensive national certification on Internet of Things architectures, embedded networks, and sensor data.",
    },
  ] as CertificationItem[],
};
