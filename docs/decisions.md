Decisions
## Decision 1: Server-side role enforcement
Chosen: Role-based permissions will be enforced on the server.

Rejected: Frontend-only role restrictions.

Reason: The assignment explicitly requires that role differences must be enforced server-side.

## Decision 2

Chosen:
A single User table with role enum.

Rejected:
Separate Editor and Writer tables.

Reason:
Simpler permission model and easier authentication.
