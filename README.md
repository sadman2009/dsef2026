# UpSkill - DSEF 2026 SOFT Project

AI-powered soft skills course platform for workers in developing economies.

## Features

- **User Authentication** - Secure email/password login with NextAuth.js
- **5 Soft Skills Courses** - Communication, Interview Skills, Workplace Etiquette, Time Management, Leadership
- **AI Tutor** - Groq-powered chatbot to help learners (24/7 available)
- **Progress Tracking** - Track course completion and progress
- **Admin Dashboard** - View users, courses, and analytics

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (better-sqlite3)
- **Auth**: NextAuth.js with bcrypt password hashing
- **AI**: Groq API (free tier: 1M tokens/day)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.local.example` to `.env.local` and add your values:

```bash
# Required: Generate a random secret
NEXTAUTH_SECRET=your-random-secret-at-least-32-chars

# Required: Get free API key from https://console.groq.com
GROQ_API_KEY=gsk_...

# Optional: Set admin email
ADMIN_EMAIL=your-email@example.com
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Create Admin User

1. Register a new account at `/register`
2. Manually update the user role in the database:
   ```bash
   sqlite3 data/database.db "UPDATE users SET role='admin' WHERE email='your-email@example.com';"
   ```

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── auth/      # NextAuth
│   │   ├── courses/   # Course CRUD
│   │   ├── register/  # User registration
│   │   └── tutor/     # AI tutor
│   ├── admin/         # Admin dashboard
│   ├── courses/       # Course pages
│   ├── dashboard/     # User dashboard
│   ├── login/         # Login page
│   └── register/      # Registration page
├── components/        # React components
└── lib/               # Utilities (db, auth)
```

## License

MIT