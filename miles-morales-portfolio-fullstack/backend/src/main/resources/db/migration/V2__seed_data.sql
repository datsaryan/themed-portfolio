-- Seed data transcribed directly from the frontend's src/data/resumeData.ts
-- so both sides of the stack serve identical content.

INSERT INTO profile (
    id, name, hero_codename, title, tagline, phone, email, location, status,
    github_url, linkedin_url, leetcode_url, resume_pdf_path, summary,
    institution, degree, cgpa, timeline
) VALUES (
    1,
    'Aryan Singh',
    'SPIDER // EARTH-1610',
    'Full Stack Engineer',
    'YOUR FRIENDLY NEIGHBORHOOD FULL STACK ENGINEER',
    '+91 8602879043',
    'aryansobdh@gmail.com',
    'Raigarh, India',
    'ACTIVE OPERATIVE // OPEN TO OPPORTUNITIES',
    'https://github.com/datsaryan',
    'https://www.linkedin.com/in/aryan-singh-19b0a2293/',
    'https://leetcode.com/u/datsaryan/',
    '/Aryan_FullStack_Resume.pdf',
    $$Full-stack engineering student with hands-on experience building end-to-end web applications spanning REST APIs, relational databases, and modern JavaScript frontends. Comfortable owning a feature from schema design through UI, with practical experience in authentication, authorization, and multi-tenant systems. Strong Data Structures & Algorithms foundation from active LeetCode practice.$$,
    'OP Jindal University, Raigarh',
    'B.Tech, Computer Science Engineering',
    '7.8 / 10',
    'Expected June 2027'
);

INSERT INTO profile_coursework (profile_id, list_index, coursework) VALUES
    (1, 0, 'Data Structures'),
    (1, 1, 'Computer Networks'),
    (1, 2, 'NLP'),
    (1, 3, 'Computer Vision'),
    (1, 4, 'Artificial Intelligence'),
    (1, 5, 'Machine Learning'),
    (1, 6, 'Deep Learning'),
    (1, 7, 'Database Management'),
    (1, 8, 'Operating Systems'),
    (1, 9, 'Programming Language Principles');

-- ===================== Projects =====================

INSERT INTO projects (id, mission_number, title, subtitle, dates, sector, summary, github_url, live_url, accent_color, display_order) VALUES
    ('hiretrack', 'MISSION 01', 'HireTrack', 'Full-Stack Applicant Tracking System (ATS)', 'May 2026 – July 2026', 'ENTERPRISE RECRUITMENT SYSTEMS',
     $$Full-stack multi-tenant applicant tracking platform with organization-scoped isolation, Kanban workflow, and automated scorecards.$$,
     'https://github.com/datsaryan/hiretrack', NULL, '#e62429', 1),
    ('face-attendance', 'MISSION 02', 'Face-Based Attendance System', 'Biometric Computer Vision Pipeline', 'Dec 2025 – Feb 2026', 'COMPUTER VISION & RECON',
     $$Automated biometric attendance system tracking 300+ students in real-time with sub-second recognition latency.$$,
     'https://github.com/datsaryan/Face-Recognition-Based-Attendance-Monitoring-System', NULL, '#a855f7', 2),
    ('inamigos-ngo', 'MISSION 03', 'InAmigos Foundation Website', 'NGO Awareness & Donation Platform', 'Apr 2026 – May 2026', 'CIVIL SOCIETY & PUBLIC WEB',
     $$High-performance mobile-responsive web platform for a real NGO with live Razorpay payment processing.$$,
     'https://github.com/datsaryan/InAmigos-Projects', NULL, '#ffd600', 3),
    ('portfolio-fullstack', 'MISSION 04', 'Personal Portfolio Full-Stack', 'Decoupled Web Architecture', 'Aug 2026 – Sep 2026', 'SYSTEM ARCHITECTURE & DEPLOYMENT',
     $$Full-stack decoupled portfolio served by a Spring Boot REST API, versioned PostgreSQL schema, and multi-cloud deployment.$$,
     NULL, 'https://portfolio-eight-woad-18.vercel.app', '#00f0ff', 4);

INSERT INTO project_tech_stack (project_id, list_index, tech) VALUES
    ('hiretrack', 0, 'Java'), ('hiretrack', 1, 'Spring Boot'), ('hiretrack', 2, 'PostgreSQL'),
    ('hiretrack', 3, 'Flyway'), ('hiretrack', 4, 'React'), ('hiretrack', 5, 'Vite'),
    ('hiretrack', 6, 'JWT'), ('hiretrack', 7, 'Docker'), ('hiretrack', 8, 'Maven'),
    ('hiretrack', 9, 'JUnit'), ('hiretrack', 10, 'Mockito'),

    ('face-attendance', 0, 'OpenCV'), ('face-attendance', 1, 'Tkinter'), ('face-attendance', 2, 'NumPy'),
    ('face-attendance', 3, 'Pandas'), ('face-attendance', 4, 'Pillow'), ('face-attendance', 5, 'Python-CSV'),
    ('face-attendance', 6, 'Pytest-Shutil'),

    ('inamigos-ngo', 0, 'HTML5'), ('inamigos-ngo', 1, 'CSS3'), ('inamigos-ngo', 2, 'Vanilla JavaScript'),

    ('portfolio-fullstack', 0, 'React'), ('portfolio-fullstack', 1, 'Vite'), ('portfolio-fullstack', 2, 'Java'),
    ('portfolio-fullstack', 3, 'Spring Boot'), ('portfolio-fullstack', 4, 'PostgreSQL'), ('portfolio-fullstack', 5, 'Flyway'),
    ('portfolio-fullstack', 6, 'Docker'), ('portfolio-fullstack', 7, 'Vercel'), ('portfolio-fullstack', 8, 'Render'),
    ('portfolio-fullstack', 9, 'Neon');

INSERT INTO project_bullets (project_id, list_index, bullet) VALUES
    ('hiretrack', 0, $$Designed and built a full-stack, multi-tenant applicant tracking system with 25+ REST endpoints across a Spring Boot API, PostgreSQL + Flyway migrations, JWT-based auth, RBAC, and organization-scoped data isolation for managing job postings, candidates, and interview pipelines.$$),
    ('hiretrack', 1, $$Built a React (Vite) frontend with a drag-and-drop Kanban board for candidate pipeline tracking, a hiring dashboard, and an Interviews module with many-to-many interviewer assignments and structured scorecards, backed by an activity log, cutting manual pipeline-tracking effort by an estimated 40%.$$),
    ('hiretrack', 2, $$Wrote 50+ unit/integration tests with JUnit and Mockito achieving over 80% backend code coverage, containerized PostgreSQL with Docker, and managed the build with Maven.$$),
    ('hiretrack', 3, $$Used Claude AI (Claude Code) as an AI pair-programming assistant for architecture planning, debugging, and implementing backend features, accelerating feature delivery against a structured project spec.$$),

    ('face-attendance', 0, $$Engineered a real-time facial recognition attendance pipeline using Haar cascades, automating tracking for 300+ students and reducing administrative overhead.$$),
    ('face-attendance', 1, $$Built modular pipelines for dataset collection, preprocessing, face detection, and live recognition, boosting identification accuracy by 15% and cutting processing time by 25%.$$),
    ('face-attendance', 2, $$Built a Tkinter GUI for non-technical staff to manage 120+ student attendance records, using CSV + Pandas for storage and retrieval in under 2 seconds, with recognition latency under 1 second per frame; validated modules with Pytest.$$),

    ('inamigos-ngo', 0, $$Built a fully static, mobile-responsive single-page site for a real NGO across 10 sections using Flexbox/Grid across 3 breakpoints, achieving a 90+ Lighthouse performance score and sub-2-second page load time, with a live Razorpay donation gateway and a volunteer sign-up form.$$),

    ('portfolio-fullstack', 0, $$Rebuilt a static HTML portfolio as a full-stack application, replacing hardcoded content with a React (Vite) frontend served by a Spring Boot REST API across 4 endpoints (/api/projects, /api/skills, /api/certifications, /api/contact).$$),
    ('portfolio-fullstack', 1, $$Modeled and versioned the PostgreSQL schema with Flyway migrations, decoupling content updates (projects, skills, certifications) from frontend code changes.$$),
    ('portfolio-fullstack', 2, $$Containerized PostgreSQL and the backend with Docker Compose, cutting local environment setup to 2 commands, and deployed the stack across 3 free-tier platforms (Neon, Render, Vercel) with a documented CORS and deployment guide.$$);

INSERT INTO project_metrics (project_id, list_index, metric) VALUES
    ('hiretrack', 0, '25+ REST Endpoints'), ('hiretrack', 1, '80%+ Code Coverage'),
    ('hiretrack', 2, '40% Pipeline Efficiency'), ('hiretrack', 3, '50+ Tests'),

    ('face-attendance', 0, '300+ Students Tracked'), ('face-attendance', 1, '<1s Frame Latency'),
    ('face-attendance', 2, '+15% Accuracy Boost'), ('face-attendance', 3, '<2s Data Retrieval'),

    ('inamigos-ngo', 0, '90+ Lighthouse Score'), ('inamigos-ngo', 1, '<2s Page Load Time'),
    ('inamigos-ngo', 2, '10 Custom Sections'), ('inamigos-ngo', 3, 'Live Razorpay Integration'),

    ('portfolio-fullstack', 0, '4 Spring REST Endpoints'), ('portfolio-fullstack', 1, 'Dockerized Compose Stack'),
    ('portfolio-fullstack', 2, '3-Cloud Architecture'), ('portfolio-fullstack', 3, 'Zero-Downtime Flyway');

-- ===================== Skill categories =====================

INSERT INTO skill_categories (id, category, suit_module, icon, description, display_order) VALUES
    (1, 'Languages', 'CORE SYNAPSE LOGIC', 'Terminal', $$Low-level system fundamentals and high-level algorithmic execution.$$, 1),
    (2, 'Backend & APIs', 'NEURAL BACKBONE / APIs', 'Server', $$Scalable micro-architectures, enterprise security, and transactional integrity.$$, 2),
    (3, 'Frontend', 'OPTICAL HUD & UI', 'Layout', $$Kinetic interfaces, state management, and high-frequency rendering.$$, 3),
    (4, 'Databases', 'PERSISTENT MEMORY CORES', 'Database', $$Relational modeling, migration pipelines, and optimized query plans.$$, 4),
    (5, 'Tools & DevOps', 'TACTICAL TOOLING & DEPLOY', 'Wrench', $$Containerized workflows, version control, and automated build pipelines.$$, 5),
    (6, 'Testing & Quality', 'INTEGRITY SHIELDS', 'ShieldCheck', $$Test-driven verification, behavioral mocking, and regression prevention.$$, 6),
    (7, 'CS Concepts', 'NEURAL FOUNDATIONS', 'Cpu', $$Rigorous algorithmic discipline and asymptotic efficiency.$$, 7);

-- Reset the identity sequence since we inserted explicit ids above.
SELECT setval(pg_get_serial_sequence('skill_categories', 'id'), (SELECT MAX(id) FROM skill_categories));

INSERT INTO skill_category_skills (skill_category_id, list_index, skill) VALUES
    (1, 0, 'Java'), (1, 1, 'Python'), (1, 2, 'C'), (1, 3, 'C++'), (1, 4, 'SQL'), (1, 5, 'JavaScript'),
    (2, 0, 'Spring Boot'), (2, 1, 'REST APIs'), (2, 2, 'JWT Auth'), (2, 3, 'RBAC'), (2, 4, 'Flyway'),
    (3, 0, 'React'), (3, 1, 'Vite'), (3, 2, 'HTML5'), (3, 3, 'CSS3'), (3, 4, 'JavaScript'),
    (4, 0, 'PostgreSQL'), (4, 1, 'SQL'), (4, 2, 'MySQL'),
    (5, 0, 'Git'), (5, 1, 'GitHub'), (5, 2, 'Docker'), (5, 3, 'Maven'), (5, 4, 'VS Code'),
    (6, 0, 'JUnit'), (6, 1, 'Mockito'), (6, 2, 'Pytest'),
    (7, 0, 'Data Structures'), (7, 1, 'Algorithms'), (7, 2, 'OOP'), (7, 3, 'System Design basics'), (7, 4, 'Complexity Analysis');

-- ===================== Certifications =====================

INSERT INTO certifications (id, title, issuer, dates, link, type, description, display_order) VALUES
    (1, 'InAmigos Foundation Internship', 'InAmigos Foundation', NULL,
     'https://drive.google.com/drive/u/2/folders/13wFVZXq9aytveHus7OP1GpGb9iN_i9cl', 'internship',
     $$Awarded appreciation certificate for web development, production responsiveness, and payment gateway delivery.$$, 1),
    (2, 'AI & Machine Learning Software Workshops', 'Industry Engineering Consortium', 'Jan 2026 – Feb 2026', NULL, 'workshop',
     $$Participated in hands-on workshops covering practical ML implementation, emerging technologies, and modern developer tooling.$$, 2),
    (3, 'Active Algorithmic Mastery & LeetCode', 'LeetCode (Self-directed)', NULL,
     'https://leetcode.com/u/datsaryan/', 'practice',
     $$Regularly solves algorithmic challenges covering Trees, Graphs, Dynamic Programming, and Arrays.$$, 3),
    (4, 'IBM Web Development Certificate', 'IBM / YourLearning', NULL,
     'https://skills.yourlearning.ibm.com/certificate/share/30c6fbdeddewogICJsZWFybmVyQ05VTSIgOiAiNzc1MTU3OVJFRyIsCiAgIm9iamVjdFR5cGUiIDogIkFDVElWSVRZIiwKICAib2JqZWN0SWQiIDogIlVSTC03NEQ0NDI0MTIxRTMiCn0a030fe9500-10', 'certification',
     $$Professional certification validating web application architecture, client-side engineering, and standards compliance.$$, 4),
    (5, 'Introduction to IoT Certification', 'NPTEL / IIT', NULL,
     'https://drive.google.com/file/d/1r910n2UXHTJkGke2zjC3cP9q_9YSJ2fI/view', 'certification',
     $$Comprehensive national certification on Internet of Things architectures, embedded networks, and sensor data.$$, 5);

SELECT setval(pg_get_serial_sequence('certifications', 'id'), (SELECT MAX(id) FROM certifications));
