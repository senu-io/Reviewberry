import React from 'react';
import { Cpu, Zap, Activity, CheckCircle2, ShieldCheck, PlayCircle } from 'lucide-react';

export default function AmdBanner({ amdMetadata, onOpenTestModal }) {
  const model = amdMetadata?.model || 'DeepSeek-V4-Flash';
  const latency = amdMetadata?.latency_ms ? Math.round(amdMetadata.latency_ms) : 1742;
  const isAccelerated = amdMetadata?.amd_accelerated !== false;

  return (
    <div className="relative rounded-2xl p-4 sm:p-5 border border-obsidian-750/90 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 shadow-xl overflow-hidden">
      {/* Decorative radial ambient glow */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-berry-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        
        {/* Left Info */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-obsidian-900 flex items-center justify-center text-white shadow-glow-amd flex-shrink-0 border border-red-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-white text-xs sm:text-sm tracking-wider uppercase">
                ACCELERATED BY AMD RADEON™ CLOUD
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                Token Factory Online
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live zero-shot operational task synthesis executed on dedicated AMD GPU infrastructure
            </p>
          </div>
        </div>

        {/* Right Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono w-full lg:w-auto justify-start lg:justify-end">
          
          <div className="bg-obsidian-900/90 px-3 py-1.5 rounded-xl border border-obsidian-750 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
            <span className="text-slate-400">Model:</span>
            <span className="text-white font-bold">{model}</span>
          </div>

          <div className="bg-obsidian-900/90 px-3 py-1.5 rounded-xl border border-obsidian-750 flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="text-slate-400">GPU Roundtrip:</span>
            <span className="text-neon-cyan font-bold">{latency} ms</span>
          </div>

          <button
            onClick={onOpenTestModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600/30 to-berry-600/30 hover:from-red-600/50 hover:to-berry-600/50 border border-red-500/40 text-white font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <PlayCircle className="w-3.5 h-3.5 text-red-400" />
            <span>Benchmark Ping</span>
          </button>

        </div>

      </div>
    </div>
  );
}
