from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from pydantic import field_validator
import uuid

# In your backend Pydantic model
class UserCreate(SQLModel):
    email: str
    password: str
    name: str 
    image: str | None = None # Make extra fields optional if Better Auth sends them

class User(SQLModel, table=True):
    """User model - managed by Better Auth"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True)
    name: str
    image: Optional[str] = Field(default=None)
    password: str  # Add password field for authentication
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TaskBase(SQLModel):
    """Base model for Task with common fields"""
    title: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if not v or len(v) < 1 or len(v) > 200:
            raise ValueError('Title must be between 1 and 200 characters')
        return v


class Task(TaskBase, table=True):
    """Task model"""
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")  # Reference to the User table
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskCreate(TaskBase):
    """Schema for creating a new task"""
    pass


class TaskUpdate(SQLModel):
    """Schema for updating a task"""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskRead(TaskBase):
    """Schema for reading a task"""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime