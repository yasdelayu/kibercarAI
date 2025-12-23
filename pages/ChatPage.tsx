
import React from 'react';
import ChatBox from '../components/Chat/ChatBox';
import { Sparkles } from 'lucide-react';

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full space-y-4 py-2">
      <div className="flex items-end justify-between px-2">
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
            KIBERCAR <span className="text-indigo-500">Technical AI</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">Ваш ассистент по тех. картам, схемам и установке доп. оборудования.</p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-bold border border-indigo-500/20 uppercase tracking-widest">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>RAG Engine Online</span>
        </div>
      </div>
      <ChatBox />
    </div>
  );
};

export default ChatPage;
