
import React from 'react';
import { Agent, LogEntry, Approval, AgentStatus } from '../types';

interface DashboardProps {
  agents: Agent[];
  logs: LogEntry[];
  approvals: Approval[];
  onApprove: (id: string) => void;
  onRunNow: (id: string) => void;
  onPause: (id: string) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ agents, logs, approvals, onApprove, onRunNow, onPause, onDelete }) => {
  const stats = [
    { label: "Active Nodes", value: agents.length, icon: "fa-robot", color: "text-indigo-400" },
    { label: "Unique Syncs", value: agents.reduce((acc, a) => acc + (a.seenPostUrls?.length || 0), 0), icon: "fa-binoculars", color: "text-emerald-400" },
    { label: "Pending Approvals", value: approvals.length, icon: "fa-check-circle", color: approvals.length > 0 ? "text-amber-400" : "text-slate-500" },
    { label: "PC Hardware", value: "Verified", icon: "fa-microchip", color: "text-indigo-500" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-white">Command Center</h2>
           <p className="text-sm text-slate-500 mt-1">Environment: AVG Profile 2 • User: Amit Das</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 hover:bg-slate-800/60 transition-all shadow-xl">
             <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{s.label}</span>
               <i className={`fas ${s.icon} ${s.color} text-lg`}></i>
             </div>
             <div className="text-xl font-black text-white truncate">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {approvals.length > 0 && (
             <div className="space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                 <i className="fas fa-exclamation-triangle"></i> Action Required
               </h3>
               {approvals.map(app => (
                 <div key={app.id} className="bg-indigo-600/10 border border-indigo-500/30 rounded-[32px] p-8 space-y-4 animate-in slide-in-from-top-4">
                    <p className="text-lg font-black text-white">{app.title}</p>
                    <p className="text-sm text-slate-300 italic">"{app.content}"</p>
                    <button onClick={() => onApprove(app.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-xl transition-all active:scale-95">
                       CONFIRM & REDIRECT TO LINKEDIN
                    </button>
                 </div>
               ))}
             </div>
           )}

           <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Agent Configuration & Status</h3>
              <div className="bg-slate-800/40 border border-slate-700 rounded-[32px] overflow-hidden">
                 <table className="w-full text-xs text-left">
                   <thead className="text-[10px] font-black uppercase text-slate-500 bg-slate-900/80 border-b border-slate-700">
                     <tr>
                       <th className="px-6 py-4">Agent Name</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Frequency</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700/50">
                     {agents.map(a => (
                       <tr key={a.id} className="hover:bg-slate-700/30 transition-colors group">
                         <td className="px-6 py-4 font-bold text-white">{a.name}</td>
                         <td className="px-6 py-4">
                            <span className={`text-[9px] font-black uppercase ${a.status === AgentStatus.PAUSED ? 'text-amber-500' : 'text-emerald-500'}`}>{a.status}</span>
                         </td>
                         <td className="px-6 py-4 text-slate-400 font-bold uppercase text-[9px]">{a.intervalValue} {a.intervalUnit}</td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => onRunNow(a.id)} className="p-2 hover:text-indigo-400" title="Run Now"><i className="fas fa-play"></i></button>
                               <button onClick={() => onPause(a.id)} className="p-2 hover:text-amber-400" title={a.status === AgentStatus.PAUSED ? 'Resume' : 'Pause'}><i className={`fas ${a.status === AgentStatus.PAUSED ? 'fa-sync' : 'fa-pause'}`}></i></button>
                               <button onClick={() => onDelete(a.id)} className="p-2 hover:text-rose-500" title="Delete"><i className="fas fa-trash"></i></button>
                            </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
             <i className="fas fa-satellite-dish animate-pulse"></i> Live Hashtag Discovery
           </h3>
           <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-6 h-[500px] overflow-y-auto space-y-3 custom-scrollbar">
              {agents.filter(a => a.type === 'demo2').flatMap(a => (a.seenPostUrls || []).map(url => ({ agent: a.name, url }))).reverse().map((item, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-indigo-500 transition-all cursor-pointer" onClick={() => window.open(item.url, '_blank')}>
                   <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500 mb-2">
                      <span>Source: {item.agent}</span>
                      <i className="fas fa-external-link-alt"></i>
                   </div>
                   <div className="text-[10px] font-mono text-indigo-300 break-all">{item.url}</div>
                </div>
              ))}
              {agents.every(a => !a.seenPostUrls?.length) && (
                <div className="flex flex-col items-center justify-center h-full text-slate-800 opacity-40 italic text-center px-10">
                   <i className="fas fa-radar text-4xl mb-4"></i>
                   <p className="text-[10px] font-black uppercase tracking-widest">Scanning Profile 2 for hashtag activity...</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
