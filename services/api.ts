
import { N8N_INGEST_WEBHOOK_URL, N8N_CHAT_WEBHOOK_URL } from '../constants';
import { ChatResponse, Message, LibraryItem, KnowledgeStats, User, UserRequestLog } from '../types';

const getConfigs = () => {
  const ingest = localStorage.getItem('N8N_INGEST_URL');
  const chat = localStorage.getItem('N8N_CHAT_URL');
  const apiKey = localStorage.getItem('KIBERCAR_API_KEY') || '';
  
  return {
    ingest: (ingest && ingest !== 'undefined' && ingest !== '') ? ingest : N8N_INGEST_WEBHOOK_URL,
    chat: (chat && chat !== 'undefined' && chat !== '') ? chat : N8N_CHAT_WEBHOOK_URL,
    apiKey
  };
};

const getHeaders = (isJson = true) => {
  const { apiKey } = getConfigs();
  const headers: HeadersInit = {
    'X-Kibercar-Auth': apiKey,
  };
  if (isJson) headers['Content-Type'] = 'application/json';
  return headers;
};

export const testConnection = async (type: 'ingest' | 'chat'): Promise<boolean> => {
  const configs = getConfigs();
  const url = type === 'ingest' ? configs.ingest : configs.chat;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action: 'ping', timestamp: new Date().toISOString() })
    });
    return response.ok;
  } catch (e) {
    return false;
  }
};

export const ingestUrl = async (url: string, brand: string, category: string): Promise<void> => {
  const { ingest } = getConfigs();
  const response = await fetch(ingest, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ url, brand, category, type: 'video', action: 'ingest' }),
  });
  if (!response.ok) throw new Error(`Status: ${response.status}`);
};

export const ingestFile = async (file: File, brand: string, category: string): Promise<void> => {
  const { ingest } = getConfigs();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('brand', brand);
  formData.append('category', category);
  formData.append('type', 'file');

  const response = await fetch(ingest, {
    method: 'POST',
    headers: getHeaders(false),
    body: formData,
  });
  if (!response.ok) throw new Error(`Upload error: ${response.status}`);
};

export const updateLibraryItem = async (item: LibraryItem): Promise<void> => {
  const { ingest } = getConfigs();
  const response = await fetch(ingest, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ 
      action: 'update',
      id: item.id,
      title: item.title,
      brand: item.brand,
      category: item.category
    }),
  });
  if (!response.ok) throw new Error(`Update error: ${response.status}`);
};

export const deleteLibraryItem = async (id: string): Promise<void> => {
  const { ingest } = getConfigs();
  const response = await fetch(ingest, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ action: 'delete', id }),
  });
  if (!response.ok) throw new Error(`Delete error: ${response.status}`);
};

export const sendChatQuery = async (query: string, history: Message[]): Promise<ChatResponse> => {
  const { chat } = getConfigs();
  const response = await fetch(chat, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ 
      query, 
      history: history.slice(-6).map(m => ({ role: m.role, content: m.content }))
    }),
  });

  if (response.status === 401 || response.status === 403) throw new Error('auth_error');
  if (!response.ok) throw new Error('connection_failed');
  
  const data = await response.json();
  return { answer: data.answer || 'Ответ не получен.', sources: data.sources || [] };
};

export const fetchLibraryItems = async (): Promise<LibraryItem[]> => {
  const { ingest } = getConfigs();
  try {
    const response = await fetch(`${ingest}?action=list`, { headers: getHeaders() });
    if (response.ok) return await response.json();
  } catch (e) {}
  return [];
};

export const fetchUsers = async (): Promise<User[]> => {
  const stored = localStorage.getItem('KIBERCAR_USERS');
  if (stored) return JSON.parse(stored);
  
  return [{ id: 'u1', name: 'Администратор KIBERCAR', email: 'admin@kibercar.com', role: 'admin', lastActive: new Date() }];
};

export const getStats = async (): Promise<KnowledgeStats> => {
  const users = await fetchUsers();
  return {
    totalDocs: 342, totalChunks: 15400, totalRequests: 1280,
    activeUsers: users.length, lastSync: new Date(), storageUsed: '890 MB'
  };
};

export const fetchUserLogs = async (): Promise<UserRequestLog[]> => {
  return [];
};
