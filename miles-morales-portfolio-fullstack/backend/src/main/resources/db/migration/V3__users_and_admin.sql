CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS education (
    id BIGSERIAL PRIMARY KEY,
    institution VARCHAR(300) NOT NULL,
    degree VARCHAR(300) NOT NULL,
    cgpa VARCHAR(50),
    timeline VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS education_coursework (
    education_id BIGINT NOT NULL REFERENCES education(id) ON DELETE CASCADE,
    list_index INT NOT NULL,
    coursework VARCHAR(200) NOT NULL,
    PRIMARY KEY (education_id, list_index)
);

CREATE TABLE IF NOT EXISTS experience (
    id BIGSERIAL PRIMARY KEY,
    role VARCHAR(200) NOT NULL,
    organization VARCHAR(300) NOT NULL,
    dates VARCHAR(100),
    location VARCHAR(200),
    type VARCHAR(100),
    description TEXT,
    display_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS experience_bullets (
    experience_id BIGINT NOT NULL REFERENCES experience(id) ON DELETE CASCADE,
    list_index INT NOT NULL,
    bullet TEXT NOT NULL,
    PRIMARY KEY (experience_id, list_index)
);

CREATE TABLE IF NOT EXISTS experience_tech_stack (
    experience_id BIGINT NOT NULL REFERENCES experience(id) ON DELETE CASCADE,
    list_index INT NOT NULL,
    tech VARCHAR(100) NOT NULL,
    PRIMARY KEY (experience_id, list_index)
);
