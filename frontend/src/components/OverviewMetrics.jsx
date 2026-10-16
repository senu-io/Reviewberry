import React from 'react';
import { MessageSquareWarning, TrendingDown, Target, CheckCircle, AlertTriangle } from 'lucide-react';

export default function OverviewMetrics({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Reviews Analyzed</span>
            <MessageSquareWarning className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {data.total_reviews_analyzed}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Multi-channel aggregated</div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Negative Sentiment</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">
            {data.negative_sentiment_pct}%
          </div>
          <div className="text-[11px] text-rose-500/80 mt-1">Requiring operational triage</div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Systemic Root Causes</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">
            {data.recurring_complaints_count}
          </div>
          <div className="text-[11px] text-amber-500/80 mt-1">Distinct complaint clusters</div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Staff Tasks Created</span>
            <Target className="w-4 h-4 text-berry-500" />
          </div>
          <div className="text-2xl font-bold text-berry-400 tracking-tight">
            {data.tasks?.length || 0}
          </div>
          <div className="text-[11px] text-berry-500/80 mt-1">Assigned with SOP checklists</div>
        </div>

      </div>

      {/* AI Key Findings Box */}
      <div className="bg-berry-950/20 border border-berry-500/30 rounded-xl p-4 flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-lg bg-berry-600/20 border border-berry-500/30 flex items-center justify-center flex-shrink-0 text-berry-400 mt-0.5">
          <CheckCircle className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-berry-400">
            AI Operations Synthesis
          </span>
          <p className="text-sm text-slate-200 mt-0.5 leading-relaxed">
            {data.key_findings_summary}
          </p>
        </div>
      </div>
    </div>
  );
}
