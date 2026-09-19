package com.aryansingh.portfolio.config;

import com.aryansingh.portfolio.model.*;
import com.aryansingh.portfolio.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final CertificationRepository certificationRepository;
    private final EducationRepository educationRepository;
    private final ExperienceRepository experienceRepository;
    private final UserRepository userRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(ProfileRepository profileRepository,
                           ProjectRepository projectRepository,
                           SkillCategoryRepository skillCategoryRepository,
                           CertificationRepository certificationRepository,
                           EducationRepository educationRepository,
                           ExperienceRepository experienceRepository,
                           UserRepository userRepository,
                           ContactMessageRepository contactMessageRepository,
                           PasswordEncoder passwordEncoder) {
        this.profileRepository = profileRepository;
        this.projectRepository = projectRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.certificationRepository = certificationRepository;
        this.educationRepository = educationRepository;
        this.experienceRepository = experienceRepository;
        this.userRepository = userRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedProfile();
        seedProjects();
        seedSkills();
        seedCertifications();
        seedEducation();
        seedExperience();
        seedDemoTransmission();
        log.info("Hawkins Central Data Initialization complete.");
    }

    private void seedAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    passwordEncoder.encode("HawkinsLab1986!"),
                    "ROLE_ADMIN"
            );
            userRepository.save(admin);
            log.info("Default Hawkins Lab Admin initialized: admin / HawkinsLab1986!");
        }
    }

    private void seedProfile() {
        if (profileRepository.count() == 0) {
            Profile p = new Profile();
            p.setId(1);
            p.setName("Aryan Singh");
            p.setHeroCodename("HAWKINS LAB OPERATIVE // 011-STACK");
            p.setTitle("Full Stack Engineer");
            p.setTagline("BUILDING SYSTEMS FROM THE RIGHT SIDE OF THE STACK");
            p.setPhone("+91 8602879043");
            p.setEmail("aryansobdh@gmail.com");
            p.setLocation("Raigarh, Chhattisgarh, India");
            p.setStatus("ACTIVE OPERATIVE // OPEN TO OPPORTUNITIES");
            p.setGithubUrl("https://github.com/datsaryan");
            p.setLinkedinUrl("https://www.linkedin.com/in/aryan-singh-19b0a2293/");
            p.setLeetcodeUrl("https://leetcode.com/u/datsaryan/");
            p.setResumePdfPath("/Aryan_FullStack_Resume.pdf");
            p.setSummary("Full-stack engineering student with hands-on experience building end-to-end web applications spanning REST APIs, relational databases, and modern JavaScript frontends. Comfortable owning a feature from schema design through UI, with practical experience in authentication, authorization, and multi-tenant systems. Strong Data Structures & Algorithms foundation from active LeetCode practice.");
            p.setInstitution("OP Jindal University, Raigarh");
            p.setDegree("B.Tech, Computer Science Engineering");
            p.setCgpa("7.8 / 10");
            p.setTimeline("Expected June 2027");
            p.setRelevantCoursework(Arrays.asList(
                    "Data Structures", "Algorithms", "Computer Networks", "NLP",
                    "Computer Vision", "Artificial Intelligence", "Machine Learning",
                    "Deep Learning", "Database Management", "Operating Systems",
                    "Programming Language Principles"
            ));
            profileRepository.save(p);
            log.info("Profile initialized for Aryan Singh.");
        }
    }

    private void seedProjects() {
        if (projectRepository.count() == 0) {
            Project p1 = new Project();
            p1.setId("hiretrack");
            p1.setMissionNumber("EXPERIMENT 001");
            p1.setTitle("HireTrack");
            p1.setSubtitle("Full-Stack Applicant Tracking System (ATS)");
            p1.setDates("May 2026 – July 2026");
            p1.setSector("ENTERPRISE RECRUITMENT SYSTEMS");
            p1.setSummary("Designed and built a full-stack, multi-tenant applicant tracking system with 25+ REST endpoints across a Spring Boot API, PostgreSQL + Flyway migrations, JWT-based auth, RBAC, and organization-scoped data isolation.");
            p1.setGithubUrl("https://github.com/datsaryan/hiretrack");
            p1.setLiveUrl(null);
            p1.setAccentColor("#e62429");
            p1.setDisplayOrder(1);
            p1.setTechStack(Arrays.asList("Java", "Spring Boot", "PostgreSQL", "Flyway", "React", "Vite", "JWT", "Docker", "Maven", "JUnit", "Mockito"));
            p1.setBullets(Arrays.asList(
                    "Designed and built a full-stack, multi-tenant applicant tracking system with 25+ REST endpoints across a Spring Boot API, PostgreSQL + Flyway migrations, JWT-based auth, RBAC, and organization-scoped data isolation for managing job postings, candidates, and interview pipelines.",
                    "Built a React (Vite) frontend with a drag-and-drop Kanban board for candidate pipeline tracking, a hiring dashboard, and an Interviews module with many-to-many interviewer assignments and structured scorecards, backed by an activity log, cutting manual pipeline-tracking effort by an estimated 40%.",
                    "Wrote 50+ unit/integration tests with JUnit and Mockito achieving over 80% backend code coverage, containerized PostgreSQL with Docker, and managed the build with Maven.",
                    "Used Claude AI (Claude Code) as an AI pair-programming assistant for architecture planning, debugging, and implementing backend features, accelerating feature delivery against a structured project spec."
            ));
            p1.setMetrics(Arrays.asList("25+ REST Endpoints", "80%+ Code Coverage", "40% Pipeline Efficiency", "50+ Tests"));
            projectRepository.save(p1);

            Project p2 = new Project();
            p2.setId("face-attendance");
            p2.setMissionNumber("EXPERIMENT 002");
            p2.setTitle("Face-Based Attendance System");
            p2.setSubtitle("Biometric Computer Vision Pipeline");
            p2.setDates("Dec 2025 – Feb 2026");
            p2.setSector("COMPUTER VISION & RECON");
            p2.setSummary("Engineered a real-time facial recognition attendance pipeline using Haar cascades, automating tracking for 300+ students and reducing administrative overhead.");
            p2.setGithubUrl("https://github.com/datsaryan/Face-Recognition-Based-Attendance-Monitoring-System");
            p2.setLiveUrl(null);
            p2.setAccentColor("#a855f7");
            p2.setDisplayOrder(2);
            p2.setTechStack(Arrays.asList("OpenCV", "Tkinter", "NumPy", "Pandas", "Pillow", "Python-CSV", "Pytest-Shutil"));
            p2.setBullets(Arrays.asList(
                    "Engineered a real-time facial recognition attendance pipeline using Haar cascades, automating tracking for 300+ students and reducing administrative overhead.",
                    "Built modular pipelines for dataset collection, preprocessing, face detection, and live recognition, boosting identification accuracy by 15% and cutting processing time by 25%.",
                    "Built a Tkinter GUI for non-technical staff to manage 120+ student attendance records, using CSV + Pandas for storage and retrieval in under 2 seconds, with recognition latency under 1 second per frame; validated modules with Pytest."
            ));
            p2.setMetrics(Arrays.asList("300+ Students Tracked", "<1s Frame Latency", "+15% Accuracy Boost", "<2s Data Retrieval"));
            projectRepository.save(p2);

            Project p3 = new Project();
            p3.setId("inamigos-ngo");
            p3.setMissionNumber("EXPERIMENT 003");
            p3.setTitle("InAmigos Foundation Website");
            p3.setSubtitle("NGO Awareness & Donation Platform");
            p3.setDates("Apr 2026 – May 2026");
            p3.setSector("CIVIL SOCIETY & PUBLIC WEB");
            p3.setSummary("Built a fully static, mobile-responsive single-page site for a real NGO across 10 sections using Flexbox/Grid across 3 breakpoints, achieving a 90+ Lighthouse performance score and sub-2-second page load time, with a live Razorpay donation gateway and a volunteer sign-up form.");
            p3.setGithubUrl("https://github.com/datsaryan/InAmigos-Projects");
            p3.setLiveUrl(null);
            p3.setAccentColor("#ffd600");
            p3.setDisplayOrder(3);
            p3.setTechStack(Arrays.asList("HTML5", "CSS3", "Vanilla JavaScript", "Razorpay Gateway", "Responsive Design"));
            p3.setBullets(Arrays.asList(
                    "Built a fully static, mobile-responsive single-page site for a real NGO across 10 sections using Flexbox/Grid across 3 breakpoints, achieving a 90+ Lighthouse performance score and sub-2-second page load time, with a live Razorpay donation gateway and a volunteer sign-up form."
            ));
            p3.setMetrics(Arrays.asList("90+ Lighthouse Score", "<2s Page Load Time", "10 Custom Sections", "Live Razorpay Integration"));
            projectRepository.save(p3);

            Project p4 = new Project();
            p4.setId("portfolio-fullstack");
            p4.setMissionNumber("EXPERIMENT 004");
            p4.setTitle("Personal Portfolio Full-Stack");
            p4.setSubtitle("Decoupled Stranger Things Architecture");
            p4.setDates("Aug 2026 - Sep 2026");
            p4.setSector("SYSTEM ARCHITECTURE & DEPLOYMENT");
            p4.setSummary("Rebuilt a static portfolio as a full-stack application, replacing hardcoded content with a React (Vite) frontend served by a Spring Boot REST API, Flyway migrations, JWT security, and multi-cloud deployment.");
            p4.setGithubUrl("https://github.com/datsaryan/themed-portfolio");
            p4.setLiveUrl("https://portfolio-eight-woad-18.vercel.app");
            p4.setAccentColor("#00f0ff");
            p4.setDisplayOrder(4);
            p4.setTechStack(Arrays.asList("React", "Vite", "TypeScript", "Java", "Spring Boot", "PostgreSQL", "Flyway", "JWT", "Docker", "Vercel", "Render", "Neon"));
            p4.setBullets(Arrays.asList(
                    "Rebuilt static HTML portfolio as a full-stack application, replacing hardcoded content with a React (Vite) frontend served by a Spring Boot REST API across 8+ endpoints.",
                    "Modeled and versioned PostgreSQL schema with Flyway migrations, decoupling content updates from frontend code changes.",
                    "Containerized PostgreSQL and backend with Docker Compose, cutting local environment setup to 2 commands, and deployed the stack across free-tier platforms with a documented deployment guide."
            ));
            p4.setMetrics(Arrays.asList("8+ REST Endpoints", "Dockerized Compose Stack", "JWT Authentication", "Zero-Downtime Flyway"));
            projectRepository.save(p4);

            log.info("Projects seeded.");
        }
    }

    private void seedSkills() {
        if (skillCategoryRepository.count() == 0) {
            SkillCategory c1 = new SkillCategory("Languages", "CORE SYNAPSE LOGIC", "Terminal", "Low-level system fundamentals and high-level algorithmic execution.", 1);
            c1.setSkills(Arrays.asList("Java", "Python", "C", "C++", "SQL", "JavaScript"));
            skillCategoryRepository.save(c1);

            SkillCategory c2 = new SkillCategory("Backend & APIs", "NEURAL BACKBONE / APIs", "Server", "Scalable micro-architectures, enterprise security, and transactional integrity.", 2);
            c2.setSkills(Arrays.asList("Spring Boot", "REST APIs", "JWT Auth", "RBAC", "Flyway"));
            skillCategoryRepository.save(c2);

            SkillCategory c3 = new SkillCategory("Frontend", "OPTICAL HUD & UI", "Layout", "Kinetic interfaces, state management, and high-frequency rendering.", 3);
            c3.setSkills(Arrays.asList("React", "Vite", "TypeScript", "HTML5", "CSS3", "JavaScript"));
            skillCategoryRepository.save(c3);

            SkillCategory c4 = new SkillCategory("Databases", "PERSISTENT MEMORY CORES", "Database", "Relational modeling, migration pipelines, and optimized query plans.", 4);
            c4.setSkills(Arrays.asList("PostgreSQL", "SQL", "MySQL"));
            skillCategoryRepository.save(c4);

            SkillCategory c5 = new SkillCategory("Tools & DevOps", "TACTICAL TOOLING & DEPLOY", "Wrench", "Containerized workflows, version control, and automated build pipelines.", 5);
            c5.setSkills(Arrays.asList("Git", "GitHub", "Docker", "Maven", "VS Code"));
            skillCategoryRepository.save(c5);

            SkillCategory c6 = new SkillCategory("Testing & Quality", "INTEGRITY SHIELDS", "ShieldCheck", "Test-driven verification, behavioral mocking, and regression prevention.", 6);
            c6.setSkills(Arrays.asList("JUnit", "Mockito", "Pytest"));
            skillCategoryRepository.save(c6);

            SkillCategory c7 = new SkillCategory("CS Concepts", "NEURAL FOUNDATIONS", "Cpu", "Rigorous algorithmic discipline and asymptotic efficiency.", 7);
            c7.setSkills(Arrays.asList("Data Structures", "Algorithms", "OOP", "System Design basics", "Complexity Analysis"));
            skillCategoryRepository.save(c7);

            log.info("Skill categories seeded.");
        }
    }

    private void seedCertifications() {
        if (certificationRepository.count() == 0) {
            Certification cert1 = new Certification("InAmigos Foundation Internship", "InAmigos Foundation", "Apr 2026 – May 2026",
                    "https://drive.google.com/drive/u/2/folders/13wFVZXq9aytveHus7OP1GpGb9iN_i9cl", "internship",
                    "Awarded appreciation certificate for web development, production responsiveness, and payment gateway delivery.", 1);
            certificationRepository.save(cert1);

            Certification cert2 = new Certification("AI & Machine Learning Software Workshops", "Industry Engineering Consortium", "Jan 2026 – Feb 2026",
                    null, "workshop",
                    "Participated in hands-on workshops covering practical ML implementation, emerging technologies, and modern developer tooling.", 2);
            certificationRepository.save(cert2);

            Certification cert3 = new Certification("Active Algorithmic Mastery & LeetCode", "LeetCode (Self-directed)", null,
                    "https://leetcode.com/u/datsaryan/", "practice",
                    "Regularly solves algorithmic challenges covering Trees, Graphs, Dynamic Programming, and Arrays.", 3);
            certificationRepository.save(cert3);

            Certification cert4 = new Certification("IBM Web Development Certificate", "IBM / YourLearning", null,
                    "https://skills.yourlearning.ibm.com/certificate/share/30c6fbdeddewogICJsZWFybmVyQ05VTSIgOiAiNzc1MTU3OVJFRyIsCiAgIm9iamVjdFR5cGUiIDogIkFDVElWSVRZIiwKICAib2JqZWN0SWQiIDogIlVSTC03NEQ0NDI0MTIxRTMiCn0a030fe9500-10", "certification",
                    "Professional certification validating web application architecture, client-side engineering, and standards compliance.", 4);
            certificationRepository.save(cert4);

            Certification cert5 = new Certification("Introduction to IoT Certification", "NPTEL / IIT", null,
                    "https://drive.google.com/file/d/1r910n2UXHTJkGke2zjC3cP9q_9YSJ2fI/view?usp=sharing", "certification",
                    "Comprehensive national certification on Internet of Things architectures, embedded networks, and sensor data.", 5);
            certificationRepository.save(cert5);

            log.info("Certifications seeded.");
        }
    }

    private void seedEducation() {
        if (educationRepository.count() == 0) {
            Education edu = new Education(
                    "OP Jindal University, Raigarh",
                    "B.Tech, Computer Science Engineering",
                    "7.8 / 10",
                    "Expected June 2027",
                    Arrays.asList("Data Structures", "Algorithms", "Computer Networks", "NLP", "Computer Vision", "Artificial Intelligence", "Machine Learning", "Deep Learning", "Database Management", "Operating Systems", "Programming Language Principles")
            );
            educationRepository.save(edu);
            log.info("Education record seeded.");
        }
    }

    private void seedExperience() {
        if (experienceRepository.count() == 0) {
            Experience exp1 = new Experience();
            exp1.setRole("Web Development Intern");
            exp1.setOrganization("InAmigos Foundation");
            exp1.setDates("Apr 2026 – May 2026");
            exp1.setLocation("Remote");
            exp1.setType("internship");
            exp1.setDescription("Built a responsive single-page portal with donation gateway integration and volunteer onboarding.");
            exp1.setBullets(Arrays.asList(
                    "Engineered 10 modular sections using CSS Flexbox and Grid across 3 distinct viewport breakpoints.",
                    "Integrated live Razorpay payment processing and volunteer enrollment workflows.",
                    "Achieved 90+ Google Lighthouse performance and sub-2-second first contentful paint."
            ));
            exp1.setTechStack(Arrays.asList("HTML5", "CSS3", "JavaScript", "Razorpay"));
            exp1.setDisplayOrder(1);
            experienceRepository.save(exp1);

            Experience exp2 = new Experience();
            exp2.setRole("AI & ML Workshop Participant");
            exp2.setOrganization("Engineering & Developer Workshops");
            exp2.setDates("Jan 2026 – Feb 2026");
            exp2.setLocation("Raigarh, India");
            exp2.setType("workshop");
            exp2.setDescription("Intensive practical workshops in artificial intelligence, machine learning pipelines, and modern software development workflows.");
            exp2.setBullets(Arrays.asList(
                    "Implemented core computer vision and classification models with OpenCV and Python.",
                    "Explored emerging developer tooling and collaborative version control best practices."
            ));
            exp2.setTechStack(Arrays.asList("Python", "OpenCV", "Machine Learning", "Git"));
            exp2.setDisplayOrder(2);
            experienceRepository.save(exp2);

            log.info("Experience records seeded.");
        }
    }

    private void seedDemoTransmission() {
        if (contactMessageRepository.count() == 0) {
            ContactMessage msg = new ContactMessage(
                    "Chief Jim Hopper",
                    "hopper@hawkinspd.gov",
                    "Classified signal confirmed. Telecommunications relay between Hawkins and the Upside Down is stable. Keep your radio on channel 11."
            );
            msg.setSubmittedAt(java.time.Instant.now().minus(12, java.time.temporal.ChronoUnit.HOURS));
            contactMessageRepository.save(msg);
            log.info("Demo transmission seeded in archives.");
        }
    }
}
