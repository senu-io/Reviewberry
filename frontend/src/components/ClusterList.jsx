import React, { useState } from 'react';
import {
  Quote,
  MessageCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldAlert,
  Send,
  Sparkles
} from 'lucide-react';

export default function ClusterList({
  clusters,
  onOpenCustomerReply,
  onOpenStaffMemo,
  onSelectTaskForCluster
}) {
  const [expandedCluster, setExpandedCluster] = useState(clusters?.[0]?.id || null);

  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'medium':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30';
    }
  };

  if (!clusters || clusters.length === 0) {
    return (
      <div className="bg-obsidian-900/60 rounded-2xl p-8 border border-obsidian-750 text-center text-slate-400">
        No complaint clusters identified yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>Recurring Complaint Clusters</span>
            <span className="text-xs font-semibold text-berry-400 bg-berry-500/15 px-2 py-0.5 rounded-full border border-berry-500/25">
              {clusters.length} root causes grouped
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            AMD Token Factory semantically links differently phrased reviews to uncover underlying operational failure points.
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {clusters.map((cluster) => {
          const isExpanded = expandedCluster === cluster.id;

          return (
            <div
              key={cluster.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-obsidian-900/95 border-obsidian-700 shadow-xl'
                  : 'bg-obsidian-900/60 border-obsidian-800 hover:border-obsidian-700'
              }`}
            >
              {/* Header Row */}
              <div
                className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`mt-0.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider border flex items-center gap-1.5 ${getSeverityStyle(cluster.severity)}`}>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{cluster.severity}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-white hover:text-berry-400 transition-colors">
                        {cluster.title}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-obsidian-950 text-slate-400 font-mono border border-obsidian-800">
                        {cluster.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 sm:line-clamp-none leading-relaxed">
                      {cluster.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 self-end sm:self-center flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-200">
                      {cluster.frequency} mentions
                    </div>
                    <div className="text-[11px] text-berry-400 font-bold">
                      {cluster.percentage}% of reviews
                    </div>
                  </div>

                  <button
                    className="p-1.5 rounded-lg bg-obsidian-800 text-slate-400 hover:text-white transition-colors"
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-obsidian-800 bg-obsidian-950/60 space-y-4">
                  
                  {/* Channels & Churn Risk */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-medium">Affected Channels:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {cluster.affected_channels?.map((ch, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-obsidian-850 text-slate-300 text-[11px] border border-obsidian-750">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 text-berry-400 font-semibold text-xs">
                      <span>Customer Churn Risk:</span>
                      <span className="font-bold underline">{cluster.estimated_churn_risk}</span>
                    </div>
                  </div>

                  {/* Verbatim Supporting Customer Quotes */}
                  <div>
                    <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                      <Quote className="w-3.5 h-3.5 text-berry-400" />
                      <span>Direct Supporting Customer Evidence</span>
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {cluster.supporting_quotes?.map((quoteItem, idx) => (
                        <div
                          key={idx}
                          className="bg-obsidian-900/90 p-3.5 rounded-xl border border-obsidian-750/80 text-xs flex flex-col justify-between"
                        >
                          <p className="text-slate-200 italic mb-2 leading-relaxed">
                            "{quoteItem.quote}"
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-obsidian-800">
                            <span className="font-semibold text-slate-300">
                              {quoteItem.author} • <span className="text-berry-400">{quoteItem.source}</span>
                            </span>
                            <button
                              onClick={() => onOpenCustomerReply(cluster, quoteItem)}
                              className="text-[11px] text-berry-400 hover:text-berry-300 font-bold flex items-center gap-1 hover:underline"
                            >
                              <Send className="w-2.5 h-2.5" />
                              <span>Draft Apology</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-obsidian-800">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onOpenStaffMemo(cluster)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-obsidian-800 hover:bg-obsidian-750 text-slate-200 border border-obsidian-700 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Generate Staff SOP Briefing Memo</span>
                      </button>

                      <button
                        onClick={() => onOpenCustomerReply(cluster, cluster.supporting_quotes?.[0])}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-obsidian-800 hover:bg-obsidian-750 text-slate-200 border border-obsidian-700 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-neon-cyan" />
                        <span>Public Review Reply Copilot</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onSelectTaskForCluster(cluster.id)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-berry-400 hover:text-berry-300 transition-colors"
                    >
                      <span>Jump to Assigned Staff Task</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
