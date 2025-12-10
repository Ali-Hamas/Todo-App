from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List
from db import get_session, engine
from auth import get_current_user
from models import Task, TaskCreate, TaskUpdate, TaskRead, User
from tasks_crud import get_user_tasks, get_task_by_id, create_task_for_user, update_task, delete_task
from sqlmodel import SQLModel
import uuid
from datetime import datetime
from passlib.context import CryptContext
from jose import jwt
import os

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create the FastAPI app
app = FastAPI(title="Todo API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# JWT settings
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-super-secret-key-change-in-production")
ALGORITHM = "HS256"

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    # Add expiration if needed
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/auth/register", response_model=dict)
def register_user(
    email: str,
    password: str,
    name: str,
    db: Session = Depends(get_session)
):
    """Register a new user."""
    # Check if user already exists
    existing_user = db.exec(select(User).where(User.email == email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = get_password_hash(password)

    # Create new user
    user = User(
        email=email,
        name=name,
        password=hashed_password  # Add password field to User model
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create access token
    token_data = {"sub": user.id, "email": user.email}
    access_token = create_access_token(data=token_data)

    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name}}


@app.post("/auth/login", response_model=dict)
def login_user(
    email: str,
    password: str,
    db: Session = Depends(get_session)
):
    """Authenticate user and return access token."""
    # Find user by email
    user = db.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    token_data = {"sub": user.id, "email": user.email}
    access_token = create_access_token(data=token_data)

    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name}}


@app.get("/api/tasks", response_model=List[TaskRead])
def list_tasks(
    status_filter: str = "all",
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """List all tasks for authenticated user."""
    tasks = get_user_tasks(db, current_user_id, status_filter)
    return tasks


@app.post("/api/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Create a new task."""
    task = create_task_for_user(db, task_data, current_user_id)
    return task


@app.put("/api/tasks/{task_id}", response_model=TaskRead)
def update_task_endpoint(
    task_id: int,
    task_update: TaskUpdate,
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Update a task."""
    task = update_task(db, task_id, current_user_id, task_update)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@app.delete("/api/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_endpoint(
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Delete a task."""
    success = delete_task(db, task_id, current_user_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return

# Create database tables
@app.on_event("startup")
def on_startup():
    # Create tables
    SQLModel.metadata.create_all(engine)


@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}


# For running with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
