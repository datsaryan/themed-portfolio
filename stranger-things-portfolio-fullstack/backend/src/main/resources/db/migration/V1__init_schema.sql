-- V1: Core portfolio tables
CREATE TABLE IF NOT EXISTS profile (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(200),
    bio TEXT,
    email VARCHAR(150),
    phone VARCHAR(30),
    github_url VARCHAR(300),
    linkedin_url VARCHAR(300),
    leetcode_url VARCHAR(300),
    location VARCHAR(150),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS education (
    id BIGSERIAL PRIMARY KEY,
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(200),
    field_of_study VARCHAR(200),
    cgpa VARCHAR(20),
    start_year INT,
    end_year INT,
    expected BOOLEAN DEFAULT FALSE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS experience (
    id BIGSERIAL PRIMARY KEY,
    organization VARCHAR(200) NOT NULL,
    role VARCHAR(200),
    start_date VARCHAR(30),
    end_date VARCHAR(30),
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    skills_used TEXT
);

CREATE TABLE IF NOT EXISTS skill_category (
    id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skill (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    proficiency INT DEFAULT 80,
    category_id BIGINT REFERENCES skill_category(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    tech_stack TEXT,
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    image_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS certification (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    issuer VARCHAR(200),
    issued_date VARCHAR(50),
    credential_url VARCHAR(500),
    description TEXT
);

CREATE TABLE IF NOT EXISTS contact_message (
    id BIGSERIAL PRIMARY KEY,
    sender_name VARCHAR(100),
    sender_email VARCHAR(150),
    subject VARCHAR(200),
    message TEXT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);
