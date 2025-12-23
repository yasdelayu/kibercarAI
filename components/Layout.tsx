
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Settings, Database, Github, LayoutGrid } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen pb-20 sm:pb-0">
      {/* Desktop Header */}
      <header className="hidden sm:block border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">{APP_NAME}</span>
          </div>
          
          <nav className="flex items-center space-x-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'hover:bg-slate-800 text-slate-400'
                }`
              }
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </NavLink>
            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                `flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'hover:bg-slate-800 text-slate-400'
                }`
              }
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-4 flex flex-col">
        {children}
      </main>

      {/* Mobile Tab Bar (Bottom Nav for Telegram) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 px-6 py-3 flex items-center justify-around z-50 pb-safe">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-all ${
              isActive ? 'text-indigo-400' : 'text-slate-500'
            }`
          }
        >
          <MessageSquare className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Чат</span>
        </NavLink>
        <NavLink 
          to="/admin" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-all ${
              isActive ? 'text-indigo-400' : 'text-slate-500'
            }`
          }
        >
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Админ</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
