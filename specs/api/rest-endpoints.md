# REST API Endpoints

## Authentication
All endpoints require JWT token in header: `Authorization: Bearer <token>`

## Endpoints

### GET /api/tasks
List all tasks for authenticated user.
- Query: status ("all"|"pending"|"completed")
- Response: Array of Task objects

### POST /api/tasks
Create a new task.
- Body: { title: string, description: string (optional) }
- Response: Created Task object

### PUT /api/tasks/{id}
Update a task.

### DELETE /api/tasks/{id}
Delete a task.