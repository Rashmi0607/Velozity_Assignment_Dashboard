# Project Management Architect Console

A frontend-focused project management dashboard with basic backend support and real-time activity updates.

## Tech Stack

* React, TypeScript, Tailwind CSS
* Node.js, Express
* Socket.io (real-time)
* node-cron (background jobs)

##  Setup

```bash
# backend
cd backend
npm install
node server.js

# frontend
cd frontend
npm install
npm run dev
```

## Features

* Basic JWT authentication
* Dashboard with task stats
* Task creation & updates
* Real-time activity feed (Socket.io)
* Sidebar navigation (React Router)
* Overdue task detection (cron)

## APIs

* `/api/auth/login`
* `/api/tasks`
* `/api/activity`
* `/api/dashboard/stats`
* `/api/notifications`


---
