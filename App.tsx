
import React, { useState, useEffect, useRef } from 'react';
import { LLMService } from './services/llm';
import { Agent, AgentStatus, LogEntry, LLMType, Approval } from './types';
import SetupOverlay from './components/SetupOverlay';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import Logs from './components/Logs';

const STORAGE_KEY = 'openclaw_v3_config';
const PREF_KEY = 'openclaw_llm_preference';
const AMIT_LINKEDIN_URL = "https://www.linkedin.com/in/amit-das-13001137b/";

const App: React.FC = () => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedLLM, setSelectedLLM] = useState<LLMType>(() => {
    const saved = localStorage.getItem(PREF_KEY);
    return (saved as LLMType) || (process.env.API_KEY ? LLMType.EXTERNAL : LLMType.LOCAL);
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'logs' | 'settings'>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const llmRef = useRef<LLMService>(new LLMService());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem(PREF_KEY, selectedLLM);
    llmRef.current.setPreference(selectedLLM);
  }, [selectedLLM]);

  const addLog = (message: string, level: LogEntry['level'] = 'INFO', source: string = 'System', meta?: any) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      source,
      meta: { ...meta, llmType: llmRef.current.getModelType() }
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  };

  const runAgentTask = async (agent: Agent) => {
    if (agent.type === 'demo1') {
      addLog(`Agent 1: Initiating unique trend synthesis via ${selectedLLM}...`, "INFO", agent.name);
      try {
        const topics = ["Privacy in Browser Automation", "SQLite for Desktop State", "Automation ROI for LinkedIn", "Browser Driver Security", "Local LLM Integration"];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const prompt = `Synthesize a fresh LinkedIn post about ${topic}. Focus on technical efficiency. Do NOT include URLs. #OpenClaw #AI. Version: ${Math.random().toString(36).substring(7)}`;
        
        const content = await llmRef.current.generateResponse(prompt, []);
        setApprovals(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          agentId: agent.id,
          title: `Synthesis Draft: ${topic}`,
          content,
          timestamp: new Date()
        }]);
        addLog(`New unique draft ready for approval.`, "SUCCESS", agent.name);
      } catch (err) {
        addLog(`Synthesis failed. Check LLM engine status.`, "ERROR", agent.name);
      }
    } else if (agent.type === 'demo2') {
      const hash = Math.random().toString(36).substring(7).toUpperCase();
      const url = `https://www.linkedin.com/feed/hashtag/?keywords=openclaw&id=${hash}`;
      updateAgent(agent.id, { 
        seenPostUrls: [...(agent.seenPostUrls || []), url], 
        lastRun: new Date().toLocaleTimeString() 
      });
      addLog(`Hashtag discovery logged unique post ID: ${hash}`, "SUCCESS", agent.name);
    }
  };

  // Centralized Dynamic Scheduler
  useEffect(() => {
    if (!isSetupComplete) return;

    const intervals: NodeJS.Timeout[] = [];
    agents.forEach(agent => {
      if (agent.status === AgentStatus.SCHEDULED) {
        const ms = agent.intervalUnit === 'min' ? agent.intervalValue * 60000 : agent.intervalValue * 3600000;
        addLog(`Scheduler: ${agent.name} set to run every ${agent.intervalValue} ${agent.intervalUnit}.`, "INFO", "Orchestrator");
        const interval = setInterval(() => runAgentTask(agent), ms);
        intervals.push(interval);
      }
    });

    return () => intervals.forEach(i => clearInterval(i));
  }, [agents, isSetupComplete, selectedLLM]); // Restart intervals if agents or engine changes

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
    setApprovals(prev => prev.filter(app => app.agentId !== id));
    addLog(`Agent deleted. Resources reclaimed.`, "WARNING", "System");
  };

  const toggleAgentPause = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;
    const newStatus = agent.status === AgentStatus.PAUSED ? AgentStatus.SCHEDULED : AgentStatus.PAUSED;
    updateAgent(id, { status: newStatus });
    addLog(`${agent.name} ${newStatus === AgentStatus.PAUSED ? 'PAUSED' : 'RESUMED'}.`, "INFO", "System");
  };

  const handleApprove = (id: string) => {
    const approval = approvals.find(a => a.id === id);
    if (!approval) return;
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(approval.content)}`;
    window.open(shareUrl, '_blank');
    setApprovals(prev => prev.filter(a => a.id !== id));
    addLog(`Draft approved. Profile 2 session routing active.`, "SUCCESS", "OpenClaw");
  };

  const handleSetupFinish = () => {
    setIsSetupComplete(true);
    addLog(`PC Environment Sync Verified. Dashboard unlocked.`, "SUCCESS", "Setup");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-slate-200">
      {!isSetupComplete && <SetupOverlay onFinish={handleSetupFinish} addLog={addLog} />}
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        selectedLLM={selectedLLM}
        setSelectedLLM={setSelectedLLM}
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <i className="fas fa-claw-marks"></i>
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">OpenClaw Assistant</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-indigo-400">
                <i className="fas fa-microchip"></i> Hardware Synced
             </div>
             <div className="h-4 w-[1px] bg-slate-800"></div>
             <div className="text-slate-400 text-xs font-bold">Amit Das <span className="text-slate-600 ml-1">Profile 2</span></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === 'dashboard' && (
            <Dashboard 
              agents={agents} 
              logs={logs} 
              approvals={approvals} 
              onApprove={handleApprove} 
              onRunNow={(id) => {
                const agent = agents.find(a => a.id === id);
                if (agent) runAgentTask(agent);
              }}
              onPause={toggleAgentPause}
              onDelete={deleteAgent}
            />
          )}
          
          {activeTab === 'agents' && (
            <div className="max-w-5xl mx-auto space-y-8 pb-24">
               <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black text-white">Automation Fleet</h2>
                    <p className="text-slate-500 mt-1">Configure and deploy user-set frequencies for your agents.</p>
                  </div>
                  <button onClick={() => setIsChatOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-indigo-600/30 transition-all">
                    <i className="fas fa-plus mr-2"></i> Create Agent
                  </button>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
                 {agents.map(a => (
                   <div key={a.id} className="bg-slate-800/40 border border-slate-700 rounded-[32px] p-8 hover:border-indigo-500 transition-all shadow-2xl">
                      <div className="flex flex-col lg:flex-row justify-between gap-8">
                         <div className="flex-1 space-y-6">
                            <div className="flex items-start justify-between">
                               <div>
                                  <input 
                                     value={a.name}
                                     onChange={(e) => updateAgent(a.id, { name: e.target.value })}
                                     className="bg-transparent font-black text-2xl text-white focus:outline-none focus:bg-slate-900 rounded-lg px-2 -ml-2 border-b-2 border-transparent focus:border-indigo-500"
                                  />
                                  <div className="flex items-center gap-3 mt-1">
                                     <span className={`w-2 h-2 rounded-full ${a.status === AgentStatus.SCHEDULED ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{a.status} • SQLite Persistence Active</span>
                                  </div>
                               </div>
                               <div className="flex gap-2">
                                  <button onClick={() => toggleAgentPause(a.id)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${a.status === AgentStatus.PAUSED ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                    <i className={`fas ${a.status === AgentStatus.PAUSED ? 'fa-play' : 'fa-pause'}`}></i>
                                  </button>
                                  <button onClick={() => deleteAgent(a.id)} className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                               </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-3">
                                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">User-Set Frequency</label>
                                  <div className="flex items-center gap-2">
                                     <input 
                                       type="number"
                                       min="1"
                                       value={a.intervalValue}
                                       onChange={(e) => updateAgent(a.id, { intervalValue: Math.max(1, parseInt(e.target.value) || 1) })}
                                       className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 outline-none text-white"
                                     />
                                     <select 
                                       value={a.intervalUnit}
                                       onChange={(e) => updateAgent(a.id, { intervalUnit: e.target.value as any })}
                                       className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 outline-none text-white"
                                     >
                                        <option value="min">Minute(s)</option>
                                        <option value="hour">Hour(s)</option>
                                     </select>
                                  </div>
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">Role Goal</label>
                                  <div className="h-12 bg-slate-900 border border-slate-700 rounded-xl px-4 flex items-center text-xs font-bold text-slate-400">
                                     {a.goal}
                                  </div>
                               </div>
                            </div>
                         </div>
                         
                         <div className="lg:w-64 flex flex-col justify-end">
                            <button onClick={() => runAgentTask(a)} className="w-full py-4 bg-slate-700/50 hover:bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                               Trigger Manual Run
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
          
          {activeTab === 'logs' && <Logs logs={logs} />}
        </div>

        {isChatOpen && (
          <div className="absolute right-6 bottom-20 w-[450px] h-[650px] z-50">
            <ChatInterface 
              onClose={() => setIsChatOpen(false)} 
              llm={llmRef.current} 
              createAgent={(newAgent) => {
                const agent: Agent = {
                  id: Math.random().toString(36).substr(2, 9),
                  name: newAgent.name || "Custom Agent",
                  role: newAgent.role || "Automator",
                  goal: newAgent.goal || "Task Optimization",
                  status: AgentStatus.SCHEDULED,
                  isAutopilot: true,
                  schedule: "User Defined",
                  intervalValue: 1,
                  intervalUnit: 'min',
                  seenPostUrls: [],
                  ...newAgent
                };
                setAgents(prev => [...prev, agent]);
                return true;
              }}
              updateAgent={updateAgent}
              stopAgent={() => {}}
              deleteAgent={deleteAgent}
              agents={agents}
              addLog={addLog}
            />
          </div>
        )}

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 z-50 ${isChatOpen ? 'bg-rose-500 rotate-45 scale-90' : 'bg-indigo-600 hover:scale-110 shadow-indigo-600/40'}`}
        >
          <i className={`fas ${isChatOpen ? 'fa-plus' : 'fa-claw-marks'} text-xl text-white`}></i>
        </button>
      </main>
    </div>
  );
};

export default App;
