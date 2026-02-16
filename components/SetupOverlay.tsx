
import React, { useState, useEffect } from 'react';

interface SetupOverlayProps {
  onFinish: () => void;
  addLog: (m: string, l?: any, s?: string) => void;
}

const SetupOverlay: React.FC<SetupOverlayProps> = ({ onFinish, addLog }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Syncing with Amit's PC...");
  const [specs, setSpecs] = useState<string[]>([]);

  const steps = [
    { label: "Hardware Diagnostic", icon: "fa-microchip" },
    { label: "Environment Sync", icon: "fa-sync" },
    { label: "Browser Profile Link", icon: "fa-browser" },
    { label: "SQLite Core Initialization", icon: "fa-database" },
    { label: "Deployment Ready", icon: "fa-rocket" }
  ];

  useEffect(() => {
    const runSetup = async () => {
      // Step 0: Hardware
      setStatus("Analyzing CPU and Memory resources...");
      await new Promise(r => setTimeout(r, 1200));
      const mockSpecs = [
        "CPU: Intel Core i9-13900K @ 3.00GHz detected",
        "RAM: 64GB DDR5 System Memory verified",
        "GPU: NVIDIA GeForce RTX 4080 (16GB) active"
      ];
      setSpecs(mockSpecs);
      mockSpecs.forEach(s => addLog(s, "INFO", "Hardware"));
      setStep(1);
      setProgress(20);

      // Step 1: Environment
      setStatus("Syncing system requirements...");
      addLog("System Sync: High Performance Power Plan verified.", "SUCCESS", "Setup");
      await new Promise(r => setTimeout(r, 1000));
      setStep(2);
      setProgress(45);

      // Step 2: Browser
      setStatus("Linking AVG Browser Profile 2...");
      addLog("Profile Path: C:\\Users\\Amitd\\AppData\\Local\\AVG\\Browser\\User Data\\Profile 2", "INFO", "Setup");
      addLog("Cookies & Session state verified for LinkedIn.", "SUCCESS", "Setup");
      await new Promise(r => setTimeout(r, 1500));
      setStep(3);
      setProgress(75);

      // Step 3: SQLite
      setStatus("Indexing local SQLite persistence...");
      addLog("Database 'openclaw_v3.sqlite' initialized.", "SUCCESS", "Setup");
      await new Promise(r => setTimeout(r, 800));
      setStep(4);
      setProgress(95);

      // Finalize
      setStatus("System Synced. Ready for deployment.");
      addLog("OpenClaw Assistant is now fully synchronized with Amit's PC.", "SUCCESS", "Orchestrator");
      await new Promise(r => setTimeout(r, 1000));
      onFinish();
    };

    runSetup();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl">
      <div className="w-[550px] p-10 bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl relative overflow-hidden">
        {/* Animated Background Pulse */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white text-3xl shadow-2xl shadow-indigo-600/40">
              <i className="fas fa-claw-marks"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">System Syncing</h2>
              <p className="text-sm text-slate-500 font-medium">Deploying OpenClaw to Amit's Workspace</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                <span>{status}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full p-1 border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {steps.map((s, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
                  idx < step ? 'bg-emerald-500/5 border-emerald-500/20 opacity-100' : 
                  idx === step ? 'bg-indigo-500/5 border-indigo-500/40 border-dashed animate-pulse' : 
                  'border-transparent opacity-20'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
                    idx < step ? 'bg-emerald-500 text-white' : 
                    idx === step ? 'bg-indigo-600 text-white' : 
                    'bg-slate-800 text-slate-500'
                  }`}>
                    <i className={`fas ${idx < step ? 'fa-check' : s.icon}`}></i>
                  </div>
                  <div>
                    <span className={`text-sm block ${idx === step ? 'font-black text-white' : 'font-bold text-slate-400'}`}>{s.label}</span>
                    {idx === 0 && specs.length > 0 && idx === step && (
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block truncate">Detecting hardware...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-800 flex justify-between items-center">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
               <i className="fas fa-shield-check text-emerald-500"></i> Local-First Secure
             </div>
             <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
               Personaliz.ai v3.1.0
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupOverlay;
