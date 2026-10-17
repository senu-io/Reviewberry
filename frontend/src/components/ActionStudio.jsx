import React, { useState } from 'react';
import { Mail, FileText, Send, Sparkles, Check, Copy, ArrowRight, MessageSquare, AlertTriangle, Printer } from 'lucide-react';

export default function ActionStudio({ analysisData, onOpenCustomerReply, onOpenStaffMemo }) {
  const [selectedClusterId, setSelectedClusterId] = useState(
    analysisData?.clusters?.[0]?.id || ''
  );

  const selectedCluster = analysisData?.clusters?.find(c => c.id === selectedClusterId) || analysisData?.clusters?.[0];
  const matchingTask = analysisData?.tasks?.find(t => t.cluster_id === selectedCluster?.id) || analysisData?.tasks?.[0];

  const [copiedType, setCopiedType] = useState(null);

  if (!analysisData || !analysisData.clusters || analysisData.clusters.length === 0) {
    return (
      <div className="bg-obsidian-900/80 border border-obsidian-750/90 rounded-2xl p-10 text-center space-y-3">
        <Sparkles className="w-8 h-8 text-berry-400 mx-auto" />
        <h3 className="text-base font-bold text-white">No Review Data Loaded</h3>
        <p className="text-xs text-slate-400">Please select a scenario or upload customer reviews to use the Resolution Studio.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-obsidian-750/90 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-berry-500/15 text-berry-400 border border-berry-500/30 uppercase tracking-wider">
              Closed-Loop Resolution
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30">
              Operations Studio
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Action Studio: Customer Apology & SOP Mandate Studio
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Reviewberry bridges external feedback and internal accountability. Select an issue cluster below to synthesize an empathetic customer apology response or generate an internal staff briefing memo.
          </p>
        </div>

        {/* Cluster Selector Pills */}
        <div className="mt-5 pt-4 border-t border-obsidian-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2">Target Problem:</span>
          {analysisData.clusters.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClusterId(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                selectedCluster?.id === c.id
                  ? 'bg-gradient-to-r from-berry-600 to-berry-500 text-white shadow-glow-berry'
                  : 'bg-obsidian-950 text-slate-300 hover:text-white border border-obsidian-750'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                c.severity === 'critical' ? 'bg-red-500' : c.severity === 'high' ? 'bg-amber-400' : 'bg-neon-cyan'
              }`} />
              <span>{c.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Resolution Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Customer Apology Generator */}
        <div className="bg-obsidian-900/90 border border-obsidian-750/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-berry-500/20 border border-berry-500/30 flex items-center justify-center text-berry-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Customer Apology & Recovery</h3>
                  <p className="text-xs text-slate-400">Empathetic customer reply with concrete operational fix</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-berry-500/10 text-berry-400 border border-berry-500/20">
                Outbound
              </span>
            </div>

            <div className="bg-obsidian-950 rounded-xl p-3.5 border border-obsidian-800 text-xs space-y-2">
              <div className="font-semibold text-slate-300 flex items-center justify-between">
                <span>Selected Customer Quote:</span>
                <span className="text-[10px] text-slate-500">
                  {selectedCluster?.supporting_quotes?.[0]?.source || 'Deliveroo'}
                </span>
              </div>
              <p className="italic text-slate-400">
                "{selectedCluster?.supporting_quotes?.[0]?.quote || 'Issue reported in customer feedback.'}"
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Instead of generic automated templates, Reviewberry crafts tailored responses citing the exact operational corrective actions underway (such as thermal bag mandates or packaging audits).
            </p>
          </div>

          <button
            onClick={() => onOpenCustomerReply(selectedCluster, selectedCluster?.supporting_quotes?.[0])}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-berry-600 to-berry-500 hover:from-berry-500 hover:to-berry-400 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-glow-berry transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Customer Apology Drafter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Staff SOP Memo Generator */}
        <div className="bg-obsidian-900/90 border border-obsidian-750/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Standard Operating Procedure Memo</h3>
                  <p className="text-xs text-slate-400">Internal briefing mandate for frontline shift crew</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                Internal Ops
              </span>
            </div>

            <div className="bg-obsidian-950 rounded-xl p-3.5 border border-obsidian-800 text-xs space-y-2">
              <div className="font-semibold text-slate-300 flex items-center justify-between">
                <span>Associated Task Directive:</span>
                <span className="text-[10px] text-neon-cyan font-mono">
                  {matchingTask?.priority || 'P1 - Urgent'}
                </span>
              </div>
              <p className="font-bold text-slate-200">
                {matchingTask?.title || 'Operational quality check'}
              </p>
              <div className="text-[11px] text-slate-400">
                Target Role: <strong className="text-white">{matchingTask?.assignee_role || 'Shift Lead'}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Generates a ready-to-print operational briefing document with verbatim customer complaints, root-cause diagnosis, and a sign-off checklist for daily shift meetings.
            </p>
          </div>

          <button
            onClick={() => onOpenStaffMemo(selectedCluster)}
            className="w-full py-2.5 px-4 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-white font-bold text-xs flex items-center justify-center space-x-2 border border-obsidian-700 hover:border-neon-cyan/50 transition-all"
          >
            <Printer className="w-4 h-4 text-neon-cyan" />
            <span>Generate Printable Staff SOP Memo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
