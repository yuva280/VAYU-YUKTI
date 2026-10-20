import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../api/mockService';
import { Timeline } from '../components/Timeline';
import { DiffTable } from '../components/DiffTable';
import { ExplanationDrawer } from '../components/ExplanationDrawer';
import { TaskItem } from '../api/mockTypes';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Compare: React.FC = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    return mockService.subscribe(() => setRefreshKey((k) => k + 1));
  }, []);

  const runs = mockService.getRuns();
  const tasks = mockService.getTasks();
  const resources = mockService.getResources();
  const conditions = mockService.getConditions();

  const isV2Available = runs.length >= 2;
  const baseRun = runs[0];
  const propRun = runs[runs.length - 1];

  const diff = mockService.getDiff(baseRun.id, propRun.id);

  const handleSelectTaskId = (taskId: string) => {
    const t = tasks.find((item) => item.id === taskId);
    if (t) setSelectedTask(t);
  };

  return (
    <div key={refreshKey} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#172B4D]">
              Before / After Allocation Diff & Plan Stability
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
              Version 1 vs Version {isV2Available ? '2' : '1'}
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            Evaluating impact of resource change against baseline plan. Stability objective minimizes unnecessary reassignments.
          </p>
        </div>

        <button
          onClick={() => navigate('/review')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer shadow-emerald-600/20"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Proceed to Human Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Operational Impact Assessment Summary Card */}
      <div className="bg-white border border-[#E5EAF1] rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5EAF1] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#172B4D]">
              Operational Impact & Root-Cause Summary
            </h2>
          </div>
          <span className="font-mono text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
            AC-03 UNSERVICEABLE EVENT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E5EAF1] space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#64748B]">1. Triggering Condition</span>
            <p className="text-[#172B4D] font-medium">
              Airframe <span className="font-mono font-bold text-rose-700">AC-03</span> grounded at Base Alpha due to unscheduled hydraulic seal degradation.
            </p>
            <p className="text-[11px] text-[#64748B]">
              Unavailable for scheduled 10:00–12:30 UTC priority medical sortie.
            </p>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E5EAF1] space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#64748B]">2. Reassessment Decision</span>
            <p className="text-[#172B4D] font-medium">
              Sortie <span className="font-mono font-bold text-[#2563EB]">T-04</span> retasked to reserve airframe <span className="font-mono font-bold text-emerald-700">AC-06</span>.
            </p>
            <p className="text-[11px] text-[#64748B]">
              Stationed at Base Alpha, 8,000 kg capacity (exceeds 5,200 kg req.), qualified crew C-07 & C-08 assigned.
            </p>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E5EAF1] space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#64748B]">3. Constraint & Ripple Verification</span>
            <p className="text-emerald-800 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>0 hard violations · 100% stability</span>
            </p>
            <p className="text-[11px] text-[#64748B]">
              Zero ripple effect to remaining 13 scheduled tasks across Alpha, Bravo, and Charlie sectors.
            </p>
          </div>
        </div>
      </div>

      {/* Stability Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E5EAF1] p-4 rounded-lg shadow-sm">
          <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-semibold">
            Total Tasks Changed
          </div>
          <div className="text-2xl font-mono font-bold text-amber-800 mt-1">
            {diff.tasks_changed_count} / {diff.total_tasks}
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">Directly affected mission: T-04</div>
        </div>

        <div className="bg-white border border-[#E5EAF1] p-4 rounded-lg shadow-sm">
          <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-semibold">
            Unaffected Tasks Moved
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
            {diff.unaffected_tasks_changed_count}
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">Zero collateral retasking</div>
        </div>

        <div className="bg-white border border-[#E5EAF1] p-4 rounded-lg shadow-sm">
          <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-semibold">
            Plan Stability Index
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
            {diff.stability_percentage}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">13 of 13 unaffected tasks preserved</div>
        </div>

        <div className="bg-white border border-[#E5EAF1] p-4 rounded-lg shadow-sm">
          <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-semibold">
            Priority P1/P2 Coverage
          </div>
          <div className="text-2xl font-mono font-bold text-[#172B4D] mt-1">
            100% → 100%
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5 flex items-center gap-1 font-mono font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Full coverage maintained</span>
          </div>
        </div>
      </div>

      {/* Two Stacked Timelines on the Same Scale */}
      <div className="space-y-6">
        {/* Baseline Timeline (Version 1) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#172B4D] font-semibold flex items-center gap-1.5">
              <span>Baseline Plan (Version 1 — Prior to AC-03 Failure)</span>
            </span>
            <span className="text-[11px] font-mono text-[#64748B]">Run: {baseRun.id}</span>
          </div>

          <Timeline
            resources={resources}
            tasks={tasks}
            allocations={baseRun.allocations}
            conditions={conditions}
            selectedTaskId={selectedTask?.id}
            onSelectTask={(task) => setSelectedTask(task)}
            highlightChangedTaskId="T-04"
            compact={true}
          />
        </div>

        {/* Proposed Timeline (Version 2) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-900 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Proposed Plan (Version 2 — Re-solved with Stability Objective)</span>
            </span>
            <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Run: {propRun.id} (Proposed)
            </span>
          </div>

          <Timeline
            resources={resources}
            tasks={tasks}
            allocations={propRun.allocations}
            conditions={conditions}
            selectedTaskId={selectedTask?.id}
            onSelectTask={(task) => setSelectedTask(task)}
            highlightChangedTaskId="T-04"
            compact={true}
          />
        </div>
      </div>

      {/* Detailed Diff Table */}
      <div className="space-y-3 pt-4 border-t border-[#E5EAF1]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#172B4D] font-mono">
          Task-by-Task Allocation Delta & Causes
        </h2>
        <DiffTable diffTasks={diff.tasks} onSelectTask={handleSelectTaskId} />
      </div>

      {/* Explanation Drawer */}
      <ExplanationDrawer
        task={selectedTask}
        allocation={selectedTask ? propRun.allocations[selectedTask.id] || null : null}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};
