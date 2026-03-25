import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1 Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@velozity.com',
      name: 'Rashmi HV',
      password: hashedPassword,
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rashmi',
    },
  });

  // 2 Project Managers
  const pm1 = await prisma.user.create({
    data: {
      email: 'alex.chen@velozity.com',
      name: 'Alex Chen',
      password: hashedPassword,
      role: 'PM',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
  });

  const pm2 = await prisma.user.create({
    data: {
      email: 'julianne.devis@velozity.com',
      name: 'Julianne Devis',
      password: hashedPassword,
      role: 'PM',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julianne',
    },
  });

  // 4 Developers
  const devs = await Promise.all([
    prisma.user.create({
      data: {
        email: 'dev1@velozity.com',
        name: 'Marcus Chen',
        password: hashedPassword,
        role: 'DEVELOPER',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      },
    }),
    prisma.user.create({
      data: {
        email: 'dev2@velozity.com',
        name: 'Sarah Connor',
        password: hashedPassword,
        role: 'DEVELOPER',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
    }),
    prisma.user.create({
      data: {
        email: 'dev3@velozity.com',
        name: 'Alex Rivera',
        password: hashedPassword,
        role: 'DEVELOPER',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera',
      },
    }),
    prisma.user.create({
      data: {
        email: 'dev4@velozity.com',
        name: 'John Doe',
        password: hashedPassword,
        role: 'DEVELOPER',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
    }),
  ]);

  // 3+ projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Project Obsidian',
        description: 'Next-gen architectural engine for high-performance precision.',
        managerId: pm2.id,
      },
    }),
    prisma.project.create({
      data: {
        name: 'Neptune Core',
        description: 'Cloud-native infrastructure for modern enterprise.',
        managerId: pm1.id,
      },
    }),
    prisma.project.create({
      data: {
        name: 'Alpha 2024',
        description: 'Global design token synchronization system.',
        managerId: pm1.id,
      },
    }),
  ]);

  // 5+ tasks each
  for (const project of projects) {
    for (let i = 1; i <= 6; i++) {
      const isOverdue = project.name === 'Alpha 2024' && i <= 2;
      const dueDate = new Date();
      if (isOverdue) {
        dueDate.setDate(dueDate.getDate() - 5); // 5 days ago
      } else {
        dueDate.setDate(dueDate.getDate() + (i * 2));
      }

      const task = await prisma.task.create({
        data: {
          title: `Task #${project.name.split(' ')[0]}-${i}`,
          description: `Detailed implementation for ${project.name} component ${i}.`,
          status: i % 3 === 0 ? 'IN_PROGRESS' : i % 4 === 0 ? 'DONE' : 'BACKLOG',
          priority: i === 1 ? 'URGENT' : i < 3 ? 'HIGH' : 'MEDIUM',
          dueDate: dueDate,
          projectId: project.id,
          assigneeId: devs[i % 4].id,
        },
      });

      // Activity logs
      await prisma.activityLog.create({
        data: {
          userId: devs[i % 4].id,
          action: 'TASK_UPDATED',
          details: `Updated Task ${task.title} to ${task.status}`,
          timestamp: new Date(Date.now() - (i * 3600000)),
        },
      });
    }
  }

  // Initial Notifications
  await prisma.notification.create({
    data: {
      userId: pm2.id,
      title: 'Critical Alert',
      message: 'Architectural Sync Failure on #ALPHA-2024',
      type: 'ERROR',
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
