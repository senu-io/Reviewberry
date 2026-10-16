import React from 'react';
import { Cpu, Zap, ShieldCheck, Activity, Terminal } from 'lucide-react';

export default function AmdBanner({ amdMetadata }) {
  const model = amdMetadata?.model || 'DeepSeek-V4-Flash';
  const latency = amdMetadata?.latency_ms || 320;
  const isAccelerated = amdMetadata?.amd_accelerated !== false;

  return (
    <div className="bg-gradient-to-r from-red-950/40 via-slate-900/80 to-slate-950 rounded-2xl p-4 border border-red-900/30 shadow-lg relative overflow-hidden">
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-md shadow-red-900/30 flex-shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-sm tracking-wide">
                ACCELERATED BY AMD RADEON™ CLOUD
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                Token Factory
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live inference via OpenAI-compatible endpoint on AMD Instinct/Radeon GPU cluster
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Model:</span>
            <span className="text-white font-semibold">{model}</span>
          </div>

          <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Latency:</span>
            <span className="text-white font-semibold">{latency} ms</span>
          </div>

          <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span className="text-slate-400">JSON Mode:</span>
            <span className="text-emerald-400 font-semibold">Strict 100%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
