package com.aryansingh.portfolio.config;

import com.aryansingh.portfolio.model.*;
import com.aryansingh.portfolio.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    @org.springframework.context.annotation.Profile("!test")
    public CommandLineRunner seedData(
            ProfileRepository profileRepo,
            ProjectRepository projectRepo,
            SkillCategoryRepository skillCategoryRepo,
            CertificationRepository certRepo,
            EducationRepository educationRepo,
            ExperienceRepository experienceRepo,
            ContactMessageRepository contactRepo,
            UserRepository userRepo,
            PasswordEncoder passwordEncoder) {

        return args -> {
            // Only seed if empty
            if (profileRepo.count() > 0) return;

            // ============ PROFILE ============
            Profile profile = new Profile(
                "Aryan Singh",
                "Full-Stack Developer | Java · Spring Boot · React",
                "B.Tech CSE student at OP Jindal University with a passion for building robust, scalable full-stack applications. Experienced in Java backend development with Spring Boot, JWT authentication, and RESTful API design, as well as modern React + TypeScript frontends. Lover of clean code, system design, and the Upside Down.",
                "aryansobdh@gmail.com",
                "+91 8602879043",
                "https://github.com/datsaryan",
                "https://www.linkedin.com/in/aryan-singh-19b0a2293/",
                "https://leetcode.com/u/datsaryan/",
                "Raigarh, Chhattisgarh, India"
            );
            profileRepo.save(profile);

            // ============ EDUCATION ============
            educationRepo.save(new Education(
                "OP Jindal University, Raigarh",
                "Bachelor of Technology",
                "Computer Science & Engineering",
                "7.8 / 10.0",
                2023, 2027, true,
                "Core coursework: Data Structures & Algorithms, OOP, Database Management, Operating Systems, Computer Networks, Software Engineering, System Design."
            ));

            // ============ EXPERIENCE ============
            experienceRepo.save(new Experience(
                "InAmigos Foundation",
                "Web Developer Intern",
                "2023",
                "2024",
                false,
                "Developed and maintained the InAmigos Foundation website. Implemented responsive UI components, integrated backend APIs, and ensured cross-browser compatibility. Collaborated with design team to deliver pixel-perfect implementations.",
                "HTML, CSS, JavaScript, React, REST APIs"
            ));

            // ============ PROJECTS ============
            projectRepo.save(new Project(
                "HireTrack ATS",
                "A full-stack Applicant Tracking System built with Spring Boot and React. Features include JWT-based RBAC (Admin, HR, Candidate roles), Flyway database migrations, RESTful API design with comprehensive JUnit & Mockito test coverage, and a responsive Tailwind CSS frontend with real-time job tracking.",
                "Java, Spring Boot, Spring Security, JWT, RBAC, Flyway, PostgreSQL, React, TypeScript, Tailwind CSS, JUnit, Mockito, Maven",
                "https://github.com/datsaryan/hire-track-ats",
                null,
                true,
                1
            ));

            projectRepo.save(new Project(
                "Face-Based Attendance System",
                "An intelligent attendance management system leveraging computer vision and facial recognition. Automates attendance marking using real-time face detection, stores records in a structured database, and provides an admin dashboard for monitoring and reporting.",
                "Python, OpenCV, Face Recognition, Numpy, Pandas, SQLite, Tkinter",
                "https://github.com/datsaryan/face-attendance-system",
                null,
                true,
                2
            ));

            projectRepo.save(new Project(
                "InAmigos Foundation Website",
                "Official website for the InAmigos Foundation NGO. Built a fully responsive, multi-page website with modern UI/UX principles. Includes sections for about, events, gallery, team, and contact with form integration.",
                "HTML5, CSS3, JavaScript, React, REST API",
                "https://github.com/datsaryan/inamigos-foundation",
                null,
                false,
                3
            ));

            projectRepo.save(new Project(
                "Personal Portfolio Full-Stack",
                "A production-quality full-stack personal portfolio with a Stranger Things aesthetic. Spring Boot REST API backend with JWT authentication, React + TypeScript + Tailwind CSS frontend, dual world mode (Hawkins ↔ Upside Down), CRT scanlines, procedural audio engine, and animated spore particles.",
                "Java, Spring Boot, Spring Security, JWT, React, TypeScript, Tailwind CSS, Vite, PostgreSQL, H2, Flyway, Docker",
                "https://github.com/datsaryan/themed-portfolio",
                null,
                true,
                4
            ));

            // ============ SKILLS ============
            SkillCategory languages = new SkillCategory("Languages", 1);
            skillCategoryRepo.save(languages);
            languages.setSkills(List.of(
                new Skill("Java", 90, languages),
                new Skill("Python", 80, languages),
                new Skill("C", 70, languages),
                new Skill("C++", 72, languages),
                new Skill("SQL", 85, languages),
                new Skill("JavaScript", 82, languages),
                new Skill("TypeScript", 78, languages)
            ));
            skillCategoryRepo.save(languages);

            SkillCategory backend = new SkillCategory("Backend & APIs", 2);
            skillCategoryRepo.save(backend);
            backend.setSkills(List.of(
                new Skill("Spring Boot", 88, backend),
                new Skill("REST APIs", 90, backend),
                new Skill("JWT Auth", 85, backend),
                new Skill("RBAC", 80, backend),
                new Skill("Spring Security", 82, backend),
                new Skill("Flyway", 75, backend)
            ));
            skillCategoryRepo.save(backend);

            SkillCategory frontend = new SkillCategory("Frontend", 3);
            skillCategoryRepo.save(frontend);
            frontend.setSkills(List.of(
                new Skill("React", 82, frontend),
                new Skill("Vite", 78, frontend),
                new Skill("HTML5", 88, frontend),
                new Skill("CSS3", 85, frontend),
                new Skill("Tailwind CSS", 80, frontend)
            ));
            skillCategoryRepo.save(frontend);

            SkillCategory databases = new SkillCategory("Databases", 4);
            skillCategoryRepo.save(databases);
            databases.setSkills(List.of(
                new Skill("PostgreSQL", 82, databases),
                new Skill("MySQL", 80, databases),
                new Skill("H2 (In-Memory)", 75, databases)
            ));
            skillCategoryRepo.save(databases);

            SkillCategory devops = new SkillCategory("DevOps & Tools", 5);
            skillCategoryRepo.save(devops);
            devops.setSkills(List.of(
                new Skill("Git", 88, devops),
                new Skill("Docker", 72, devops),
                new Skill("Maven", 82, devops)
            ));
            skillCategoryRepo.save(devops);

            SkillCategory testing = new SkillCategory("Testing", 6);
            skillCategoryRepo.save(testing);
            testing.setSkills(List.of(
                new Skill("JUnit", 82, testing),
                new Skill("Mockito", 78, testing),
                new Skill("Pytest", 70, testing)
            ));
            skillCategoryRepo.save(testing);

            SkillCategory concepts = new SkillCategory("CS Fundamentals", 7);
            skillCategoryRepo.save(concepts);
            concepts.setSkills(List.of(
                new Skill("Data Structures & Algorithms", 85, concepts),
                new Skill("Object-Oriented Programming", 88, concepts),
                new Skill("System Design", 75, concepts),
                new Skill("Computer Networks", 72, concepts)
            ));
            skillCategoryRepo.save(concepts);

            // ============ CERTIFICATIONS ============
            certRepo.save(new Certification(
                "InAmigos Foundation Web Development Internship",
                "InAmigos Foundation",
                "2024",
                null,
                "Completed an intensive web development internship building production-ready features for the InAmigos Foundation digital presence."
            ));
            certRepo.save(new Certification(
                "Artificial Intelligence & Machine Learning Workshop",
                "OP Jindal University",
                "2024",
                null,
                "Attended hands-on AI & ML workshop covering supervised learning, neural networks, and Python-based ML pipelines."
            ));
            certRepo.save(new Certification(
                "IBM Full Stack Web Developer Certificate",
                "IBM / Coursera",
                "2024",
                null,
                "Completed IBM's comprehensive full-stack web developer course covering cloud-native development, microservices, and DevOps fundamentals."
            ));
            certRepo.save(new Certification(
                "NPTEL Internet of Things Certificate",
                "NPTEL / IIT",
                "2024",
                null,
                "Earned NPTEL certification in Internet of Things, covering embedded systems, sensor integration, and IoT protocols."
            ));
            certRepo.save(new Certification(
                "LeetCode — Consistent Problem Solver",
                "LeetCode",
                "2024",
                "https://leetcode.com/u/datsaryan/",
                "Regular competitive programming practice focusing on data structures, dynamic programming, graphs, and binary search."
            ));

            // ============ ADMIN USER ============
            if (!userRepo.existsByUsername("admin")) {
                userRepo.save(new User(
                    "admin",
                    passwordEncoder.encode("hawkins1983"),
                    "ROLE_ADMIN"
                ));
            }

            // ============ DEMO CONTACT MESSAGE ============
            contactRepo.save(new ContactMessage(
                "Chief Hopper",
                "hopper@hawkinspd.gov",
                "TRANSMISSION — CLASSIFIED",
                "Agent, the Demogorgon has been sighted near the lab. Your portfolio has been flagged by the Hawkins National Laboratory. Report to the Upside Down immediately. The Mind Flayer awaits."
            ));

            System.out.println("✅ [DataInitializer] Stranger Things Portfolio data seeded successfully.");
        };
    }
}
