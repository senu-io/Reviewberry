import React, { useState } from 'react';
import { Cpu, Layers, CheckSquare, Zap, Users, Sparkles, Sun, Moon, Menu, X, Activity } from 'lucide-react';

export default function Navbar({
  amdStatus,
  activeTab,
  setActiveTab,
  onOpenTestModal,
  theme,
  onToggleTheme,
  clusterCount = 0,
  taskCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const modelName = amdStatus?.model || 'DeepSeek-V4-Flash';

  const navItems = [
    { id: 'dashboard', label: 'Operational Insights', icon: Layers, badge: clusterCount ? `${clusterCount}` : null },
    { id: 'kanban', label: 'Staff Action Board', icon: CheckSquare, badge: taskCount ? `${taskCount}` : null },
    { id: 'studio', label: 'Resolution Studio', icon: Sparkles },
    { id: 'telemetry', label: 'AMD Diagnostics', icon: Activity },
    { id: 'team', label: 'Team Voyagers', icon: Users }
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-obsidian-750/70 bg-obsidian-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Team Tag */}
        <div className="flex items-center space-x-3.5">
          <div
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => handleSelectTab('dashboard')}
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
          <button
            onClick={() => handleSelectTab('team')}
            className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-obsidian-900 border border-obsidian-700/80 text-[11px] text-slate-300 hover:text-white hover:border-berry-500/40 font-medium shadow-inner transition-colors"
            title="View Team Voyagers details"
          >
            <Users className="w-3 h-3 text-neon-cyan" />
            <span>Team <strong className="text-white font-bold">Voyagers</strong></span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] text-slate-400">Rome</span>
          </button>
        </div>

        {/* Center: Desktop Function Switcher Menu */}
        <nav className="hidden md:flex items-center space-x-1 bg-obsidian-900/90 p-1 rounded-xl border border-obsidian-750/90 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-berry-600 to-berry-500 text-white shadow-glow-berry'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-obsidian-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Theme Toggle, AMD Connection, Status */}
        <div className="flex items-center space-x-2">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-800 border border-obsidian-750 text-slate-300 hover:text-white transition-all shadow-sm flex items-center justify-center"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-berry-500 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Test LLM Connection Button */}
          <button
            onClick={onOpenTestModal}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-obsidian-900 hover:bg-obsidian-800 text-slate-200 border border-obsidian-700/80 hover:border-berry-500/50 transition-all shadow-sm"
            title="Test real-time connection to AMD Token Factory"
          >
            <Zap className="w-3.5 h-3.5 text-berry-400 animate-pulse" />
            <span>Test Connection</span>
          </button>

          {/* AMD Hardware Badge */}
          <div
            onClick={onOpenTestModal}
            className="cursor-pointer flex items-center space-x-2 bg-obsidian-950 px-2.5 sm:px-3 py-1.5 rounded-xl border border-obsidian-750 hover:border-red-500/40 text-xs transition-colors"
            title="Click to view AMD Token Factory connection diagnostics"
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
            <span className="text-obsidian-600 hidden sm:inline">|</span>
            <span className="text-[11px] text-slate-300 font-mono hidden xl:inline">
              {modelName}
            </span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-slate-300 hover:text-white"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-obsidian-800 bg-obsidian-950/95 backdrop-blur-xl px-4 py-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-berry-600 to-berry-500 text-white shadow-glow-berry font-bold'
                    : 'text-slate-300 hover:bg-obsidian-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/20 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-obsidian-800 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenTestModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-obsidian-900 text-xs text-slate-300 font-medium flex items-center justify-center space-x-2"
            >
              <Zap className="w-3.5 h-3.5 text-berry-400" />
              <span>Test AMD Token Factory</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
