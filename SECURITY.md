# Security Documentation

This document outlines the security measures, vulnerabilities addressed, and best practices for the UpSkill platform.

## 🔒 Security Fixes Implemented

### 1. Rate Limiting (CRITICAL - FIXED)
**Vulnerability**: No rate limiting on API endpoints allowed brute force attacks.

**Fix Applied**:
- Added rate limiting middleware in [`src/middleware/rateLimit.ts`](src/middleware/rateLimit.ts)
- Limits: 10 requests per minute per IP address
- Applied to registration endpoint
- Returns `429 Too Many Requests` with retry information

**Files Modified**:
- `src/middleware/rateLimit.ts` (created)
- `src/app/api/register/route.ts` (rate limit added)

### 2. XSS Prevention (CRITICAL - FIXED)
**Vulnerability**: Course content rendered without sanitization could execute malicious scripts.

**Fix Applied**:
- Added DOMPurify library for HTML sanitization
- Created sanitization utilities in [`src/lib/sanitize.ts`](src/lib/sanitize.ts)
- All user-facing content (title, description, category) is sanitized
- Three levels of sanitization:
  - `sanitizeHtml()`: Allows safe HTML tags
  - `sanitizeText()`: Strips all HTML
  - `escapeHtml()`: Escapes special characters

**Files Modified**:
- `src/lib/sanitize.ts` (created)
- `src/app/courses/[courseId]/page.tsx` (sanitization applied)
- `package.json` (dompurify added)

### 3. Row Level Security Policies (CRITICAL - FIXED)
**Vulnerability**: RLS policies allowed any user to access all data.

**Fix Applied**:
- Dropped overly permissive "Allow all" policies
- Implemented user-level isolation:
  - Users can only access their own progress
  - Users can only access their own chat history
  - Courses are public read, admin write
  - Users table: authenticated read, admin write

**Migration**: `supabase/migrations/20260310000001_security_and_integrity.sql`

### 4. Type Safety (HIGH - FIXED)
**Vulnerability**: Use of `any` types bypassed TypeScript safety.

**Fix Applied**:
- Removed all `any` types from codebase
- Added proper TypeScript interfaces in [`src/lib/types/database.ts`](src/lib/types/database.ts)
- Extended NextAuth types for session safety
- All database operations now type-safe

### 5. Error Handling (HIGH - FIXED)
**Vulnerability**: Errors logged to console without proper handling.

**Fix Applied**:
- Centralized error handling in [`src/lib/errorHandler.ts`](src/lib/errorHandler.ts)
- Custom error classes: `AppError`, `ValidationError`, `AuthenticationError`, etc.
- Proper error responses with status codes
- Development vs production error detail handling

### 6. Password Security (HIGH - VERIFIED)
**Implementation**:
- bcrypt hashing with 12 rounds
- Password stored as `password_hash` (NOT NULL enforced)
- Minimum 8 characters required
- Email format validation

## 🛡️ Database Security

### RLS Policies

```sql
-- Users: Authenticated can read, admins can modify
CREATE POLICY "Users can read all users (demo)" ON users FOR SELECT
USING (auth.role() = 'authenticated');

-- Courses: Public read, admin write
CREATE POLICY "Public read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Admins manage courses" ON courses FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- Progress: User isolation
CREATE POLICY "Users manage own progress" ON progress FOR ALL
USING (auth.uid() = user_id);

-- Chat: User isolation
CREATE POLICY "Users manage own chat" ON chat_history FOR ALL
USING (auth.uid() = user_id);
```

### Indexes

Performance indexes added for:
- `progress(user_id)`
- `progress(course_id)`
- `chat_history(user_id)`
- `chat_history(course_id)`
- `courses(category)`
- `users(email)`

## 🚀 Applying the Security Migration

### Option 1: Using Supabase Dashboard
1. Go to Supabase Dashboard > Project > SQL Editor
2. Copy contents of `supabase/migrations/20260310000001_security_and_integrity.sql`
3. Run the migration

### Option 2: Using Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref jigzfsjqtuaivhtzopis

# Apply migration
supabase db push
```

### Note on Password Constraint
The migration sets `password_hash` to NOT NULL. If you have existing users without password_hash, run this first:
```sql
-- Check for users without password_hash
SELECT COUNT(*) FROM users WHERE password_hash IS NULL;

-- If count > 0, update or delete those users first
```

## 📋 Security Checklist for Production

Before deploying to production:

- [ ] Apply all database migrations
- [ ] Set strong `NEXTAUTH_SECRET` (min 32 chars)
- [ ] Configure environment variables properly
- [ ] Enable HTTPS
- [ ] Set up proper logging (not just console.error)
- [ ] Configure CORS for production domain
- [ ] Review and tighten RLS policies
- [ ] Set up monitoring and alerting
- [ ] Regular security audits
- [ ] Keep dependencies updated

## 🔐 Environment Variables

Required environment variables (see `.env.local.example`):

```bash
# Authentication
NEXTAUTH_SECRET=<strong-random-secret-min-32-chars>
NEXTAUTH_URL=https://your-domain.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Optional: AI features
GROQ_API_KEY=<your-groq-key>
```

## 📞 Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:
1. Do not disclose publicly
2. Contact the maintainers directly
3. Allow time for fix before disclosure

## 📚 Additional Resources

- [Supabase Security Documentation](https://supabase.com/docs/guides/database/security)
- [Next.js Security Best Practices](https://nextjs.org/docs/pages/building-your-application/security)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
