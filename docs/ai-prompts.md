# AI Prompt History & Usage

AI tools were utilized during development to generate schema boilerplate, speed up repetitive UI drafting, and resolve TypeScript/Prisma edge cases.

---

## Prompts & Iterations

### 1. Database Schema Generation
* **Prompt:** *"Create a Prisma schema for an editorial workflow app with User (roles EDITOR, WRITER), Section, SectionAssignment, Article (statuses DRAFT, IN_REVIEW, APPROVED, SCHEDULED, PUBLISHED), and AuditLog."*
* **Outcome:** Clean initial schema generated. Manual adjustment made to add relation indexes and soft-delete flags.

### 2. State Machine Rule Guard
* **Prompt:** *"Write a server-side state transition function for Next.js that validates article state moves and ensures authors cannot approve their own work."*
* **Outcome:** Successfully provided validation logic. Custom error messages were refined manually.

### 3. Resolving Prisma Inclusion Type Errors
* **Prompt:** *"Fix TypeScript error TS2322 where Prisma findMany select type is missing relation properties on Article."*
* **Outcome:** Recommended explicit `include: { author: true, section: true }` blocks, resolving the type mismatch in `lib/articles.ts`.