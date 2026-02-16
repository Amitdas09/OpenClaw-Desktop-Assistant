
import React, { useState, useRef, useEffect } from 'react';
import { LLMService } from '../services/llm';
import { ChatMessage, Agent, AgentStatus } from '../types';

interface ChatInterfaceProps {
  onClose: () => void;
  llm: LLMService;
  createAgent: (agent: Partial<Agent>) => boolean;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  stopAgent: (id: string) => void;
  deleteAgent: (id: string) => void;
  agents: Agent[];
  addLog: (m: string, l?: any, s?: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose, llm, createAgent, updateAgent, stopAgent, deleteAgent, agents, addLog }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome back, Amit! Your account is already linked (https://www.linkedin.com/in/amit-das-13001137b/). I am ready to deploy your agents using your AVG Browser Profile 2. \n\nWhat would you like to launch?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string, data: string, mimeType: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setSelectedFile({ name: file.name, data: base64, mimeType: file.type });
      addLog(`File received: ${file.name}`, "INFO", "Chat");
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (customInput?: string) => {
    const text = customInput || input;
    if (!text.trim() && !selectedFile) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text || `Uploaded document: ${selectedFile?.name}`,
      timestamp: new Date(),
      attachment: selectedFile || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setSelectedFile(null);
    setIsTyping(true);

    try {
      const intent = await llm.parseIntent(text);
      let responseText = "";
      
      if (intent.action === "CREATE_DEMO_1") {
        const success = createAgent({ 
          name: "Trending Hunter", 
          role: "Researcher", 
          goal: "LinkedIn Trends", 
          schedule: "Daily", 
          type: 'demo1'
        });
        responseText = success 
          ? `Agent 1 is ready for Amit! I'll scan for trends and draft a post for auto-publishing.`
          : `Agent 1 is already running, Amit. You can manage it in the 'My Agents' tab.`;
      } else if (intent.action === "CREATE_DEMO_2") {
        const success = createAgent({ 
          name: "Hashtag Promo", 
          role: "Marketer", 
          goal: "Monitor #openclaw", 
          schedule: "Hourly", 
          type: 'demo2'
        });
        responseText = success 
          ? `Agent 2 is now active. I'll interact with #openclaw posts via your AVG session.`
          : `Agent 2 is already active, Amit. No need to duplicate!`;
      } else if (intent.action === "UPDATE_AGENT" && intent.params?.agentId) {
        updateAgent(intent.params.agentId, { ...intent.params });
        responseText = `Configuration updated for your agent, Amit.`;
      } else if (intent.action === "STOP_AGENT" && intent.params?.agentId) {
        stopAgent(intent.params.agentId);
        responseText = "Automation instance paused.";
      } else {
        responseText = await llm.generateResponse(text || "Help Amit with his LinkedIn profile.", messages.map(m => ({ role: m.role, content: m.content })), userMessage.attachment);
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: responseText, timestamp: new Date() }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Sorry Amit, I hit a snag. Please check your connection or retry.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
      <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <i className="fas fa-robot text-indigo-400"></i> OpenClaw for Amit
        </h3>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><i className="fas fa-times"></i></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-[24px] px-5 py-4 text-sm shadow-lg leading-relaxed ${
              msg.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
            }`}>
              {msg.attachment && (
                <div className="mb-3 p-3 bg-slate-950/50 rounded-xl flex items-center gap-3 text-[11px] text-indigo-300 border border-indigo-500/20">
                  <i className="fas fa-file-pdf text-lg"></i> 
                  <span className="font-bold truncate">{msg.attachment.name}</span>
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900/80 border-t border-slate-800">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar text-[9px] font-black uppercase tracking-tighter text-slate-400">
           <button onClick={() => handleSend("Deploy Agent 1")} className="whitespace-nowrap px-4 py-1.5 bg-indigo-600/20 text-indigo-400 rounded-full border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all">Agent 1 (Trends)</button>
           <button onClick={() => handleSend("Deploy Agent 2")} className="whitespace-nowrap px-4 py-1.5 bg-indigo-600/20 text-indigo-400 rounded-full border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all">Agent 2 (Hashtags)</button>
           <button onClick={() => handleSend("Verify my session")} className="whitespace-nowrap px-4 py-1.5 bg-slate-800 rounded-full border border-slate-700 hover:border-indigo-500">Check Sync</button>
        </div>
        
        {selectedFile && (
          <div className="mb-3 p-2 px-3 bg-indigo-600/10 rounded-xl border border-indigo-500/30 flex items-center justify-between text-[11px] text-indigo-400 font-bold">
            <span className="truncate">📎 PDF Linked: {selectedFile.name}</span> 
            <button onClick={() => setSelectedFile(null)} className="text-rose-500 hover:bg-rose-500/10 w-6 h-6 rounded-lg flex items-center justify-center transition-all"><i className="fas fa-times"></i></button>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-400 transition-all shadow-xl">
            <i className="fas fa-paperclip text-lg"></i>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
          <div className="relative flex-1">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message your assistant..."
              className="w-full h-12 bg-slate-800 border border-slate-700 rounded-2xl px-5 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <button 
            onClick={() => handleSend()} 
            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
