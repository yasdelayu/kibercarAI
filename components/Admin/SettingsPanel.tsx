
import React, { useState, useEffect } from 'react';
import { 
  Save, Globe, Lock, ShieldCheck, Database, Server, Plus, X, 
  Tag, Car, Users, Mail, Trash2, Key, UserPlus, RefreshCw, 
  AlertCircle, Zap, Shield, User as UserIcon 
} from 'lucide-react';
import { N8N_INGEST_WEBHOOK_URL, N8N_CHAT_WEBHOOK_URL, getBrands, getCategories } from '../../constants';
import { fetchUsers, testConnection } from '../../services/api';
import { User } from '../../types';

const SettingsPanel: React.FC = () => {
  // Настройки Webhooks
  const [ingestUrl, setIngestUrl] = useState(localStorage.getItem('N8N_INGEST_URL') || N8N_INGEST_WEBHOOK_URL);
  const [chatUrl, setChatUrl] = useState(localStorage.getItem('N8N_CHAT_URL') || N8N_CHAT_WEBHOOK_URL);
  const [apiKey, setApiKey] = useState(localStorage.getItem('KIBERCAR_API_KEY') || '');
  
  // Списки данных
  const [brands, setBrands] = useState<string[]>(getBrands());
  const [categories, setCategories] = useState<string[]>(getCategories());
  const [users, setUsers] = useState<User[]>([]);
  
  // Состояния для новых элементов
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('');
  
  // Состояния для новых пользователей
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'master'>('master');

  const [isSaved, setIsSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<{[key: string]: 'idle' | 'loading' | 'success' | 'error'}>({ ingest: 'idle', chat: 'idle' });

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleSave = () => {
    localStorage.setItem('N8N_INGEST_URL', ingestUrl);
    localStorage.setItem('N8N_CHAT_URL', chatUrl);
    localStorage.setItem('KIBERCAR_API_KEY', apiKey);
    localStorage.setItem('KIBERCAR_BRANDS', JSON.stringify(brands));
    localStorage.setItem('KIBERCAR_CATEGORIES', JSON.stringify(categories));
    localStorage.setItem('KIBERCAR_USERS', JSON.stringify(users));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const runTest = async (type: 'ingest' | 'chat') => {
    setTestStatus(prev => ({ ...prev, [type]: 'loading' }));
    const ok = await testConnection(type);
    setTestStatus(prev => ({ ...prev, [type]: ok ? 'success' : 'error' }));
  };

  const addItem = (type: 'brand' | 'category') => {
    if (type === 'brand' && newBrand.trim()) {
      if (!brands.includes(newBrand.trim())) {
        setBrands(prev => [...prev, newBrand.trim()].sort());
        setNewBrand('');
      }
    } else if (type === 'category' && newCategory.trim()) {
      if (!categories.includes(newCategory.trim())) {
        setCategories(prev => [...prev, newCategory.trim()].sort());
        setNewCategory('');
      }
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      lastActive: new Date()
    };

    setUsers(prev => [...prev, newUser]);
    setNewUserName('');
    setNewUserEmail('');
  };

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const removeItem = (type: 'brand' | 'category', value: string) => {
    if (type === 'brand') setBrands(prev => prev.filter(b => b !== value));
    else setCategories(prev => prev.filter(c => c !== value));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-top-4 duration-500 pb-20">
      
      {/* 1. Security & Webhooks */}
      <section className="grid grid-cols-1 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 bg-rose-500/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-rose-400" />
              <h2 className="text-lg font-bold text-white">Доступ к API n8n</h2>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Мастер-ключ (API Key)</label>
              <input 
                type="password" 
                placeholder="Секретный ключ авторизации..."
                value={apiKey} 
                onChange={e => setApiKey(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-rose-600/50 outline-none transition-all" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Ingest Webhook</label>
                  <button onClick={() => runTest('ingest')} className="text-[10px] text-indigo-400 font-black flex items-center gap-1">
                    {testStatus.ingest === 'loading' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />} ТЕСТ
                  </button>
                </div>
                <input type="text" value={ingestUrl} onChange={e => setIngestUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs font-mono" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Chat Webhook</label>
                  <button onClick={() => runTest('chat')} className="text-[10px] text-indigo-400 font-black flex items-center gap-1">
                    {testStatus.chat === 'loading' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />} ТЕСТ
                  </button>
                </div>
                <input type="text" value={chatUrl} onChange={e => setChatUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs font-mono" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. User Management (НОВОЕ!) */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 bg-emerald-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Управление командой</h2>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Form to add user */}
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Имя</label>
              <input 
                type="text" 
                placeholder="Иван Иванов" 
                value={newUserName} 
                onChange={e => setNewUserName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Email</label>
              <input 
                type="email" 
                placeholder="ivan@kibercar.com" 
                value={newUserEmail} 
                onChange={e => setNewUserEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Роль</label>
              <select 
                value={newUserRole} 
                onChange={e => setNewUserRole(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none cursor-pointer"
              >
                <option value="master">Мастер</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
              >
                <UserPlus className="w-4 h-4" /> Добавить
              </button>
            </div>
          </form>

          {/* Users List */}
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between bg-slate-900/40 border border-slate-800 p-4 rounded-2xl group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${user.role === 'admin' ? 'bg-indigo-600/10 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                    {user.role === 'admin' ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {user.name}
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border ${user.role === 'admin' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' : 'border-slate-700 text-slate-500'}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeUser(user.id)}
                  className="p-2 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Brands & Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col h-[400px] shadow-lg">
          <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-indigo-600/5">
            <Car className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white uppercase tracking-tight text-sm">Марки машин</h3>
          </div>
          <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex gap-2">
            <input type="text" placeholder="Новая марка..." value={newBrand} onChange={e => setNewBrand(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem('brand')} className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-indigo-600 outline-none" />
            <button onClick={() => addItem('brand')} className="p-2.5 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
            {brands.map(b => (
              <div key={b} className="flex items-center justify-between group bg-slate-800/30 rounded-xl px-4 py-2 hover:bg-slate-800/60 transition-colors">
                <span className="text-xs text-slate-300 font-medium">{b}</span>
                <button onClick={() => removeItem('brand', b)} className="p-1 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col h-[400px] shadow-lg">
          <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-indigo-600/5">
            <Tag className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white uppercase tracking-tight text-sm">Оборудование</h3>
          </div>
          <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex gap-2">
            <input type="text" placeholder="Новый тип..." value={newCategory} onChange={e => setNewCategory(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem('category')} className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-indigo-600 outline-none" />
            <button onClick={() => addItem('category')} className="p-2.5 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
            {categories.map(c => (
              <div key={c} className="flex items-center justify-between group bg-slate-800/30 rounded-xl px-4 py-2 hover:bg-slate-800/60 transition-colors">
                <span className="text-xs text-slate-300 font-medium">{c}</span>
                <button onClick={() => removeItem('category', c)} className="p-1 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. Global Save Action */}
      <div className="sticky bottom-8 flex justify-end">
        <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-5 rounded-2xl transition-all flex items-center gap-3 shadow-2xl shadow-indigo-600/40 border-t border-white/10 uppercase tracking-[0.2em] text-sm active:translate-y-1">
          {isSaved ? <ShieldCheck className="w-5 h-5 animate-bounce" /> : <Save className="w-5 h-5" />}
          {isSaved ? 'Сохранено!' : 'Сохранить все изменения'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
