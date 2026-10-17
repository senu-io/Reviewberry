import React from 'react';
import { Cpu, Layers, CheckSquare, Zap, Users, Sparkles } from 'lucide-react';

export default function Navbar({ amdStatus, activeTab, setActiveTab, onOpenTestModal }) {
  const modelName = amdStatus?.model || 'DeepSeek-V4-Flash';

  return (
    <header className="border-b border-obsidian-750/70 bg-obsidian-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Team Badge */}
        <div className="flex items-center space-x-3.5">
          <div
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="relative">
              <img
                src="/assets/logo_128.png"
                alt="Reviewberry"
                className="w-9 h-9 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-berry-500 rounded-full ring-2 ring-obsidian-950 shadow-glow-berry" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Review<span className="text-transparent bg-clip-text bg-gradient-to-r from-berry-400 via-berry-500 to-neon-purple">berry</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-berry-500/10 text-berry-300 border border-berry-500/25 rounded-full shadow-sm">
                  Track 3
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden md:block">
                Complaints become concrete business tasks
              </p>
            </div>
          </div>

          {/* Team Voyagers Tag */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-obsidian-900 border border-obsidian-700/80 text-[11px] text-slate-300 font-medium shadow-inner">
            <Users className="w-3 h-3 text-neon-cyan" />
            <span>Team <strong className="text-white font-bold">Voyagers</strong></span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] text-slate-400">Rome, IT</span>
          </div>
        </div>

        {/* Center: Navigation View Switcher */}
        <div className="flex items-center space-x-1 bg-obsidian-900/90 p-1 rounded-xl border border-obsidian-750/90 shadow-inner">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-berry-600 to-berry-500 text-white shadow-glow-berry'
                : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Operational Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'kanban'
                ? 'bg-gradient-to-r from-berry-600 to-berry-500 text-white shadow-glow-berry'
                : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-800/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Staff Action Board</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-berry-600 to-berry-500 text-white shadow-glow-berry'
                : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resolution Studio</span>
          </button>
        </div>

        {/* Right: AMD Status & Live Connection Tester */}
        <div className="flex items-center space-x-2.5">
          
          {/* Test LLM Connection Button */}
          <button
            onClick={onOpenTestModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-obsidian-900 hover:bg-obsidian-800 text-slate-200 border border-obsidian-700/80 hover:border-berry-500/50 transition-all shadow-sm"
            title="Test real-time connection to AMD Token Factory"
          >
            <Zap className="w-3.5 h-3.5 text-berry-400 animate-pulse" />
            <span className="hidden sm:inline">Test AMD Connection</span>
            <span className="sm:hidden">Test</span>
          </button>

          {/* AMD Hardware Badge */}
          <div
            onClick={onOpenTestModal}
            className="cursor-pointer flex items-center space-x-2 bg-obsidian-950 px-3 py-1.5 rounded-xl border border-obsidian-750 hover:border-red-500/40 text-xs transition-colors"
          >
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-bold text-red-500 tracking-wider text-[11px] flex items-center gap-1">
                <Cpu className="w-3 h-3 text-red-500" />
                <span>AMD</span>
              </span>
            </div>
            <span className="text-obsidian-600">|</span>
            <span className="text-[11px] text-slate-300 font-mono hidden xl:inline">
              {modelName}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
}
