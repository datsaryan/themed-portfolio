CREATE TABLE profile (
    id INT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    hero_codename VARCHAR(200),
    title VARCHAR(200),
    tagline VARCHAR(300),
    phone VARCHAR(50),
    email VARCHAR(200),
    location VARCHAR(200),
    status VARCHAR(200),
    github_url VARCHAR(300),
    linkedin_url VARCHAR(300),
    leetcode_url VARCHAR(300),
    resume_pdf_path VARCHAR(300),
    summary TEXT,
    institution VARCHAR(300),
    degree VARCHAR(300),
    cgpa VARCHAR(50),
    timeline VARCHAR(100)
);

CREATE TABLE profile_coursework (
    profile_id INT NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
    list_index INT NOT NULL,
    coursework VARCHAR(200) NOT NULL,
    PRIMARY KEY (profile_id, list_index)
);

CREATE TABLE projects (
    id VARCHAR(100) PRIMARY KEY,
    mission_number VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300),
    dates VARCHAR(100),
    sector VARCHAR(200),
    summary TEXT,
    github_url VARCHAR(300),
    live_url VARCHAR(300),
    accent_color VARCHAR(20),
    display_order INT NOT NULL
);

CREATE TABLE project_tech_stack (
    project_id VARCHAR(100) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    list_index INT NOT NULL,
    tech VARCHAR(100) NOT NULL,
    PRIMARY KEY (project_id, list_index)
);

CREATE TABLE project_bullets (
    project_id VARCHAR(100) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    list_index INT NOT NULL,
    bullet TEXT NOT NULL,
    PRIMARY KEY (project_id, list_index)
);

CREATE TABLE project_metrics (
    project_id VARCHAR(100) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    list_index INT NOT NULL,
    metric VARCHAR(200) NOT NULL,
    PRIMARY KEY (project_id, list_index)
);

CREATE TABLE skill_categories (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(200) NOT NULL,
    suit_module VARCHAR(200),
    icon VARCHAR(100),
    description TEXT,
    display_order INT NOT NULL
);

CREATE TABLE skill_category_skills (
    skill_category_id BIGINT NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    list_index INT NOT NULL,
    skill VARCHAR(100) NOT NULL,
    PRIMARY KEY (skill_category_id, list_index)
);

CREATE TABLE certifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    issuer VARCHAR(300),
    dates VARCHAR(100),
    link VARCHAR(500),
    type VARCHAR(50) NOT NULL,
    description TEXT,
    display_order INT NOT NULL
);

CREATE TABLE contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP NOT NULL DEFAULT now()
);
