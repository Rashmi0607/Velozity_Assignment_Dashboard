import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  BarChart3, 
  Network, 
  Users, 
  HelpCircle, 
  LogOut, 
  Box 
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { cn } from './lib/utils';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ClipboardList, label: 'Tasks', path: '/tasks' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Network, label: 'Projects', path: '/projects' },
  { icon: Users, label: 'Team', path: '/team' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-72 z-50 bg-[#f2f3ff] flex flex-col py-8 font-['Inter'] text-sm tracking-wide">
      <div className="px-6 mb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#001e4b] flex items-center justify-center">
          <Box className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-[#001e4b]">Architect Console</h2>
          <p className="text-xs text-slate-500 font-medium">Enterprise Edition</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-6 py-3 text-slate-600 font-medium hover:bg-[#eaedff]/50 transition-all group",
              location.pathname === item.path && "text-[#001e4b] bg-[#eaedff] border-l-4 border-[#001e4b]"
            )}
          >
            <item.icon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-6 space-y-1">
        <Link to="/help" className="flex items-center gap-3 px-4 py-3 text-slate-600 font-medium hover:bg-[#eaedff]/50 transition-all group">
          <HelpCircle className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          Help Center
        </Link>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-medium hover:bg-[#eaedff]/50 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}