
export enum MessageRole {
  USER = 'user',
  AI = 'ai'
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  sources?: string[];
  timestamp: Date;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
}

export type IngestStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface LibraryItem {
  id: string;
  title: string;
  brand: string;
  category: string;
  type: 'video' | 'file';
  status: IngestStatus;
  createdAt: Date;
  size?: string;
  chunks?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'master';
  lastActive: Date;
}

export interface UserRequestLog {
  id: string;
  userName: string;
  query: string;
  timestamp: Date;
  tokens: number;
  brandContext?: string;
}

export interface KnowledgeStats {
  totalDocs: number;
  totalChunks: number;
  totalRequests: number;
  activeUsers: number;
  lastSync: Date;
  storageUsed: string;
}

export interface IngestResponse {
  success: boolean;
  message: string;
}
