
import React from 'react';
import { LLMType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  selectedLLM: LLMType;
  setSelectedLLM: (type: LLMType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, selectedLLM, setSelectedLLM }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'agents', label: 'My Agents', icon: 'fa-robot' },
    { id: 'logs', label: 'Logs', icon: 'fa-terminal' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog' }
  ];

  return (
    <aside className="w-64 h-full border-r border-slate-800 bg-slate-900/50 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
             <i className="fas fa-claw-marks text-xl"></i>
           </div>
           <div className="leading-none">
             <h1 className="font-black text-xl tracking-tighter">OPENCLAW</h1>
             <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">Desktop Core</p>
           </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
           <p className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">Active Engine</p>
           <div className="flex flex-col gap-2">
             <button 
               onClick={() => setSelectedLLM(LLMType.EXTERNAL)}
               className={`w-full px-3 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 border transition-all ${selectedLLM === LLMType.EXTERNAL ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-900 text-slate-500 border-slate-700'}`}
             >
               <i className="fas fa-cloud"></i> Gemini 3
             </button>
             <button 
               onClick={() => setSelectedLLM(LLMType.LOCAL)}
               className={`w-full px-3 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 border transition-all ${selectedLLM === LLMType.LOCAL ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-900 text-slate-500 border-slate-700'}`}
             >
               <i className="fas fa-microchip"></i> Ollama Phi-3
             </button>
           </div>
        </div>

        <div className="flex items-center gap-3 px-2">
           <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">AD</div>
           <div className="flex-1 overflow-hidden">
             <p className="text-xs font-bold truncate">Amit's PC</p>
             <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight">Sync Active</p>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
