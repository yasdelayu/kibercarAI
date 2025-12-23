
import React, { useEffect, useState } from 'react';
import { MessageSquare, Clock, User, Search, Filter, ArrowUpRight } from 'lucide-react';
import { UserRequestLog } from '../../types';
import { fetchUserLogs } from '../../services/api';

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<UserRequestLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUserLogs().then(setLogs);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(search.toLowerCase()) || 
    log.query.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Поиск по мастерам или вопросам..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-slate-800 rounded-2xl text-sm font-bold text-slate-300 hover:bg-slate-700 transition-colors">
          <Filter className="w-4 h-4" /> Фильтры
        </button>
      </div>

      <div className="space-y-4">
        {filteredLogs.map(log => (
          <div key={log.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="bg-slate-800 p-3 rounded-xl">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-200">{log.userName}</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 font-bold uppercase">{log.brandContext || 'Общее'}</span>
                  </div>
                  <p className="text-slate-300 text-sm italic font-medium">"{log.query}"</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <button className="p-1.5 bg-indigo-600/10 text-indigo-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-600 uppercase font-bold tracking-widest">
              <span>Использовано токенов: {log.tokens}</span>
              <span>Лог ID: #{log.id.padStart(5, '0')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
