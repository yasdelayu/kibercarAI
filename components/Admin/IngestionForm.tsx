
import React, { useState, useEffect } from 'react';
import { Youtube, FileUp, CheckCircle2, AlertCircle, Loader2, Link as LinkIcon, Layers, Car, Box } from 'lucide-react';
import { ingestUrl, ingestFile } from '../../services/api';
import { getBrands, getCategories } from '../../constants';
import FileUploadZone from './FileUploadZone';

const IngestionForm: React.FC = () => {
  const brands = getBrands();
  const categories = getCategories();
  
  const [url, setUrl] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(brands[0] || '');
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [notif, setNotif] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Sync selection if lists change in settings
  useEffect(() => {
    if (!brands.includes(selectedBrand)) setSelectedBrand(brands[0] || '');
    if (!categories.includes(selectedCategory)) setSelectedCategory(categories[0] || '');
  }, [brands, categories]);

  const handleAction = async (task: () => Promise<void>) => {
    setIsLoading(true); setStep(1);
    try {
      await task();
      setStep(2); await new Promise(r => setTimeout(r, 1500));
      setStep(3); setNotif({ type: 'success', msg: 'Данные KIBERCAR успешно добавлены!' });
      setTimeout(() => { setStep(0); setNotif(null); }, 3000);
    } catch (e) {
      setNotif({ type: 'error', msg: 'Ошибка отправки в n8n' });
      setStep(0);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {notif && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-bounce ${notif.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
          {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold">{notif.msg}</span>
        </div>
      )}

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-2">
            <Car className="w-3 h-3 text-indigo-400" /> Марка автомобиля
          </label>
          <select 
            value={selectedBrand} 
            onChange={e => setSelectedBrand(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all cursor-pointer"
          >
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-2">
            <Box className="w-3 h-3 text-indigo-400" /> Тип оборудования
          </label>
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all cursor-pointer"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {step > 0 && (
        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-4">
          <div className="flex justify-between mb-2 text-xs font-bold text-indigo-400">
            <span>{step === 1 ? 'Передача в n8n...' : step === 2 ? 'Индексация в векторную базу...' : 'Готово!'}</span>
            <span>{step * 33}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${step * 33.3}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <Youtube className="w-6 h-6 text-red-500" />
            <h3 className="font-bold">Видео с YouTube</h3>
          </div>
          <div className="flex flex-col gap-4">
            <input 
              type="url" 
              placeholder="https://youtube.com/..." 
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm"
            />
            <button 
              onClick={() => handleAction(() => ingestUrl(url, selectedBrand, selectedCategory))}
              disabled={isLoading || !url}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              Добавить видео
            </button>
          </div>
        </div>

        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <FileUp className="w-6 h-6 text-indigo-400" />
            <h3 className="font-bold">Файлы (PDF, TXT)</h3>
          </div>
          <FileUploadZone onFileSelect={f => handleAction(() => ingestFile(f, selectedBrand, selectedCategory))} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default IngestionForm;
