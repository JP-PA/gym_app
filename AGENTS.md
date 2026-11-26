
# Gym Management System — Agent Instructions

## Project
Gym management application with:
- Backend: Node.js, Express, MySQL
- Frontend: React, Vite
- Authentication: JWT
- Validation: Joi

## Architecture
- Respect existing folder structure.
- Keep database queries out of route handlers.
- Separate business logic from HTTP handling.
- Reuse existing utilities and middleware.
- Avoid introducing dependencies unnecessarily.

## Security
- Never expose passwords, tokens or secrets.
- Use parameterized SQL queries.
- Validate external input.
- Enforce authorization on protected operations.
- Never modify production data without approval.

## Development workflow
1. Inspect relevant files before editing.
2. Explain the proposed solution.
3. Prefer small, focused changes.
4. Add or update tests where appropriate.
5. Run available relevant checks.
6. Report errors and unresolved risks.

## Restrictions
- Do not delete files without approval.
- Do not modify database schemas without approval.
- Do not change authentication behavior silently.
- Do not commit or push automatically.
- Do not claim tests passed unless executed.

## Completion report
Summarize:
- Files changed
- Technical decisions
- Tests executed
- Remaining risks

## Session continuity
- Before resuming work, read `docs/CONTEXTO_PROYECTO.md` and the relevant README sections.
- The context document records decisions, completed changes, verification limits and known pending issues.
- Preserve existing uncommitted work. Update the context document when the user asks to save progress.
- Do not store passwords, tokens, connection credentials or `.env` contents in documentation.
