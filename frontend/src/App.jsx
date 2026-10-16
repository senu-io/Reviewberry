import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AmdBanner from './components/AmdBanner';
import DemoSelector from './components/DemoSelector';
import OverviewMetrics from './components/OverviewMetrics';
import ClusterList from './components/ClusterList';
import TaskKanban from './components/TaskKanban';
import CustomerReplyModal from './components/CustomerReplyModal';
import StaffMemoModal from './components/StaffMemoModal';
import UploadModal from './components/UploadModal';
import TestConnectionModal from './components/TestConnectionModal';
import { Users, Cpu, ShieldCheck, Github, ExternalLink, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'kanban'
  const [activeDemoId, setActiveDemoId] = useState('trattoria');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amdStatus, setAmdStatus] = useState(null);

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [replyModalState, setReplyModalState] = useState({ open: false, cluster: null, quoteItem: null });
  const [memoModalState, setMemoModalState] = useState({ open: false, cluster: null, task: null });

  useEffect(() => {
    fetchAmdStatus();
    loadDemo('trattoria');
  }, []);

  const fetchAmdStatus = async () => {
    try {
      const res = await fetch('/api/amd/status');
      if (res.ok) {
        const data = await res.json();
        setAmdStatus(data);
      }
    } catch (e) {
      console.warn('Could not fetch AMD status', e);
    }
  };

  const loadDemo = async (demoId) => {
    setLoading(true);
    setActiveDemoId(demoId);
    try {
      const demoRes = await fetch(`/api/demos/${demoId}`);
      if (!demoRes.ok) throw new Error('Failed to load demo dataset');
      const demoData = await demoRes.json();

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: demoData.name,
          business_category: demoData.category,
          reviews: demoData.reviews
        })
      });

      if (!analyzeRes.ok) throw new Error('Analysis failed');
      const analysis = await analyzeRes.json();
      setAnalysisData(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    // Optimistic UI update
    setAnalysisData(prev => {
      if (!prev) return prev;
      const updatedTasks = prev.tasks.map(t => {
        if (t.id === taskId) {
          return { ...t, status: newStatus };
        }
        return t;
      });
      return { ...prev, tasks: updatedTasks };
    });

    try {
      await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenCustomerReply = (cluster, quoteItem) => {
    setReplyModalState({
      open: true,
      cluster: cluster,
      quoteItem: quoteItem || cluster?.supporting_quotes?.[0]
    });
  };

  const handleOpenStaffMemo = (cluster) => {
    const matchingTask = analysisData?.tasks?.find(t => t.cluster_id === cluster.id) || analysisData?.tasks?.[0];
    setMemoModalState({
      open: true,
      cluster: cluster,
      task: matchingTask
    });
  };

  const handleOpenStaffMemoForTask = (task) => {
    const matchingCluster = analysisData?.clusters?.find(c => c.id === task.cluster_id) || analysisData?.clusters?.[0];
    setMemoModalState({
      open: true,
      cluster: matchingCluster,
      task: task
    });
  };

  const handleJumpToTask = (clusterId) => {
    setActiveTab('kanban');
  };

  const handleModelChange = async (newModel) => {
    try {
      await fetch('/api/amd/set-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: newModel })
      });
      fetchAmdStatus();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col text-slate-100">
      <Navbar
        amdStatus={amdStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTestModal={() => setTestModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* AMD Cloud Accelerator Telemetry Banner */}
        <AmdBanner
          amdMetadata={analysisData?.amd_metadata}
          onOpenTestModal={() => setTestModalOpen(true)}
        />

        {/* 1-Click Interactive Scenarios Selector */}
        <DemoSelector
          activeDemoId={activeDemoId}
          onSelectDemo={loadDemo}
          onOpenUpload={() => setUploadModalOpen(true)}
          loading={loading}
        />

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-berry-500/20 border-t-berry-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-berry-400" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-white tracking-wide">
                Clustering Customer Reviews on AMD Radeon™ Cloud...
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Executing zero-shot semantic grouping & operational task assignment
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Business Header & Overview Metrics */}
            {analysisData && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-obsidian-750/80 gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      {analysisData.business_name}
                    </h2>
                    <span className="text-xs text-slate-400 font-medium">
                      {analysisData.business_category} • Operational Feedback Triage & Action Workflow
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'dashboard'
                          ? 'bg-gradient-to-r from-berry-600 to-berry-500 text-white shadow-glow-berry'
                          : 'bg-obsidian-900 text-slate-400 hover:text-white border border-obsidian-750'
                      }`}
                    >
                      Issue Clusters ({analysisData.clusters?.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('kanban')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'kanban'
                          ? 'bg-gradient-to-r from-berry-600 to-berry-500 text-white shadow-glow-berry'
                          : 'bg-obsidian-900 text-slate-400 hover:text-white border border-obsidian-750'
                      }`}
                    >
                      Staff Action Board ({analysisData.tasks?.length})
                    </button>
                  </div>
                </div>

                <OverviewMetrics data={analysisData} />

                {/* Main Views */}
                {activeTab === 'dashboard' ? (
                  <ClusterList
                    clusters={analysisData.clusters}
                    onOpenCustomerReply={handleOpenCustomerReply}
                    onOpenStaffMemo={handleOpenStaffMemo}
                    onSelectTaskForCluster={handleJumpToTask}
                  />
                ) : (
                  <TaskKanban
                    tasks={analysisData.tasks}
                    onUpdateTaskStatus={handleUpdateTaskStatus}
                    onOpenStaffMemoForTask={handleOpenStaffMemoForTask}
                  />
                )}

              </div>
            )}
          </>
        )}

      </main>

      {/* Enhanced Footer with Team Voyagers Attribution */}
      <footer className="border-t border-obsidian-800/80 bg-obsidian-950/90 py-8 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Team Voyagers Spotlight Card */}
          <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-obsidian-750/90 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-purple/20 via-berry-600/20 to-obsidian-900 border border-berry-500/30 flex items-center justify-center text-berry-400 shadow-glow-berry flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-extrabold text-white tracking-wide">
                    Built by Team Voyagers
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                    On-Site Hackathon Entry
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Designed & developed for <strong className="text-white">AMD Developer Hackathon: ACT III</strong> in Rome, Italy.
                </p>
              </div>
            </div>

            {/* Team Members List */}
            <div className="flex flex-wrap items-center gap-2 font-medium">
              <div className="bg-obsidian-950 px-3 py-1.5 rounded-xl border border-obsidian-750 text-slate-200 flex items-center space-x-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-berry-500" />
                <span>Nguyen Xuan Hau</span>
              </div>
              <div className="bg-obsidian-950 px-3 py-1.5 rounded-xl border border-obsidian-750 text-slate-200 flex items-center space-x-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-neon-cyan" />
                <span>Senuke Weragama</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Track Meta */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-[11px] text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-300">Reviewberry</span>
              <span>—</span>
              <span>Customer complaints become business tasks</span>
            </div>
            <div>
              Track 3 by Vibe Generation: Reinvent Commerce • Powered by AMD Radeon™ Cloud
            </div>
          </div>

        </div>
      </footer>

      {/* Modals */}
      <TestConnectionModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        currentModel={amdStatus?.model || 'DeepSeek-V4-Flash'}
        onModelChange={handleModelChange}
      />

      <CustomerReplyModal
        isOpen={replyModalState.open}
        onClose={() => setReplyModalState({ open: false, cluster: null, quoteItem: null })}
        cluster={replyModalState.cluster}
        quoteItem={replyModalState.quoteItem}
        businessName={analysisData?.business_name}
      />

      <StaffMemoModal
        isOpen={memoModalState.open}
        onClose={() => setMemoModalState({ open: false, cluster: null, task: null })}
        cluster={memoModalState.cluster}
        task={memoModalState.task}
        businessName={analysisData?.business_name}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onAnalysisComplete={(data) => {
          setAnalysisData(data);
          setActiveDemoId('custom');
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
}
