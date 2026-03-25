# Project Management Architect Console

A full-stack project management application with real-time updates, background jobs, and a polished "Architect" aesthetic.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Socket.io (WebSockets), Node-cron (Background jobs).
- **Database**: PostgreSQL (Relational design) via Prisma ORM.
- **Validation**: Zod (Server-side & Client-side).

## Architecture Decisions
- **WebSockets**: Chosen over polling for real-time "Live Engine Activity" and instant notifications. Socket.io was used for its robust reconnection logic and room support.
- **Job Queue**: `node-cron` was used for lightweight background tasks (checking overdue tasks). For higher scale, BullMQ with Redis would be the preferred upgrade path.
- **Token Handling**: JWT-based authentication stored in HttpOnly cookies (simulated in this demo via local storage for simplicity in preview).
- **Relational Design**: Prisma handles the schema, ensuring strict relationships between Users, Projects, Tasks, and Activity Logs.

## Setup Instructions (Docker)
1. Clone the repository.
2. Create a `.env` file based on `.env.example`.
3. Run `docker-compose up --build`.
4. The app will be available at `http://localhost:3000`.

## Database Schema
- **User**: Stores identity and roles (ADMIN, PM, DEVELOPER).
- **Project**: Groups tasks and assigns a Project Manager.
- **Task**: Individual work items with status, priority, and assignees.
- **ActivityLog**: Immutable record of all system changes.
- **Notification**: User-specific alerts triggered by system events or cron jobs.

## Known Limitations
- Background jobs run in-process; in a distributed system, these should be moved to a dedicated worker.
- File uploads are not implemented (placeholders used for avatars).
- Real-time updates are scoped globally for this demo; in production, they would be scoped to specific project rooms.
