# Feature: Task CRUD Operations

## User Stories
- As a user, I can create a new task
- As a user, I can view all my tasks (only my own)
- As a user, I can update a task's details
- As a user, I can delete a task
- As a user, I can mark a task complete

## Acceptance Criteria
- Title is required (1-200 chars).
- Backend filters all queries by `user_id` from the JWT token.
- Users cannot access tasks belonging to others.