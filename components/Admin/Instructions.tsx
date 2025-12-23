
import React from 'react';
import { Database, PlusCircle, MessageCircle, Settings2, ShieldCheck, Zap } from 'lucide-react';

const Instructions: React.FC = () => {
  const steps = [
    {
      title: 'Управление базой (Library)',
      desc: 'Вкладка "База схем" позволяет видеть все загруженные ресурсы. Используйте поиск по марке (BMW, Audi) или типу оборудования (Доводчики, Омыватели), чтобы проверить наличие данных.',
      icon: Database,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      title: 'Загрузка данных (Ingestion)',
      desc: 'Используйте "Добавить данные" для пополнения базы. Можно вставить ссылку на YouTube или перетащить PDF/TXT. Обязательно выбирайте марку и категорию — это критично для точности ответов AI.',
      icon: PlusCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'Мониторинг (Activity)',
      desc: 'Во вкладке "Запросы мастеров" вы видите реальные вопросы из чата. Если мастер не получил ответ, это сигнал, что в базу нужно добавить соответствующую схему или тех. карту.',
      icon: MessageCircle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    {
      title: 'Доступ и Связь (Settings)',
      desc: 'В настройках можно добавлять новых администраторов и мастеров. Также здесь настраиваются URL вебхуков n8n, которые отвечают за логику обработки данных и чат.',
      icon: Settings2,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-indigo-600 p-3 rounded-2xl">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Краткий обзор KIBERCAR AI Panel</h2>
            <p className="text-slate-400 text-sm italic">Инструмент для создания единого цифрового мозга техцентра</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex gap-5 p-5 bg-slate-950/50 border border-slate-800/50 rounded-2xl hover:border-slate-700 transition-colors">
                <div className={`shrink-0 p-3 h-fit rounded-xl ${step.bg}`}>
                  <Icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 p-6 bg-indigo-600/5 border border-dashed border-indigo-500/20 rounded-3xl">
        <ShieldCheck className="w-5 h-5 text-indigo-400" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">KIBERCAR AI: Доступно только для авторизованных сотрудников</span>
      </div>
    </div>
  );
};

export default Instructions;
