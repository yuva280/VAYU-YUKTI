import React, { useState } from 'react';
import { DiffTaskItem } from '../api/mockTypes';
import { getPriorityBadgeColor, formatTimeRange } from '../lib/format';
import { ArrowRight, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DiffTableProps {
  diffTasks: DiffTaskItem[];
  onSelectTask?: (taskId: string) => void;
}

export const DiffTable: React.FC<DiffTableProps> = ({ diffTasks, onSelectTask }) => {
  const [showChangedOnly, setShowChangedOnly] = useState(false);

  const displayedTasks = showChangedOnly
    ? diffTasks.filter((t) => t.change_category !== 'UNCHANGED')
    : diffTasks;

  return (
    <div className="space-y-3">
      {/* Table toolbar / filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChangedOnly(!showChangedOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              showChangedOnly
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                : 'bg-white text-[#475569] border-[#DCE3EC] hover:bg-[#F8FAFC]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{showChangedOnly ? 'Showing Changed Only' : 'Show Changed Only'}</span>
          </button>
          <span className="text-xs text-[#64748B] font-mono">
            Showing {displayedTasks.length} of {diffTasks.length} tasks
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#E5EAF1] rounded-lg overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-[#475569] uppercase font-mono text-[11px] tracking-wider border-b border-[#E5EAF1]">
            <tr>
              <th className="py-3 px-4">Task</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Time / Base</th>
              <th className="py-3 px-4">Baseline (v1)</th>
              <th className="py-3 px-1 text-center"></th>
              <th className="py-3 px-4">Proposed (v2)</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-4">Cause / Stability Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EAF1]">
            {displayedTasks.map((t) => {
              const pColor = getPriorityBadgeColor(t.priority);
              const isChanged = t.change_category !== 'UNCHANGED';

              return (
                <tr
                  key={t.task_id}
                  onClick={() => onSelectTask && onSelectTask(t.task_id)}
                  className={`transition-colors cursor-pointer ${
                    isChanged
                      ? 'bg-amber-50/50 hover:bg-amber-50/80 text-[#172B4D]'
                      : 'hover:bg-[#F8FAFC] text-[#172B4D]'
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-[#172B4D]">{t.task_id}</div>
                    <div className="text-[11px] text-[#64748B] truncate max-w-[180px]">{t.task_name}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${pColor.bg} ${pColor.text} ${pColor.border}`}>
                      {t.priority}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                    <div>{formatTimeRange(t.start_at, t.end_at)}</div>
                    <div className="text-[10px] text-[#64748B]">{t.base_id.replace('BASE_', 'Base ')}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className={t.resource_before ? 'text-[#172B4D] font-semibold' : 'text-slate-400'}>
                        {t.resource_before || 'UNASSIGNED'}
                      </span>
                    </div>
                    {t.crew_before.length > 0 && (
                      <div className="text-[10px] font-mono text-[#64748B] truncate">
                        {t.crew_before.join(', ')}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-1 text-center text-[#64748B]">
                    <ArrowRight className={`w-3.5 h-3.5 inline ${isChanged ? 'text-amber-600 font-bold' : 'text-slate-400'}`} />
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span
                        className={`font-semibold ${
                          isChanged
                            ? 'text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300 shadow-xs ring-2 ring-amber-400/40 animate-pulse'
                            : 'text-[#172B4D]'
                        }`}
                      >
                        {t.resource_after || 'UNASSIGNED'}
                      </span>
                    </div>
                    {t.crew_after.length > 0 && (
                      <div className="text-[10px] font-mono text-[#64748B] truncate">
                        {t.crew_after.join(', ')}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        t.change_category === 'UNCHANGED'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : t.change_category === 'REASSIGNED'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {t.change_category === 'UNCHANGED' ? (
                        <CheckCircle2 className="w-3 h-3 text-slate-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{t.change_category}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 text-[11px] text-[#475569] max-w-[280px]">
                    <p className="line-clamp-2 leading-relaxed">{t.cause}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
