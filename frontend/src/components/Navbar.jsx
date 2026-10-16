import React from 'react';
import { Cpu, Sparkles, RefreshCw, Layers, CheckSquare, MessageSquare } from 'lucide-react';

export default function Navbar({ amdStatus, onRefresh, activeTab, setActiveTab }) {
  const isOnline = amdStatus?.status === 'online' || amdStatus?.status === 'simulation_ready';
  const modelName = amdStatus?.model || 'DeepSeek-V4-Flash';

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="relative">
            <img src="/assets/logo_128.png" alt="Reviewberry Logo" className="w-9 h-9 object-contain drop-shadow" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-berry-500 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">
                Review<span className="text-berry-500">berry</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-berry-500/10 text-berry-400 border border-berry-500/20 rounded-full">
                Track 3: Reinvent Commerce
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Customer complaints become business tasks</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-berry-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Operational Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'kanban'
                ? 'bg-berry-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Staff Action Board</span>
          </button>
        </div>

        {/* AMD Hardware Status Pill */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-red-500" />
                <span className="text-red-400 font-bold">AMD</span> Radeon Cloud
              </span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] text-slate-400 font-mono hidden lg:inline">
              {modelName}
            </span>
          </div>

          <button
            onClick={onRefresh}
            title="Refresh status"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
