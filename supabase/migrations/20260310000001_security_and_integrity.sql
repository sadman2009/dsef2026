-- Migration: 20260310000001_security_and_integrity.sql
-- Purpose: Add security constraints, indexes, and proper RLS policies
-- IMPORTANT: Run this migration with Supabase CLI: supabase db push

-- 1. Add password hash NOT NULL constraint
-- Note: This will fail if there are existing users without password_hash
-- Run this only after ensuring all users have password_hash
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;

-- 2. Add email format validation
ALTER TABLE users ADD CONSTRAINT email_format CHECK (email LIKE '%@%.%');

-- 3. Add index for chat_history (unique constraint removed for flexibility)
-- Note: We use indexes instead of unique constraints for better flexibility
-- Duplicates can be handled at the application level

-- 4. Performance indexes
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_course_id ON progress(course_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_course_id ON chat_history(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 5. RLS Policy Improvements
-- First, drop the overly permissive policies
DROP POLICY IF EXISTS "Allow all for users" ON users;
DROP POLICY IF EXISTS "Allow all for courses" ON courses;
DROP POLICY IF EXISTS "Allow all for progress" ON progress;
DROP POLICY IF EXISTS "Allow all for chat_history" ON chat_history;

-- Users: Users can read own data, admins can read all
-- Note: For demo purposes, we allow authenticated users to read all users
-- In production, this should be restricted to own data
CREATE POLICY "Users can read all users (demo)" ON users FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can modify users" ON users FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Courses: Public read, admin write
CREATE POLICY "Public read courses" ON courses FOR SELECT USING (true);

CREATE POLICY "Admins manage courses" ON courses FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Progress: Users can only access their own progress
CREATE POLICY "Users manage own progress" ON progress FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Chat: Users can only access their own chat history
CREATE POLICY "Users manage own chat" ON chat_history FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Add comments for documentation
COMMENT ON TABLE users IS 'User accounts with authentication';
COMMENT ON TABLE courses IS 'Educational course content';
COMMENT ON TABLE progress IS 'User progress tracking for courses';
COMMENT ON TABLE chat_history IS 'AI tutor conversation history';

COMMENT ON COLUMN users.role IS 'User role: user or admin';
COMMENT ON COLUMN courses.order_index IS 'Display order for courses';
COMMENT ON COLUMN progress.progress_percent IS 'Completion percentage (0-100)';
