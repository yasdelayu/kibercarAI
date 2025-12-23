
import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Database, 
  BookOpen, 
  Settings2, 
  FileText, 
  Zap, 
  Layers, 
  History,
  Car,
  Users,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import IngestionForm from '../components/Admin/IngestionForm';
import LibraryList from '../components/Admin/LibraryList';
import SettingsPanel from '../components/Admin/SettingsPanel';
import ActivityLog from '../components/Admin/ActivityLog';
import Instructions from '../components/Admin/Instructions';
import { getStats } from '../services/api';
import { KnowledgeStats } from '../types';

type Tab = 'library' | 'upload' | 'instructions' | 'activity' | 'settings';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('library');
  const [stats, setStats] = useState<KnowledgeStats | null>(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const navItems = [
    { id: 'library', label: 'База схем', icon: Database },
    { id: 'upload', label: 'Добавить данные', icon: PlusCircle },
    { id: 'instructions', label: 'Инструкции', icon: BookOpen },
    { id: 'activity', label: 'Запросы мастеров', icon: MessageCircle },
    { id: 'settings', label: 'Настройки', icon: Settings2 },
  ];

  return (
    <div className="py-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/30">
            <Car className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase italic">KIBERCAR AI Panel</h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Централизованное управление знаниями KIBERCAR
            </p>
          </div>
        </div>
        
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-w-[140px] hover:border-indigo-500/30 transition-all">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-indigo-400" /> Документов
              </div>
              <div className="text-xl font-bold text-slate-100">{stats.totalDocs}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-w-[140px] hover:border-indigo-500/30 transition-all">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> Запросов AI
              </div>
              <div className="text-xl font-bold text-slate-100">{stats.totalRequests.toLocaleString()}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-w-[140px] hover:border-indigo-500/30 transition-all">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-amber-400" /> Мастеров
              </div>
              <div className="text-xl font-bold text-slate-100">{stats.activeUsers}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-w-[140px] hover:border-indigo-500/30 transition-all">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-sky-400" /> Статус
              </div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase">Онлайн</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-1 p-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-sm font-medium ${
                    activeTab === item.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'library' && <LibraryList />}
          {activeTab === 'upload' && <IngestionForm />}
          {activeTab === 'instructions' && <Instructions />}
          {activeTab === 'activity' && <ActivityLog />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
