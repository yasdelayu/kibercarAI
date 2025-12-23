
import React, { useState, useMemo } from 'react';
import { User, Sparkles, FileText, Copy, Check } from 'lucide-react';
import { Message, MessageRole } from '../../types';
import { parse } from 'marked';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isAI = message.role === MessageRole.AI;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const htmlContent = useMemo(() => {
    return parse(message.content);
  }, [message.content]);

  return (
    <div className={`flex items-start space-x-4 ${isAI ? '' : 'flex-row-reverse space-x-reverse'}`}>
      <div className={`p-2 rounded-xl shrink-0 ${
        isAI ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-600/10' : 'bg-slate-700 text-slate-300'
      }`}>
        {isAI ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>
      
      <div className={`flex flex-col max-w-[85%] ${isAI ? 'items-start' : 'items-end'}`}>
        <div className={`relative group rounded-2xl px-5 py-4 leading-relaxed shadow-sm transition-all ${
          isAI 
            ? 'bg-slate-900 border border-slate-800 text-slate-200' 
            : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
        }`}>
          {isAI && (
            <button 
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
              title="Копировать ответ"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          )}

          <div 
            className="prose prose-invert prose-sm max-w-none 
              prose-p:leading-relaxed prose-strong:text-indigo-400 prose-code:text-amber-400 
              prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {isAI && message.sources && message.sources.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 animate-in slide-in-from-bottom-2 duration-300">
            <span className="text-[10px] text-slate-500 w-full mb-1 ml-1 uppercase font-bold tracking-widest">Источники KIBERCAR:</span>
            {message.sources.map((source, idx) => (
              <div 
                key={idx} 
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-[11px] text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-default"
              >
                <FileText className="w-3 h-3 shrink-0" />
                <span className="max-w-[150px] truncate">{source}</span>
              </div>
            ))}
          </div>
        )}
        
        <span className="mt-2 text-[10px] text-slate-600 px-2 font-medium">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
