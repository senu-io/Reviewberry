import React, { useState, useEffect } from 'react';
import { X, Copy, Check, FileText, Printer } from 'lucide-react';

export default function StaffMemoModal({ isOpen, onClose, cluster, task, businessName }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [memoData, setMemoData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchMemo() {
      if (!cluster && !task) return;
      setLoading(true);
      try {
        const res = await fetch('/api/staff-memo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_name: businessName || 'Reviewberry Store',
            cluster_id: cluster?.id || task?.cluster_id || 'clust-1',
            task_id: task?.id || 'task-1'
          })
        });
        const data = await res.json();
        setMemoData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMemo();
  }, [cluster, task, businessName]);

  const copyToClipboard = () => {
    if (memoData?.markdown_content) {
      navigator.clipboard.writeText(memoData.markdown_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Standard Operating Procedure (SOP) Briefing Memo</h3>
              <p className="text-xs text-slate-400">
                Ready-to-distribute internal staff memo generated from customer complaints
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="my-5">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs animate-pulse">
              Synthesizing internal SOP brief with AMD Radeon Cloud...
            </div>
          ) : memoData ? (
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {memoData.markdown_content}
            </div>
          ) : (
            <div className="text-slate-400 text-center py-8">
              Unable to load memo.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Target Team: <strong className="text-white">{memoData?.target_department || 'Staff'}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium text-slate-300 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
