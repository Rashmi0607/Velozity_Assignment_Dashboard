import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import { 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  Code, 
  Palette, 
  AlertTriangle, 
  MoreVertical,
  Calendar,
  Search,
  Bell,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { Task, Project, ActivityLog } from './types';
import { cn } from './lib/utils';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setStats({
      projects: 12,
      urgentTasks: 3,
      highTasks: 7
    });

    setActivities([
      {
        id: 1,
        action: "TASK_CREATED",
        details: "New task created",
        user: { name: "Admin" },
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        action: "PROJECT_UPDATE",
        details: "Project updated",
        user: { name: "Admin" },
        timestamp: new Date().toISOString()
      }
    ]);

    setTasks([
      {
        id: 1,
        title: "Complete dashboard UI",
        status: "PENDING",
        dueDate: new Date().toISOString(),
        project: { name: "Internal Tool" }
      },
      {
        id: 2,
        title: "Fix API integration",
        status: "IN_PROGRESS",
        dueDate: new Date().toISOString(),
        project: { name: "Client Work" }
      }
    ]);

    const socket = io();
    socket.on('activity', (newLog: ActivityLog) => {
      setActivities(prev => [newLog, ...prev.slice(0, 19)]);
    });

    return () => { socket.disconnect(); };
  }, []);

  if (!stats) return <div className="p-10">Loading Dashboard...</div>;

  return (
    <div className="p-10 max-w-400 mx-auto space-y-10">
      <header className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#001e4b] mb-1">Morning Overview</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#131b2e]">Precision Dashboard</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-xs w-64 outline-none" 
              placeholder="Search architecture..." 
            />
          </div>
          <Bell className="w-5 h-5 text-slate-500 cursor-pointer" />
          <Settings className="w-5 h-5 text-slate-500 cursor-pointer" />
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="text-xs font-bold text-[#131b2e]">{user?.name}</p>
              <p className="text-[10px] text-slate-500">{user?.role}</p>
            </div>
            <img className="w-8 h-8 rounded-full ring-2 ring-[#001e4b]/10" src={user?.avatar} alt="Avatar" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <div className="grid grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#001e4b] p-6 rounded-xl flex flex-col justify-between min-h-40 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-24 h-24 text-white" />
              </div>
              <div>
                <p className="text-[#829ddb] text-xs font-bold uppercase tracking-wider mb-2">My Projects</p>
                <h3 className="text-5xl font-black text-white">{stats.projects}</h3>
              </div>
              <div className="flex items-center gap-2 text-[#afc6ff] text-xs font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>+2 from last month</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl flex flex-col justify-between min-h-40 border border-slate-100 hover:border-red-200 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Critical Tasks</p>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <h3 className="text-5xl font-black text-[#131b2e]">{String(stats.urgentTasks).padStart(2, '0')}</h3>
              </div>
              <button className="flex items-center gap-2 text-red-500 text-xs font-bold group">
                View alerts 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl flex flex-col justify-between min-h-40 shadow-sm"
            >
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">High Priority</p>
                <h3 className="text-5xl font-black text-[#131b2e]">{stats.highTasks}</h3>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#592600] w-[75%] h-full rounded-full" />
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-sm font-black uppercase tracking-widest text-[#131b2e]">Recent Project Activity</h4>
              <button className="text-[10px] font-bold text-[#001e4b] hover:underline">Download Log</button>
            </div>
            <div className="space-y-2">
              {Array.isArray(activities) &&
                activities.map((log) => (
                  <div key={log.id} className="group grid grid-cols-12 items-center p-4 bg-white hover:bg-slate-50 transition-colors rounded-lg border border-slate-100">
                    <div className="col-span-1 flex justify-center">
                      <div className="w-8 h-8 rounded bg-[#001e4b]/5 flex items-center justify-center text-[#001e4b]">
                        {log.action.includes('TASK') ? <Code className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
                      </div>
                    </div>
                    <div className="col-span-5 px-4">
                      <p className="text-sm font-bold text-[#131b2e]">{log.details}</p>
                      <p className="text-[10px] text-slate-500">Action by {log.user.name}</p>
                    </div>
                    <div className="col-span-3 text-[11px] font-medium text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="col-span-2">
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase">Verified</span>
                    </div>
                    <div className="col-span-1 text-right">
                      <MoreVertical className="w-4 h-4 text-slate-300 group-hover:text-[#001e4b] cursor-pointer inline" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-10">
          <div className="bg-[#f2f3ff] p-8 rounded-xl min-h-125 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Timeline</p>
                <h4 className="text-xl font-bold text-[#131b2e]">Upcoming Due Dates</h4>
              </div>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {tasks.filter(t => t.status !== 'DONE').slice(0, 5).map((task, i) => (
                <div key={task.id} className={cn(
                  "relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1 before:w-0.5 before:h-full",
                  i === 0 ? "before:bg-red-500" : i === 1 ? "before:bg-[#001e4b]" : "before:bg-slate-300"
                )}>
                  <p className={cn(
                    "text-[10px] font-black uppercase mb-1",
                    i === 0 ? "text-red-500" : i === 1 ? "text-[#001e4b]" : "text-slate-400"
                  )}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-bold text-[#131b2e]">{task.title}</p>
                  <p className="text-xs text-slate-500">Project: {task.project.name}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-[#001e4b] text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-[#13336a] transition-all shadow-lg shadow-[#001e4b]/20">
              Create New Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}