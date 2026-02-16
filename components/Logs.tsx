
import React from 'react';
import { LogEntry } from '../types';

interface LogsProps {
  logs: LogEntry[];
}

const Logs: React.FC<LogsProps> = ({ logs }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in slide-in-from-left-5 duration-500">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">System Logs</h2>
            <p className="text-sm text-slate-500">Low-level execution history and CLI wrapper output</p>
          </div>
          <button className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2">
            <i className="fas fa-trash-alt"></i> Clear Logs
          </button>
       </div>

       <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
             <div className="flex gap-6">
                <span>Timestamp</span>
                <span>Source</span>
                <span>Level</span>
                <span>Message</span>
             </div>
             <i className="fas fa-terminal"></i>
          </div>
          <div className="p-4 font-mono text-xs h-[600px] overflow-y-auto space-y-1">
             {logs.map((log) => (
                <div key={log.id} className="grid grid-cols-[100px_100px_80px_1fr] gap-4 py-1 border-b border-slate-900 hover:bg-slate-900 transition-colors group">
                   <span className="text-slate-600">[{log.timestamp}]</span>
                   <span className="text-indigo-400 font-bold">{log.source}</span>
                   <span className={`font-bold ${
                     log.level === 'SUCCESS' ? 'text-emerald-500' : 
                     log.level === 'ERROR' ? 'text-rose-500' : 
                     log.level === 'WARNING' ? 'text-amber-500' : 'text-blue-500'
                   }`}>
                     {log.level}
                   </span>
                   <span className="text-slate-300 group-hover:text-white transition-colors">{log.message}</span>
                </div>
             ))}
             {logs.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-20">
                  <i className="fas fa-ghost text-6xl mb-4"></i>
                  <p className="text-lg font-bold">The void is empty</p>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default Logs;
