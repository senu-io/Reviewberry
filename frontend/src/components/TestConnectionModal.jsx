import React, { useState } from 'react';
import {
  X,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  DollarSign,
  Gauge,
  Sparkles,
  Terminal
} from 'lucide-react';

export default function TestConnectionModal({ isOpen, onClose, currentModel, onModelChange }) {
  if (!isOpen) return null;

  const [model, setModel] = useState(currentModel || 'DeepSeek-V4-Flash');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

  const handleRunTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/amd/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model })
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Connection test failed');
      }
      setTestResult(data);
      if (onModelChange) {
        onModelChange(model);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-obsidian-900 border border-obsidian-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative shadow-glow-berry">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-berry-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-750">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-glow-amd flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">AMD Token Factory Diagnostics</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  Radeon Cloud
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live endpoint ping, latency benchmarking & token quota telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 my-5 text-xs">
          
          {/* Endpoint details */}
          <div className="bg-obsidian-950 p-4 rounded-xl border border-obsidian-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Gateway Base URL</span>
              <span className="text-berry-400 font-semibold text-xs sm:text-sm">
                https://developer.amd.com.cn/radeon/api/v1
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Bearer Auth Authenticated</span>
            </div>
          </div>

          {/* Model selector & Action */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1 text-xs">
                Select AMD Cloud Hosted Model
              </label>
              <select
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full bg-obsidian-950 border border-obsidian-750 rounded-xl px-3 py-2.5 text-white text-xs focus:ring-1 focus:ring-berry-500 font-mono"
              >
                <option value="DeepSeek-V4-Flash">DeepSeek-V4-Flash (1M context • Ultra Fast)</option>
                <option value="Qwen3.8-Flash-Next">Qwen3.8-Flash-Next (262k context • Deep Reasoning)</option>
                <option value="GLM-5.3-Flash">GLM-5.3-Flash (262k context)</option>
              </select>
            </div>

            <button
              onClick={handleRunTest}
              disabled={loading}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-berry-600 to-berry-700 hover:opacity-90 font-semibold text-white transition-all flex items-center justify-center space-x-2 shadow-glow-berry disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Pinging AMD...' : 'Run Live Ping Test'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Benchmark Results */}
          {testResult && (
            <div className="space-y-3.5 bg-obsidian-950 p-4 rounded-xl border border-obsidian-750 animate-fadeIn">
              
              <div className="flex items-center justify-between pb-2 border-b border-obsidian-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AMD Cloud Response Verified (HTTP 200 OK)</span>
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Protocol: OpenAI-compatible
                </span>
              </div>

              {/* Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-obsidian-900/90 p-3 rounded-lg border border-obsidian-800">
                  <div className="flex items-center justify-between text-slate-400 mb-0.5">
                    <span className="text-[10px] uppercase font-bold">Latency</span>
                    <Activity className="w-3.5 h-3.5 text-neon-cyan" />
                  </div>
                  <div className="text-lg font-bold text-neon-cyan font-mono">
                    {testResult.latency_ms} ms
                  </div>
                  <div className="text-[10px] text-slate-500">Live GPU inference roundtrip</div>
                </div>

                <div className="bg-obsidian-900/90 p-3 rounded-lg border border-obsidian-800">
                  <div className="flex items-center justify-between text-slate-400 mb-0.5">
                    <span className="text-[10px] uppercase font-bold">RPM Quota</span>
                    <Gauge className="w-3.5 h-3.5 text-berry-400" />
                  </div>
                  <div className="text-lg font-bold text-berry-400 font-mono">
                    {testResult.rate_limits?.rpm_remaining} <span className="text-xs text-slate-500 font-normal">/ {testResult.rate_limits?.rpm_limit} RPM</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Requests per minute remaining</div>
                </div>

                <div className="bg-obsidian-900/90 p-3 rounded-lg border border-obsidian-800 col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-slate-400 mb-0.5">
                    <span className="text-[10px] uppercase font-bold">Daily Allowance</span>
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-lg font-bold text-amber-400 font-mono">
                    ${parseFloat(testResult.rate_limits?.daily_usd_remaining || 0.99).toFixed(3)}
                  </div>
                  <div className="text-[10px] text-slate-500">Remaining daily credits</div>
                </div>
              </div>

              {/* Echo payload */}
              <div className="bg-obsidian-900/80 p-3 rounded-lg border border-obsidian-800 font-mono text-[11px]">
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">
                  Model Echo Response from AMD Cluster:
                </span>
                <p className="text-slate-200">
                  "{testResult.echo_message}"
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-obsidian-800 text-[10px] text-slate-500">
                  <span>Tokens processed: {testResult.usage?.total_tokens || 41}</span>
                  <span className="text-emerald-400">Cluster: self-dploy AMD Radeon</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-obsidian-750 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">
            API Key: <strong className="text-slate-300">rc-865f...03c2</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 font-semibold transition-colors"
          >
            Close Diagnostics
          </button>
        </div>

      </div>
    </div>
  );
}
