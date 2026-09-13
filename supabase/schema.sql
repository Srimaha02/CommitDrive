-- =============================================================================
-- CommitDrive — Supabase PostgreSQL Database Schema
-- Production DDL for Student Authentication, Learning Path & Practical Path
-- Copy and paste this directly into the Supabase SQL Editor to initialize.
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'SDE Aspirant 2026',
    target_year VARCHAR(10) DEFAULT '2026',
    streak INT DEFAULT 1,
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. LEARNING PATH: TOPIC PROGRESS TABLE (OS, DBMS, CN)
CREATE TABLE IF NOT EXISTS user_topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(20) NOT NULL, -- 'os', 'dbms', 'cn'
    topic_id VARCHAR(50) NOT NULL, -- e.g. 'os-1', 'dbms-4', 'cn-8'
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_subject_topic UNIQUE (user_id, subject, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_topic_progress_user ON user_topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_subject ON user_topic_progress(user_id, subject);

-- 3. LEARNING PATH: FLASHCARD REVIEWS TABLE (Spaced Repetition)
CREATE TABLE IF NOT EXISTS user_flashcard_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(20) NOT NULL,
    topic_id VARCHAR(50) NOT NULL,
    card_id VARCHAR(50) NOT NULL, -- e.g. 'os-1-fc-1'
    status VARCHAR(20) DEFAULT 'REVIEW_NEEDED', -- 'MASTERED' or 'REVIEW_NEEDED'
    review_count INT DEFAULT 1,
    last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_flashcard UNIQUE (user_id, subject, topic_id, card_id)
);

CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_user ON user_flashcard_reviews(user_id);

-- 4. PRACTICAL PATH: MISSION COMPLETION TABLE (Git, Linux, SQL)
CREATE TABLE IF NOT EXISTS user_mission_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(20) NOT NULL, -- 'git', 'linux', 'sql'
    mission_id VARCHAR(50) NOT NULL, -- e.g. 'git-1', 'linux-4', 'sql-8'
    completed BOOLEAN DEFAULT FALSE,
    attempts_count INT DEFAULT 1,
    unlocked_solution_used BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_module_mission UNIQUE (user_id, module_id, mission_id)
);

CREATE INDEX IF NOT EXISTS idx_mission_progress_user ON user_mission_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_progress_module ON user_mission_progress(user_id, module_id);

-- 5. PRACTICAL PATH: TIMED MOCK TEST ATTEMPTS & DIAGNOSTICS TABLE
CREATE TABLE IF NOT EXISTS user_mock_test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(20) NOT NULL, -- 'git', 'linux', 'sql'
    score INT NOT NULL,
    total_questions INT NOT NULL DEFAULT 10,
    percentage INT NOT NULL,
    passed BOOLEAN NOT NULL,
    time_spent_seconds INT,
    category_breakdown JSONB, -- JSON array of category performance & weak area tags
    answers_json JSONB, -- User selected options map
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mock_test_user ON user_mock_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_test_module ON user_mock_test_attempts(user_id, module_id);

-- =============================================================================
-- SEED DEFAULT DEMO STUDENT (Password: "student123" hashed with BCrypt)
-- =============================================================================
INSERT INTO users (id, email, password_hash, full_name, role, target_year, streak)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'cs.placement@prep.edu',
    '$2a$10$wE9L0ZgG1N0B7W0M.hWdY.X0ZgG1N0B7W0M.hWdY.X0ZgG1N0B7W', -- BCrypt for student123
    'Mikro Student',
    'SDE Aspirant 2026',
    '2026',
    3
)
ON CONFLICT (email) DO NOTHING;

-- Seed sample completed topics for demo student
INSERT INTO user_topic_progress (user_id, subject, topic_id, completed, completed_at)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'os', 'os-1', true, CURRENT_TIMESTAMP - INTERVAL '2 days'),
    ('a0000000-0000-0000-0000-000000000001', 'os', 'os-2', true, CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('a0000000-0000-0000-0000-000000000001', 'dbms', 'dbms-1', true, CURRENT_TIMESTAMP - INTERVAL '3 days'),
    ('a0000000-0000-0000-0000-000000000001', 'cn', 'cn-1', true, CURRENT_TIMESTAMP - INTERVAL '4 days')
ON CONFLICT (user_id, subject, topic_id) DO NOTHING;

-- Seed sample completed practical missions for demo student
INSERT INTO user_mission_progress (user_id, module_id, mission_id, completed, attempts_count)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'git', 'git-1', true, 1),
    ('a0000000-0000-0000-0000-000000000001', 'git', 'git-2', true, 2),
    ('a0000000-0000-0000-0000-000000000001', 'linux', 'linux-1', true, 1),
    ('a0000000-0000-0000-0000-000000000001', 'sql', 'sql-1', true, 1),
    ('a0000000-0000-0000-0000-000000000001', 'sql', 'sql-2', true, 1)
ON CONFLICT (user_id, module_id, mission_id) DO NOTHING;
