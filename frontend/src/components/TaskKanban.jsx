import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  User,
  Building2,
  TrendingUp,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ListTodo
} from 'lucide-react';

export default function TaskKanban({ tasks, onUpdateTaskStatus, onOpenStaffMemoForTask }) {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (taskId, idx) => {
    const key = `${taskId}-${idx}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getPriorityStyle = (priority) => {
    if (priority.includes('Urgent') || priority.includes('P1')) {
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    }
    if (priority.includes('High') || priority.includes('P2')) {
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
    return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  };

  const columns = [
    {
      id: 'proposed',
      title: 'Proposed Tasks',
      subtitle: 'Generated from customer complaints',
      badgeClass: 'bg-berry-500/20 text-berry-300'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      subtitle: 'Assigned & active staff execution',
      badgeClass: 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'completed',
      title: 'Resolved',
      subtitle: 'Operational fixes landed',
      badgeClass: 'bg-emerald-500/20 text-emerald-300'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-berry-500" />
            <span>Staff Action & Resolution Board</span>
          </h3>
          <p className="text-xs text-slate-400">
            Turn complaint patterns into assigned team deliverables with step-by-step SOP checklists.
          </p>
        </div>
      </div>

      {/* 3-Column Kanban Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {columns.map(col => {
          const colTasks = tasks?.filter(t => (t.status || 'proposed') === col.id) || [];

          return (
            <div
              key={col.id}
              className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-white">{col.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badgeClass}`}>
                      {colTasks.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{col.subtitle}</p>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3.5 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800/80 rounded-xl">
                    <ListTodo className="w-6 h-6 text-slate-600 mb-1" />
                    <span>No tasks in this stage</span>
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-sm space-y-3"
                    >
                      {/* Priority & Department */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>

                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>{task.department}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h5 className="font-semibold text-sm text-slate-100 leading-snug">
                        {task.title}
                      </h5>

                      {/* Meta: Assignee & Time */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <User className="w-3 h-3 text-berry-400" />
                          <span className="truncate">{task.assignee_role}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-slate-300 justify-end">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{task.estimated_resolution_time}</span>
                        </div>
                      </div>

                      {/* Interactive Checklist */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Action Checklist
                        </span>
                        <div className="space-y-1">
                          {task.checklist?.map((item, idx) => {
                            const isChecked = checkedItems[`${task.id}-${idx}`] || false;
                            return (
                              <div
                                key={idx}
                                onClick={() => toggleCheck(task.id, idx)}
                                className="flex items-start space-x-2 text-xs text-slate-300 cursor-pointer group hover:text-white"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}}
                                  className="mt-0.5 rounded border-slate-700 text-berry-600 focus:ring-berry-500 bg-slate-900 h-3.5 w-3.5"
                                />
                                <span className={`text-[11px] leading-tight ${isChecked ? 'line-through text-slate-500' : ''}`}>
                                  {item}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Business Outcome */}
                      <div className="text-[11px] text-slate-400 flex items-start space-x-1.5 pt-1 border-t border-slate-800/80">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-emerald-400/90 font-medium">{task.expected_business_outcome}</span>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                        <button
                          onClick={() => onOpenStaffMemoForTask(task)}
                          title="Generate SOP briefing memo"
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
                        >
                          <FileText className="w-3 h-3 text-amber-400" />
                          <span>SOP Memo</span>
                        </button>

                        <div className="flex items-center space-x-1">
                          {col.id !== 'proposed' && (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, col.id === 'completed' ? 'in_progress' : 'proposed')}
                              title="Move back"
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {col.id !== 'completed' && (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, col.id === 'proposed' ? 'in_progress' : 'completed')}
                              className="px-2.5 py-1 rounded bg-berry-600 hover:bg-berry-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <span>{col.id === 'proposed' ? 'Assign Staff' : 'Resolve'}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}

                          {col.id === 'completed' && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Closed</span>
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
