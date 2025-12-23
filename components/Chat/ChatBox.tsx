
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Loader2, Info, Wrench, AlertCircle, Database, Lock } from 'lucide-react';
import { Message, MessageRole } from '../../types';
import { sendChatQuery } from '../../services/api';
import MessageItem from './MessageItem';

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: MessageRole.AI,
      content: '### Приветствую в KIBERCAR Technical AI!\n\nЯ обучен на базе знаний нашего техцентра. Могу подсказать по:\n* Схемам подключения доводчиков и порогов\n* Точкам подключения CAN-шин\n* Инструкциям по разбору салона\n\nПросто напишите марку машины и что вы ищете.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // В Telegram WebApp лучше фокусироваться по клику, чтобы не перекрывать экран клавиатурой сразу
    // inputRef.current?.focus();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { 
      id: Date.now().toString(), 
      role: MessageRole.USER, 
      content: input, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendChatQuery(currentInput, messages);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: MessageRole.AI, 
        content: response.answer, 
        sources: response.sources, 
        timestamp: new Date() 
      }]);
    } catch (error: any) {
      let errorMsg = '### ❌ Ошибка соединения\nСервер n8n недоступен. Проверьте VPN и статус вебхука.';
      if (error.message === 'auth_error') {
        errorMsg = '### 🔒 Ошибка авторизации\nВаш API Key неверный или отсутствует. Пожалуйста, укажите его в настройках Admin панели.';
      }
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: MessageRole.AI, 
        content: errorMsg, 
        timestamp: new Date() 
      }]);
    } finally { 
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)] bg-slate-900/30 rounded-3xl border border-slate-800/50 shadow-2xl overflow-hidden backdrop-blur-sm relative">
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth custom-scrollbar"
      >
        {messages.map((msg) => <MessageItem key={msg.id} message={msg} />)}
        
        {isTyping && (
          <div className="flex items-start space-x-4 animate-in fade-in duration-300">
            <div className="bg-indigo-600/20 p-2 rounded-xl border border-indigo-500/20">
              <Wrench className="w-5 h-5 text-indigo-400 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium italic">Ищу в базе KIBERCAR...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 bg-slate-900/80 border-t border-slate-800 backdrop-blur-xl">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-end gap-2 sm:gap-3">
          <div className="relative flex-1 group">
            <textarea 
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { 
                if (e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  handleSend(e as any); 
                } 
              }}
              placeholder="Спросите AI..."
              className="w-full bg-slate-950 border border-slate-700/50 text-slate-100 rounded-2xl py-3.5 pl-4 pr-12 focus:ring-2 focus:ring-indigo-600/50 outline-none resize-none transition-all placeholder:text-slate-600 text-sm"
            />
          </div>
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping} 
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-2xl transition-all flex items-center justify-center shadow-lg active:scale-95 shrink-0"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
