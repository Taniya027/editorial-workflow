# Architectural & Design Decisions

### 1. Server Actions for Mutation Logic
* **Decision:** Used Next.js Server Actions for all state transitions, section updates, and batch actions instead of REST/GraphQL API endpoints.
* **Rejected:** External REST API layer.
* **Reasoning:** Server Actions provide type safety across client and server without extra API boilerplate, allowing direct server-side auth checks.

### 2. Server-Side Filtering and Pagination
* **Decision:** Executed all search queries, filtering, sorting, and pagination directly on the database via Prisma.
* **Rejected:** In-memory browser filtering.
* **Reasoning:** Client-side filtering breaks at scale when handling thousands of articles.

### 3. Granular Error Reporting for Batch Actions
* **Decision:** Returned per-article status arrays (`{ id, success, error }`) for batch operations rather than rolling back the entire batch.
* **Rejected:** Atomic multi-record transaction that fails if one item is invalid.
* **Reasoning:** If an Editor selects 10 articles and 1 is in an invalid state (`IN_REVIEW`), processing the remaining 9 provides a better user experience.

### 4. Direct Foreign Key References over Loose Metadata
* **Decision:** Linked `AuditLog` entries directly to `User` and `Article` records via Prisma relations.
* **Rejected:** Storing unindexed JSON strings for audit logs.
* **Reasoning:** Direct foreign keys ensure integrity and allow quick lookups when rendering revision histories.

### 5. Cron Secret Protected API Route for Overdue Alerts
* **Decision:** Created an HTTP API route (`/api/alerts/overdue`) protected by `CRON_SECRET` headers to trigger state updates for overdue scheduled articles.
* **Rejected:** Stateful long-running node worker inside the Web server process.
* **Reasoning:** Serverless/edge deployments on platforms like Vercel sleep when idle. An HTTP endpoint allows external cron schedulers (e.g., GitHub Actions or Vercel Cron) to trigger background tasks reliably.