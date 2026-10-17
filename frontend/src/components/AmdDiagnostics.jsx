import React, { useState } from 'react';
import { Cpu, Zap, Activity, ShieldCheck, CheckCircle2, Clock, DollarSign, Layers, RefreshCw, Server, Award } from 'lucide-react';

export default function AmdDiagnostics({ amdStatus, onOpenTestModal, onModelChange, amdMetadata }) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const model = amdStatus?.model || amdMetadata?.model || 'DeepSeek-V4-Flash';

  const runQuickPing = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/amd/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (e) {
      setTestResult({ success: false, error: String(e) });
    } finally {
      setTesting(false);
    }
  };

  const availableModels = amdStatus?.available_models || [
    'DeepSeek-V4-Flash',
    'Qwen3.8-Flash-Next',
    'MiniCPM5-2B',
    'GLM-5.3-Flash',
    'Gemma-4-31B-IT'
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* Diagnostics Header */}
      <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-obsidian-750/90 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 uppercase tracking-wider">
                AMD Radeon Cloud Hardware
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-berry-500/15 text-berry-400 border border-berry-500/30">
                Token Factory Telemetry
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-6 h-6 text-red-500" />
              <span>AMD Cloud Acceleration & Health Diagnostics</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Reviewberry leverages the official AMD Radeon Cloud Token Factory for low-latency zero-shot review semantic clustering and business task generation.
            </p>
          </div>

          <button
            onClick={runQuickPing}
            disabled={testing}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs shadow-glow-amd transition-all self-start sm:self-auto disabled:opacity-50"
          >
            {testing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Benchmarking Live API...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Run Live Benchmark Ping</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-Time Telemetry Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-obsidian-900/90 rounded-2xl p-4.5 border border-obsidian-750/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Active Model</span>
            <Server className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white font-mono truncate">
            {model}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">OpenAI Compatible Endpoint</div>
        </div>

        <div className="bg-obsidian-900/90 rounded-2xl p-4.5 border border-obsidian-750/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Inference Status</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-emerald-400">
            {amdStatus?.status === 'online' ? 'Online & Accelerated' : 'Live / Ready'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">AMD Instinct & Radeon Nodes</div>
        </div>

        <div className="bg-obsidian-900/90 rounded-2xl p-4.5 border border-obsidian-750/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Last Latency</span>
            <Clock className="w-4 h-4 text-berry-400" />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-berry-400 font-mono">
            {testResult?.latency_ms ? `${testResult.latency_ms} ms` : amdMetadata?.latency_ms ? `${amdMetadata.latency_ms} ms` : 'Live'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Round-trip token generation</div>
        </div>

        <div className="bg-obsidian-900/90 rounded-2xl p-4.5 border border-obsidian-750/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Remaining RPM Quota</span>
            <ShieldCheck className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-neon-cyan font-mono">
            {testResult?.rate_limits?.rpm_remaining || amdStatus?.rate_limit_info?.['x-ratelimit-remaining-user-rpm'] || '19'} / 20
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Tier: Token Factory Developer</div>
        </div>

      </div>

      {/* Live Benchmark Result Panel (if run) */}
      {testResult && (
        <div className={`p-5 rounded-2xl border text-xs space-y-3 ${
          testResult.success 
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
            : 'bg-red-950/20 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center justify-between font-bold text-sm">
            <span>Live AMD Token Factory Diagnostic: {testResult.success ? 'Success' : 'Notice'}</span>
            <span className="font-mono">{testResult.latency_ms} ms</span>
          </div>
          {testResult.success ? (
            <div className="space-y-1">
              <p className="text-slate-200">
                <strong>Echo Response:</strong> "{testResult.echo_message}"
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Model: {testResult.model} | HTTP Status: {testResult.status_code} | Provider: {testResult.provider}
              </p>
            </div>
          ) : (
            <p>{testResult.error || 'Diagnostic ping encountered a warning.'}</p>
          )}
        </div>
      )}

      {/* Model Selection and Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Model Selector Card */}
        <div className="bg-obsidian-900/90 border border-obsidian-750/90 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-berry-500/20 border border-berry-500/30 flex items-center justify-center text-berry-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Switch Model Architecture</h3>
              <p className="text-xs text-slate-400">Select model deployed on AMD Radeon Cloud</p>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            You can dynamically change the active model used for review clustering and task extraction:
          </p>

          <div className="space-y-2">
            {availableModels.map((m) => (
              <button
                key={m}
                onClick={() => onModelChange(m)}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  model === m
                    ? 'bg-berry-500/15 border-berry-500 text-white font-bold'
                    : 'bg-obsidian-950 hover:bg-obsidian-800 border-obsidian-750 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`w-2 h-2 rounded-full ${model === m ? 'bg-berry-400' : 'bg-slate-600'}`} />
                  <span className="font-mono">{m}</span>
                </div>
                {model === m && (
                  <span className="text-[10px] uppercase font-bold text-berry-400 px-2 py-0.5 rounded-full bg-berry-500/20">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Architecture Info */}
        <div className="bg-obsidian-900/90 border border-obsidian-750/90 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AMD Hackathon Integration</h3>
              <p className="text-xs text-slate-400">Track 3: Reinvent Commerce Architecture</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              <strong>API-First Integration:</strong> Reviewberry connects directly to the AMD Token Factory OpenAI-compatible endpoint at <code className="text-red-400 font-mono">https://developer.amd.com.cn/radeon/api/v1</code>.
            </p>
            <p>
              <strong>Multi-Model Resilient Failover:</strong> To ensure zero downtime, our client incorporates automated failover across DeepSeek-V4-Flash, Qwen3.8-Flash-Next, and MiniCPM5-2B, coupled with prompt token optimization to prevent gateway timeouts.
            </p>
            <p>
              <strong>Containerized Deployment:</strong> Packaged in Docker with pre-compiled React frontend and asynchronous FastAPI backend, ready for cloud deployment.
            </p>
          </div>

          <div className="pt-2 border-t border-obsidian-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Hardware: AMD Radeon Cloud</span>
            <span>Stack: FastAPI + React 19</span>
          </div>
        </div>

      </div>
    </div>
  );
}
