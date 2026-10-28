# Submission Details — Editorial Workflow System

## 1. Project Overview
- **Project Name:** Editorial Workflow Application
- **Repository URL:** https://github.com/Taniya027/editorial-workflow
- **Live Application URL:** https://editorial-workflow-1u6sbrhj9-taniya027.vercel.app/

---

## 2. Core Tech Stack
- **Framework:** Next.js (App Router, TypeScript)
- **Database & ORM:** Supabase PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js / Auth.js (Role-Based Access Control)

---

## 3. Demo Credentials
The database has been seeded with demo credentials for testing role permissions:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Editor** | `editor@example.com` | `password123` |
| **Writer** | `writer@example.com` | `password123` |

---

## 4. Functional Requirements Summary
- **Role-Based Access Control (RBAC):** Strict permissions distinguishing Editors and Writers across all workflows.
- **Editorial State Machine:** Enforced state transitions (`DRAFT` → `IN_REVIEW` → `APPROVED` → `PUBLISHED`).
- **Section Ownership & Assignments:** Section assignment validation restricting editing rights.
- **Audit Trail:** Immutable audit logging for state transitions and article revisions.
- **Batch Operations:** Bulk update capabilities for article statuses.
- **Overdue Review Endpoint:** Background API endpoint identifying overdue reviews.
- **Seeded Demo Data:** Populated database with sample users, sections, assignments, and articles.

---

## 5. Technical Documentation Index
Additional architectural and decision records are located in the `docs/` directory:
- `docs/architecture.md` — System architecture and component design.
- `docs/schema.md` — Data models and relational design.
- `docs/decisions.md` — Key technical decisions and trade-offs.
- `docs/ai-prompts.md` — AI prompt logs used during development.