export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'PM' | 'DEVELOPER';
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  manager: User;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string;
  projectId: string;
  project: Project;
  assignee?: User;
}

export interface ActivityLog {
  id: string;
  userId: string;
  user: User;
  action: string;
  details: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  read: boolean;
  timestamp: string;
}
