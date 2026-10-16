import React, { useState } from 'react';
import { X, Send, Copy, Check, Sparkles, MessageCircle } from 'lucide-react';

export default function CustomerReplyModal({ isOpen, onClose, cluster, quoteItem, businessName }) {
  if (!isOpen) return null;

  const [tone, setTone] = useState('empathetic_professional');
  const [customerName, setCustomerName] = useState(quoteItem?.author || 'Valued Customer');
  const [actionOverride, setActionOverride] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [replyData, setReplyData] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customer-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName || 'Our Business',
          cluster_title: cluster?.title || 'Operational Issue',
          customer_quote: quoteItem?.quote || 'Dissatisfied with recent service.',
          customer_name: customerName,
          tone: tone,
          action_taken: actionOverride || undefined
        })
      });
      const data = await res.json();
      setReplyData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (replyData?.reply_text) {
      navigator.clipboard.writeText(replyData.reply_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-berry-600/20 text-berry-400 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Public Review Recovery Copilot</h3>
              <p className="text-xs text-slate-400">
                Powered by AMD Token Factory • Responds by citing concrete operational fixes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 my-4 text-xs">
          {/* Quote context */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Customer Complaint Quote
            </span>
            <p className="text-slate-200 italic font-medium">
              "{quoteItem?.quote || 'Review text unavailable'}"
            </p>
            <span className="text-[11px] text-berry-400 mt-1 block">
              Issue Category: {cluster?.title}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Customer / Reviewer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-berry-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Response Tone</label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-berry-500"
              >
                <option value="empathetic_professional">Empathetic & Professional (Recommended)</option>
                <option value="warm_hospitable">Warm & Hospitable</option>
                <option value="direct_executive">Direct Executive Action</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Custom Operational Action Highlight (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Switched to thermal packaging & added 2-point kitchen ticket verification"
              value={actionOverride}
              onChange={e => setActionOverride(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-berry-500 placeholder:text-slate-600"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-berry-600 hover:bg-berry-500 font-semibold text-white transition-colors flex items-center justify-center space-x-2 shadow-md shadow-berry-950/40"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Synthesizing with AMD Radeon Cloud...' : (replyData ? 'Regenerate Reply' : 'Generate Recovery Reply')}</span>
          </button>

          {/* Generated Reply */}
          {replyData && (
            <div className="mt-4 space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <span>✓ Tailored Recovery Message</span>
                </span>

                <button
                  onClick={copyToClipboard}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Reply'}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={6}
                value={replyData.reply_text}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs font-sans leading-relaxed focus:outline-none"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Action highlighted: <strong className="text-white">{replyData.action_highlight}</strong></span>
                {replyData.coupon_or_offer_suggested && (
                  <span className="text-amber-400">{replyData.coupon_or_offer_suggested}</span>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
