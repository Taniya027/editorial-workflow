Editorial Workflow & Article Management System
A production-ready editorial workflow application built for technical assessment submission, featuring role-based access control, article lifecycle state management, immutable audit logs, and performant server-side pagination.

Tech Stack
Framework: Next.js 16 (App Router, Turbopack, Partial Prerendering)

ORM & Database: Prisma v6 with PostgreSQL (Supabase)

Authentication: NextAuth.js (Credentials Provider)

Styling: Tailwind CSS

Demo Credentials
Editor: editor@example.com / password123 (Full CRUD, publish rights, assign sections, view audit logs)

Writer: writer@example.com / password123 (Create & submit articles for assigned sections)

Local Development Setup
Clone the repository:
git clone https://github.com/Taniya027/editorial-workflow.git
cd editorial-workflow

Install dependencies:
npm install

Configure Environment Variables:
Create a .env file in the root directory and add your Supabase database URL and NextAuth secret:
DATABASE_URL="your-postgresql-supabase-connection-string"
NEXTAUTH_SECRET="editorial-workflow-secret-key-2026"
NEXTAUTH_URL="http://localhost:3000"

Run Prisma Migrations & Seed Data:
npx prisma db push
npx prisma db seed

Run the Development Server:
npm run dev

Open http://localhost:3000 in your browser.
or you can directly go to SUBMISSION.md and use the vercel link.