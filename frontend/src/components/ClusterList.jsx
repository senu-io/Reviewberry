import React, { useState } from 'react';
import {
  AlertCircle,
  Quote,
  MessageCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldAlert,
  Send
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
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
  };

  if (!clusters || clusters.length === 0) {
    return (
      <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 text-center text-slate-400">
        No complaint clusters identified yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔍 Recurring Complaint Clusters</span>
            <span className="text-xs font-normal text-slate-400">({clusters.length} root causes grouped)</span>
          </h3>
          <p className="text-xs text-slate-400">
            AMD Token Factory semantically connects differently worded feedback to uncover underlying systemic failure points.
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {clusters.map((cluster) => {
          const isExpanded = expandedCluster === cluster.id;

          return (
            <div
              key={cluster.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900/90 border-slate-700 shadow-lg'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              {/* Header Row */}
              <div
                className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`mt-0.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${getSeverityStyle(cluster.severity)}`}>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{cluster.severity}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-sm sm:text-base text-white hover:text-berry-400 transition-colors">
                        {cluster.title}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {cluster.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 sm:line-clamp-none">
                      {cluster.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 self-end sm:self-center flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-200">
                      {cluster.frequency} mentions
                    </div>
                    <div className="text-[11px] text-berry-400 font-medium">
                      {cluster.percentage}% of reviews
                    </div>
                  </div>

                  <button
                    className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-4">
                  
                  {/* Channels & Impact */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-medium">Affected Channels:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {cluster.affected_channels?.map((ch, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 text-[11px]">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 text-rose-400 font-medium text-xs">
                      <span>Customer Churn Risk:</span>
                      <span className="font-bold underline">{cluster.estimated_churn_risk}</span>
                    </div>
                  </div>

                  {/* Verbatim Supporting Customer Quotes */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                      <Quote className="w-3.5 h-3.5 text-berry-400" />
                      <span>Direct Supporting Customer Evidence</span>
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {cluster.supporting_quotes?.map((quoteItem, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs flex flex-col justify-between"
                        >
                          <p className="text-slate-300 italic mb-2">
                            "{quoteItem.quote}"
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                            <span className="font-medium text-slate-400">
                              {quoteItem.author} • <span className="text-berry-400/90">{quoteItem.source}</span>
                            </span>
                            <button
                              onClick={() => onOpenCustomerReply(cluster, quoteItem)}
                              className="text-[11px] text-berry-400 hover:text-berry-300 font-semibold flex items-center gap-1 hover:underline"
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
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onOpenStaffMemo(cluster)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Generate Staff SOP Briefing Memo</span>
                      </button>

                      <button
                        onClick={() => onOpenCustomerReply(cluster, cluster.supporting_quotes?.[0])}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Public Review Reply Generator</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onSelectTaskForCluster(cluster.id)}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-berry-400 hover:text-berry-300 transition-colors"
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
