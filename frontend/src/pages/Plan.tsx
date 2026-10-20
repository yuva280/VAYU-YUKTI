import React, { useState, useEffect } from 'react';
import { mockService } from '../api/mockService';
import { Timeline } from '../components/Timeline';
import { ExplanationDrawer } from '../components/ExplanationDrawer';
import { StatusBadge } from '../components/StatusBadge';
import { TaskItem } from '../api/mockTypes';
import { getPriorityBadgeColor, formatTimeRange } from '../lib/format';
import { CheckCircle2, Zap, Filter } from 'lucide-react';

export const Plan: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  useEffect(() => {
    return mockService.subscribe(() => setRefreshKey((k) => k + 1));
  }, []);

  const resources = mockService.getResources();
  const tasks = mockService.getTasks();
  const conditions = mockService.getConditions();
  const latestRun = mockService.getLatestRun();
  const activeVersion = mockService.getActiveVersion();

  const filteredTasks = tasks.filter((t) => {
    if (priorityFilter === 'ALL') return true;
    return t.priority === priorityFilter;
  });

  return (
    <div key={refreshKey} className="space-y-6">
      {/* Header & Solver Metrics Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#172B4D]">
              Operational Plan Timeline & Allocation Engine
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold">
              v{activeVersion.version_number} • Run: {latestRun.id}
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            CP-SAT lexicographic coverage: P1/P2 mandatory coverage satisfied with zero hard-constraint violations.
          </p>
        </div>

        {/* Solver Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>0 Violations</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#DCE3EC] text-[#172B4D] text-xs font-mono shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{latestRun.solver_status} ({latestRun.solve_time_ms} ms)</span>
          </div>

          <StatusBadge status={latestRun.review_status} size="sm" />
        </div>
      </div>

      {/* Main Gantt Timeline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#172B4D] font-semibold">
            Resource Allocation Horizon (06:00 – 18:00 UTC)
          </span>
          <span className="text-xs text-[#64748B] font-mono">
            Click task block to open Explainability Drawer
          </span>
        </div>

        <Timeline
          resources={resources}
          tasks={tasks}
          allocations={latestRun.allocations}
          conditions={conditions}
          selectedTaskId={selectedTask?.id}
          onSelectTask={(task) => setSelectedTask(task)}
        />
      </div>

      {/* Detailed Tasks Breakdown Table */}
      <div className="space-y-3 pt-4 border-t border-[#E5EAF1]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#172B4D] font-mono">
              Tasks & Allocation Manifest ({tasks.length} Total)
            </h2>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-xs text-[#64748B] font-mono font-medium">Filter:</span>
            {['ALL', 'P1', 'P2', 'P3', 'P4', 'P5'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                    : 'bg-white text-[#475569] border border-[#DCE3EC] hover:bg-[#F8FAFC]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-[#E5EAF1] rounded-lg overflow-x-auto bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] uppercase font-mono text-[11px] tracking-wider border-b border-[#E5EAF1]">
              <tr>
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Time Window</th>
                <th className="py-3 px-3">Base</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Assigned Airframe</th>
                <th className="py-3 px-4">Assigned Crew</th>
                <th className="py-3 px-4">Explanation Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF1]">
              {filteredTasks.map((t) => {
                const alloc = latestRun.allocations[t.id];
                const isAssigned = alloc && alloc.status === 'ASSIGNED';
                const pColor = getPriorityBadgeColor(t.priority);
                const isSelected = selectedTask?.id === t.id;

                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTask(t)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-2 border-[#2563EB]'
                        : isAssigned
                        ? 'hover:bg-[#F8FAFC]'
                        : 'bg-rose-50/40 hover:bg-rose-50/70'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#172B4D]">
                      {t.id}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${pColor.bg} ${pColor.text} ${pColor.border}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[#475569]">
                      {formatTimeRange(t.start_at, t.end_at)}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#475569]">
                      {t.base_id.replace('BASE_', 'Base ')}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                          isAssigned
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {isAssigned ? 'ASSIGNED' : 'UNASSIGNED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#172B4D]">
                      {alloc?.resource_id || <span className="text-slate-400 font-normal">None</span>}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#475569]">
                      {alloc && alloc.crew.length > 0 ? (
                        alloc.crew.map((c) => c.crew_id).join(', ')
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#475569] max-w-[280px]">
                      <p className="line-clamp-2 leading-relaxed">
                        {alloc?.explanation?.summary || 'No allocation'}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation Drawer */}
      <ExplanationDrawer
        task={selectedTask}
        allocation={selectedTask ? latestRun.allocations[selectedTask.id] || null : null}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};
