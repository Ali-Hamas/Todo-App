✅ Constitution for Phase II – Full-Stack Web Application

(Full, complete, ready to use)

**Phase II Constitution

Todo App – Full-Stack Web Application**

Purpose

Phase II upgrades the Todo application from an in-memory console program into a modern, full-stack, multi-user web application with persistent cloud storage.
All development must follow Spec-Driven Development with Claude Code and Spec-Kit Plus, using clear specs for every feature.

I. Objectives

Transform the Phase I Console App into a production-ready web app.

Implement all Basic Level Todo Features through a REST API and UI:

Add Task

View Tasks

Update Task

Delete Task

Mark Complete

Support Multi-User Authentication using Better Auth (JWT).

Store all data in Neon Serverless PostgreSQL.

Provide a clean, responsive UI built with Next.js 16+, App Router, Tailwind.

Enforce strict Spec-Driven Development:

Every feature must have a spec in /specs

Claude Code must generate all code

No manual writing of backend/frontend logic

II. Technology Stack
Frontend

Next.js 16+ (App Router)

TypeScript

Tailwind CSS

Better Auth (Authentication)

JWT token communication with backend

Backend

FastAPI (Python)

SQLModel ORM

Neon PostgreSQL

JWT verification middleware

REST API endpoints under /api/

Supporting Tools

GitHub Spec-Kit Plus

Claude Code

Monorepo structure

Docker (optional for testing)

III. Mandatory Folder Structure (Monorepo)
hackathon-todo/
│
├── .spec-kit/
│   └── config.yaml
│
├── specs/
│   ├── overview.md
│   ├── architecture.md
│   ├── database/schema.md
│   ├── api/rest-endpoints.md
│   └── features/
│       ├── task-crud.md
│       └── authentication.md
│
├── CLAUDE.md
│
├── frontend/
│   ├── CLAUDE.md
│   └── (Next.js App)
│
├── backend/
│   ├── CLAUDE.md
│   └── (FastAPI App)
│
└── README.md

IV. Required Features (Phase II)
1. Authentication (Better Auth + JWT)
Requirements:

Signup & Login pages in Next.js

Better Auth session handling

JWT issued on successful login

JWT attached to every API call:

Authorization: Bearer <token>

Backend must:

Verify JWT signature

Extract user ID

Match user ID with URL parameter

Reject unauthorized requests

No request should succeed without a valid JWT.
2. REST API Endpoints
GET /api/{user_id}/tasks

List all user tasks

POST /api/{user_id}/tasks

Create task

GET /api/{user_id}/tasks/{id}

Get specific task

PUT /api/{user_id}/tasks/{id}

Update task

DELETE /api/{user_id}/tasks/{id}

Delete task

PATCH /api/{user_id}/tasks/{id}/complete

Toggle completion

V. Database Constitution
Table: tasks
Field	Type	Notes
id	int (PK)	autoincrement
user_id	text	FK (Better Auth)
title	text	required
description	text	optional
completed	bool	default false
created_at	timestamp	auto
updated_at	timestamp	auto
Rules:

Every query MUST filter by user_id

No user can access another user’s data

All timestamps must be automatically generated

VI. Frontend UI Requirements

Modern, responsive interface (Tailwind)

Pages required:

/ – redirect based on session

/login

/signup

/dashboard

Dashboard should support:

View all tasks

Add task form

Edit task modal

Delete confirmation dialog

Mark complete toggle

UI must use REST API only—no local state storage for tasks

VII. Spec-Driven Development Rules

No code is written manually.

Every new feature MUST have a spec:

/specs/features/...

/specs/api/...

/specs/database/...

Implementation command example:

@specs/features/task-crud.md  
Implement full CRUD in both frontend and backend


If Claude Code generates incorrect output:

Improve the spec

Run again

Repeat until correct

VIII. Acceptance Criteria

A Phase II submission is only valid if:

✔ Fully working frontend (on Vercel)
✔ Fully working backend (hosted or local)
✔ Neon DB connected
✔ JWT auth set up
✔ All 5 Basic Level features implemented
✔ Entire project follows monorepo + Spec-Kit standard
✔ Demo video (≤90 seconds)
✔ Specs included for every feature
IX. Deliverables

Public GitHub repo

Vercel frontend link

Backend API URL

Specs folder

CLAUDE.md files

90-second demo video

Submission form completed

X. Rules of Compliance

Any manual backend/frontend logic → automatic disqualification

Missing specs → phase invalid

JWT not implemented → phase invalid

UI without API connection → phase invalid

Hard-coded user IDs → not allowed

XI. Completion Statement

Upon fulfilling every part of this Constitution, the developer shall have produced a fully functional, secure, multi-user Todo Web App meeting all Phase II requirements of Hackathon II.
