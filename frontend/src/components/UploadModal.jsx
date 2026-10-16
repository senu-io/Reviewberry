import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onAnalysisComplete }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('csv'); // 'csv' or 'paste'
  const [businessName, setBusinessName] = useState('Roma Express Trattoria');
  const [category, setCategory] = useState('Food Delivery & Restaurant');
  const [file, setFile] = useState(null);
  const [pasteText, setPasteText] = useState(
    "The pizza took over 50 minutes and arrived cold.\n" +
    "Missing garlic dip and extra bread that I paid for!\n" +
    "Courier had no thermal bag and couldn't find my street address.\n" +
    "Food is great when dining in, but takeout packaging is soggy."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCsvSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('business_name', businessName);
    formData.append('business_category', category);

    try {
      const res = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to process CSV');
      }
      const data = await res.json();
      onAnalysisComplete(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    const lines = pasteText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 5);

    if (lines.length === 0) {
      setError("Please enter at least one review or customer comment.");
      return;
    }

    setLoading(true);
    setError(null);

    const reviews = lines.map((text, idx) => ({
      id: `custom-${idx + 1}`,
      text: text,
      author: `Customer ${idx + 1}`,
      source: "Direct Feedback",
      date: "Today"
    }));

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName,
          business_category: category,
          reviews: reviews
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Analysis failed');
      }
      const data = await res.json();
      onAnalysisComplete(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-obsidian-900 border border-obsidian-750 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative shadow-glow-berry">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-750">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-berry-600/20 text-berry-400 border border-berry-500/30 flex items-center justify-center flex-shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Analyze Custom Customer Reviews</h3>
              <p className="text-xs text-slate-400">
                Upload a CSV file or paste raw reviews to group complaints and create tasks
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

        {/* Tabs */}
        <div className="flex space-x-2 my-4 border-b border-obsidian-800 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'csv'
                ? 'bg-gradient-to-r from-berry-600 to-berry-500 text-white shadow-glow-berry'
                : 'text-slate-400 hover:bg-obsidian-800'
            }`}
          >
            Upload CSV File
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'paste'
                ? 'bg-gradient-to-r from-berry-600 to-berry-500 text-white shadow-glow-berry'
                : 'text-slate-400 hover:bg-obsidian-800'
            }`}
          >
            Paste Text Reviews
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Business Info Fields */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              className="w-full bg-obsidian-950 border border-obsidian-750 rounded-xl px-3 py-2 text-white text-xs focus:ring-1 focus:ring-berry-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Business Category</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-obsidian-950 border border-obsidian-750 rounded-xl px-3 py-2 text-white text-xs focus:ring-1 focus:ring-berry-500"
            />
          </div>
        </div>

        {activeTab === 'csv' ? (
          <form onSubmit={handleCsvSubmit} className="space-y-4 text-xs">
            <div className="border-2 border-dashed border-obsidian-750 rounded-2xl p-6 text-center hover:border-berry-500/50 transition-colors bg-obsidian-950/60">
              <input
                type="file"
                accept=".csv"
                id="csv-file-input"
                className="hidden"
                onChange={e => setFile(e.target.files[0])}
              />
              <label htmlFor="csv-file-input" className="cursor-pointer flex flex-col items-center">
                <FileText className="w-10 h-10 text-slate-500 mb-2" />
                <span className="font-semibold text-slate-200">
                  {file ? file.name : "Click to select or drag and drop CSV"}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Supported columns: text (or review), author, rating, source, date
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-berry-600 to-berry-500 hover:opacity-95 font-bold text-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-glow-berry"
            >
              <span>{loading ? 'Processing via AMD Radeon Cloud...' : 'Run Reviewberry Analysis'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasteSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Paste Reviews (One review per line)
              </label>
              <textarea
                rows={6}
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                className="w-full bg-obsidian-950 border border-obsidian-750 rounded-xl p-3 text-white text-xs font-sans leading-relaxed focus:ring-1 focus:ring-berry-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-berry-600 to-berry-500 hover:opacity-95 font-bold text-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-glow-berry"
            >
              <span>{loading ? 'Processing via AMD Radeon Cloud...' : 'Cluster & Create Tasks'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
