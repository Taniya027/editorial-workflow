# Database Schema & Data Architecture

## Overview
The application uses Prisma ORM connected to a PostgreSQL database (Supabase). The schema enforces strict referential integrity and supports role-based access control, article lifecycle states, audit logging, and section management.

---

## Data Models

### `User`
Stores user identity, authentication credentials, and system role.
* `id` (String, PK, `cuid()`): Unique identifier.
* `email` (String, Unique): User email address.
* `password` (String): Hashed password.
* `role` (Enum `Role`): `EDITOR` or `WRITER`.
* `createdAt` / `updatedAt` (DateTime): Timestamps.

### `Section`
Represents an editorial category (e.g., Tech, Politics).
* `id` (String, PK, `cuid()`): Unique identifier.
* `name` (String, Unique): Section name.
* `description` (String, Optional): Overview of the section.
* `isArchived` (Boolean, default `false`): Soft-deletion flag.
* `ownerEditorId` (String, FK -> `User.id`): Editor responsible for the section.
* `createdAt` / `updatedAt` (DateTime): Timestamps.

### `SectionAssignment`
Junction model for many-to-many relationship between Writers and Sections.
* `id` (String, PK, `cuid()`): Unique identifier.
* `sectionId` (String, FK -> `Section.id`): Section ID.
* `userId` (String, FK -> `User.id`): Assigned writer ID.

### `Article`
Core content entity managed through the lifecycle state machine.
* `id` (String, PK, `cuid()`): Unique identifier.
* `title` (String): Article title.
* `body` (Text): Article body content.
* `status` (Enum `ArticleStatus`): `DRAFT`, `IN_REVIEW`, `APPROVED`, `SCHEDULED`, `PUBLISHED`.
* `publishTime` (DateTime, Optional): Target or actual publication timestamp.
* `authorId` (String, FK -> `User.id`): Writer who created the article.
* `sectionId` (String, FK -> `Section.id`): Associated section.
* `createdAt` / `updatedAt` (DateTime): Timestamps.

### `AuditLog`
Tracks system events and state transitions for accountability.
* `id` (String, PK, `cuid()`): Unique identifier.
* `action` (String): Action performed (e.g., `CHANGE_STATUS`, `UPDATE_ARTICLE`).
* `details` (String, Optional): Additional contextual data.
* `userId` (String, FK -> `User.id`): Performing user ID.
* `articleId` (String, FK -> `Article.id`, Optional): Associated article.
* `createdAt` (DateTime): Event timestamp.

---

## Constraints & Scalability

### DB vs. Application Constraints
* **Database Constraints:** Foreign keys (`ON DELETE CASCADE`), unique constraints on emails and section names, and default boolean values.
* **Application Constraints:** State machine transitions, role permissions (Writer vs. Editor logic), and self-approval prevention rules are enforced via Server Actions.

### Scaling Considerations (100x Data)
1. **Indexes:** Adding compound indexes on `Article(status, publishTime)` and `Article(sectionId, status)` for fast search and overdue alert checks.
2. **Search Performance:** Text search over `title` and `body` currently uses PostgreSQL `ILIKE`; at scale, this should transition to PostgreSQL Full Text Search or ElasticSearch.