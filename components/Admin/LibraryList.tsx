
import React, { useEffect, useState } from 'react';
import { Search, Car, Box, FileText, Youtube, RefreshCw, Trash2, Tag, Database, Edit3, X, Save, AlertCircle } from 'lucide-react';
import { LibraryItem } from '../../types';
import { fetchLibraryItems, deleteLibraryItem, updateLibraryItem } from '../../services/api';
import { getBrands, getCategories } from '../../constants';

const LibraryList: React.FC = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const brands = getBrands();
  const categories = getCategories();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLibraryItems();
      setItems(data);
    } catch (err) {
      setError('Не удалось загрузить список ресурсов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот ресурс из базы знаний?')) return;
    
    setActionLoading(true);
    try {
      await deleteLibraryItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert('Ошибка при удалении ресурса');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setActionLoading(true);
    try {
      await updateLibraryItem(editingItem);
      setItems(prev => prev.map(i => i.id === editingItem.id ? editingItem : i));
      setEditingItem(null);
    } catch (err) {
      alert('Ошибка при обновлении ресурса');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = items.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) || 
    i.brand.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Поиск по марке, модели или оборудованию..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
          />
        </div>
        <button 
          onClick={load}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 rounded-2xl text-sm font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-tight">{error}</span>
        </div>
      )}

      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-xl">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-bold uppercase text-slate-500 tracking-widest">
                  <th className="px-6 py-5">Автомобиль</th>
                  <th className="px-6 py-5">Тип оборудования</th>
                  <th className="px-6 py-5">Название ресурса</th>
                  <th className="px-6 py-5">Дата</th>
                  <th className="px-6 py-5 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                          <Car className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-bold text-slate-200">{item.brand}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-400 font-medium">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        {item.type === 'video' ? <Youtube className="w-4 h-4 text-rose-500" /> : <FileText className="w-4 h-4 text-indigo-400" />}
                        <span className="text-sm font-medium truncate max-w-[250px]">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono uppercase">
                      {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => setEditingItem(item)}
                          disabled={actionLoading}
                          className="p-2.5 hover:bg-indigo-500/10 hover:text-indigo-400 rounded-xl transition-all text-slate-600 disabled:opacity-50"
                          title="Редактировать"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          disabled={actionLoading}
                          className="p-2.5 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all text-slate-600 disabled:opacity-50"
                          title="Удалить из базы"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="bg-slate-800 p-4 rounded-full">
              <Database className="w-10 h-10 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-300">Данные не найдены</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Попробуйте изменить запрос или добавьте новые данные во вкладке "Добавить данные".</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden shadow-indigo-600/10">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-indigo-600/5">
              <div className="flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white uppercase tracking-tight">Редактировать ресурс</h3>
              </div>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Название ресурса</label>
                <input 
                  type="text" 
                  value={editingItem.title}
                  onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Марка автомобиля</label>
                  <select 
                    value={editingItem.brand}
                    onChange={e => setEditingItem({...editingItem, brand: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all cursor-pointer"
                  >
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Тип оборудования</label>
                  <select 
                    value={editingItem.category}
                    onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all"
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="flex-[2] px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryList;
