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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'kanban'
  const [activeDemoId, setActiveDemoId] = useState('trattoria');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amdStatus, setAmdStatus] = useState(null);

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [replyModalState, setReplyModalState] = useState({ open: false, cluster: null, quoteItem: null });
  const [memoModalState, setMemoModalState] = useState({ open: false, cluster: null, task: null });

  // Initial fetch: AMD status and default Trattoria demo
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
    // Find task for cluster
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

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar
        amdStatus={amdStatus}
        onRefresh={fetchAmdStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* AMD Cloud Accelerator Telemetry Banner */}
        <AmdBanner amdMetadata={analysisData?.amd_metadata} />

        {/* 1-Click Interactive Scenarios Selector */}
        <DemoSelector
          activeDemoId={activeDemoId}
          onSelectDemo={loadDemo}
          onOpenUpload={() => setUploadModalOpen(true)}
          loading={loading}
        />

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-berry-500/20 border-t-berry-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium animate-pulse">
              Clustering reviews & synthesizing operational tasks on AMD Radeon Cloud...
            </p>
          </div>
        ) : (
          <>
            {/* Business Header & Overview Metrics */}
            {analysisData && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800/80 gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {analysisData.business_name}
                    </h2>
                    <span className="text-xs text-slate-400">
                      {analysisData.business_category} • Operational Feedback Triage
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        activeTab === 'dashboard'
                          ? 'bg-berry-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Issue Clusters ({analysisData.clusters?.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('kanban')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        activeTab === 'kanban'
                          ? 'bg-berry-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">Reviewberry</span>
            <span>—</span>
            <span>Customer complaints become business tasks</span>
          </div>
          <div className="text-[11px] text-slate-500">
            AMD ACT III Hackathon • Track 3: Reinvent Commerce • Rome, Italy
          </div>
        </div>
      </footer>

      {/* Modals */}
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
