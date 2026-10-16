import React from 'react';
import { MessageSquareWarning, TrendingDown, Target, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function OverviewMetrics({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        <div className="bg-obsidian-900/80 rounded-2xl p-4.5 border border-obsidian-750/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Reviews</span>
            <MessageSquareWarning className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {data.total_reviews_analyzed}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-channel aggregated</div>
        </div>

        <div className="bg-obsidian-900/80 rounded-2xl p-4.5 border border-obsidian-750/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Negative Sentiment</span>
            <TrendingDown className="w-4 h-4 text-berry-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-berry-400 tracking-tight">
            {data.negative_sentiment_pct}%
          </div>
          <div className="text-[11px] text-berry-400/80 mt-1 font-medium">Customer friction detected</div>
        </div>

        <div className="bg-obsidian-900/80 rounded-2xl p-4.5 border border-obsidian-750/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Root Cause Clusters</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
            {data.recurring_complaints_count || data.clusters?.length || 0}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1 font-medium">Grouped systemic themes</div>
        </div>

        <div className="bg-obsidian-900/80 rounded-2xl p-4.5 border border-obsidian-750/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Staff Tasks Created</span>
            <Target className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neon-cyan tracking-tight">
            {data.tasks?.length || 0}
          </div>
          <div className="text-[11px] text-neon-cyan/80 mt-1 font-medium">Assigned with checklists</div>
        </div>

      </div>

      {/* AI Key Findings Box */}
      <div className="bg-gradient-to-r from-berry-950/30 via-obsidian-900 to-obsidian-950 border border-berry-500/30 rounded-2xl p-4.5 flex items-start space-x-3.5 shadow-glow-berry">
        <div className="w-9 h-9 rounded-xl bg-berry-600/20 border border-berry-500/40 flex items-center justify-center flex-shrink-0 text-berry-400 mt-0.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-berry-400 flex items-center gap-1.5">
            <span>AI Operations Synthesis • AMD Radeon™ Cloud</span>
          </span>
          <p className="text-sm text-slate-200 mt-1 leading-relaxed">
            {data.key_findings_summary}
          </p>
        </div>
      </div>
    </div>
  );
}
