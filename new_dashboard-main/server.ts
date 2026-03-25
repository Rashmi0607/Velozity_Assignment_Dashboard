import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  app.use(cors());
  app.use(express.json());

  // --- Auth Middleware ---
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // --- API Routes ---

  // Auth
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, avatar: user.avatar } });
  });

  // Dashboard Stats
  app.get('/api/dashboard/stats', authenticate, async (req, res) => {
    const projectCount = await prisma.project.count();
    const urgentTasks = await prisma.task.count({ where: { priority: 'URGENT' } });
    const highTasks = await prisma.task.count({ where: { priority: 'HIGH' } });
    const overdueTasks = await prisma.task.count({ where: { dueDate: { lt: new Date() }, status: { not: 'DONE' } } });

    res.json({
      projects: projectCount,
      urgentTasks,
      highTasks,
      overdueTasks,
    });
  });

  // Projects
  app.get('/api/projects', authenticate, async (req, res) => {
    const projects = await prisma.project.findMany({
      include: { manager: true, tasks: true },
    });
    res.json(projects);
  });

  // Tasks
  app.get('/api/tasks', authenticate, async (req, res) => {
    const tasks = await prisma.task.findMany({
      include: { project: true, assignee: true },
      orderBy: { dueDate: 'asc' },
    });
    res.json(tasks);
  });

  app.patch('/api/tasks/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { status, priority } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: { status, priority },
      include: { assignee: true, project: true },
    });

    // Log activity
    const log = await prisma.activityLog.create({
      data: {
        userId: (req as any).user.id,
        action: 'TASK_UPDATED',
        details: `Updated ${task.title} to ${status}`,
      },
      include: { user: true },
    });

    // Broadcast via WebSocket
    io.emit('activity', log);
    io.emit('task_updated', task);

    res.json(task);
  });

  // Activity Logs
  app.get('/api/activity', authenticate, async (req, res) => {
    const logs = await prisma.activityLog.findMany({
      include: { user: true },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });
    res.json(logs);
  });

  // Notifications
  app.get('/api/notifications', authenticate, async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: (req as any).user.id },
      orderBy: { timestamp: 'desc' },
    });
    res.json(notifications);
  });

  // --- Background Jobs (Cron) ---
  // Check for overdue tasks every hour
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running overdue task check...');
    const overdue = await prisma.task.findMany({
      where: {
        dueDate: { lt: new Date() },
        status: { not: 'DONE' },
      },
      include: { assignee: true, project: true },
    });

    for (const task of overdue) {
      if (task.assigneeId) {
        // Create notification if it doesn't exist for this task today
        await prisma.notification.create({
          data: {
            userId: task.assigneeId,
            title: 'Task Overdue',
            message: `Task "${task.title}" in project "${task.project.name}" is overdue!`,
            type: 'WARNING',
          },
        });
      }
    }
  });

  // --- WebSocket Logic ---
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);
    socket.on('disconnect', () => console.log('🔌 Client disconnected'));
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
