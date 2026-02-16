
export enum LLMType {
  LOCAL = 'LOCAL',
  EXTERNAL = 'EXTERNAL'
}

export enum AgentStatus {
  RUNNING = 'RUNNING',
  SCHEDULED = 'SCHEDULED',
  PAUSED = 'PAUSED',
  ERROR = 'ERROR',
  STOPPED = 'STOPPED'
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  goal: string;
  status: AgentStatus;
  lastRun?: string;
  nextRun?: string;
  schedule: string;
  intervalValue: number;
  intervalUnit: 'min' | 'hour';
  isAutopilot: boolean; 
  type?: 'demo1' | 'demo2';
  linkedInAccount?: string;
  linkedInUrl?: string;
  accountEmail?: string; 
  browserProfilePath?: string; 
  lastPostUrl?: string;
  seenPostUrls?: string[]; 
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
  source: string;
  meta?: {
    url?: string;
    account?: string;
    llmType?: LLMType; 
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachment?: {
    name: string;
    mimeType: string;
    data: string;
  };
}

export interface Approval {
  id: string;
  agentId: string;
  title: string;
  content: string;
  timestamp: Date;
  sourceUrl?: string;
}
