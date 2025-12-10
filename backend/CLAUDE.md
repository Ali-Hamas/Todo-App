# Backend Guidelines
## Stack
- FastAPI, SQLModel, Neon PostgreSQL
## Database
- Use SQLModel for all operations.
- Connection string: DATABASE_URL (from env)
## Auth
- Verify JWT token from Better Auth using `BETTER_AUTH_SECRET`.