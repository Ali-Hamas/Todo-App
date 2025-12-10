from sqlmodel import select, Session, func
from typing import List, Optional
from models import Task, TaskCreate, TaskUpdate
from fastapi import HTTPException, status


def get_user_tasks(db_session: Session, user_id: str, status_filter: Optional[str] = None) -> List[Task]:
    """Get all tasks for a specific user with optional status filter."""
    statement = select(Task).where(Task.user_id == user_id)

    if status_filter and status_filter != "all":
        if status_filter == "pending":
            statement = statement.where(Task.completed == False)
        elif status_filter == "completed":
            statement = statement.where(Task.completed == True)

    statement = statement.order_by(Task.created_at.desc())
    tasks = db_session.exec(statement).all()
    return tasks


def get_task_by_id(db_session: Session, task_id: int, user_id: str) -> Optional[Task]:
    """Get a specific task by ID for a user."""
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = db_session.exec(statement).first()
    return task


def create_task_for_user(db_session: Session, task_data: TaskCreate, user_id: str) -> Task:
    """Create a new task for a user."""
    task_data_dict = task_data.model_dump()
    task = Task(**task_data_dict)
    task.user_id = user_id
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task


def update_task(db_session: Session, task_id: int, user_id: str, task_update: TaskUpdate) -> Optional[Task]:
    """Update a task for a user."""
    task = get_task_by_id(db_session, task_id, user_id)
    if not task:
        return None

    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    task.updated_at = func.now()
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task


def delete_task(db_session: Session, task_id: int, user_id: str) -> bool:
    """Delete a task for a user."""
    task = get_task_by_id(db_session, task_id, user_id)
    if not task:
        return False

    db_session.delete(task)
    db_session.commit()
    return True