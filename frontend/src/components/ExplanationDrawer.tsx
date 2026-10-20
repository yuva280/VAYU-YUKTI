import React from 'react';
import { TaskItem, TaskAllocation } from '../api/mockTypes';
import { ReasonChip } from './ReasonChip';
import { FreshnessBadge } from './FreshnessBadge';
import { formatTimeRange, getPriorityBadgeColor } from '../lib/format';
import { X, CheckCircle, AlertTriangle, Clock, Layers, Database } from 'lucide-react';

interface ExplanationDrawerProps {
  task: TaskItem | null;
  allocation: TaskAllocation | null;
  onClose: () => void;
}

export const ExplanationDrawer: React.FC<ExplanationDrawerProps> = ({ task, allocation, onClose }) => {
  if (!task || !allocation) return null;

  const isAssigned = allocation.status === 'ASSIGNED';
  const explanation = allocation.explanation;
  const pColor = getPriorityBadgeColor(task.priority);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-[#E5EAF1] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#E5EAF1] bg-[#F8FAFC] flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-[#172B4D]">{task.id}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${pColor.bg} ${pColor.text} ${pColor.border} border`}>
              {task.priority} Priority
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                isAssigned
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {isAssigned ? 'Assigned' : 'Unassigned'}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#172B4D] leading-snug">{task.name}</h3>
          <div className="flex items-center gap-2 text-xs text-[#64748B] font-mono">
            <Clock className="w-3.5 h-3.5 text-[#64748B]" />
            <span>{formatTimeRange(task.start_at, task.end_at)}</span>
            <span>•</span>
            <span>{task.base_id.replace('BASE_', 'Base ')}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[#64748B] hover:text-[#172B4D] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          title="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Cause of Change Banner if applicable */}
        {explanation.cause && (
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Change-Driven Retasking Event</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed font-sans">
              {explanation.cause.summary}
            </p>
            {explanation.baseline && (
              <div className="text-[11px] font-mono text-amber-800 pt-1">
                Prior Baseline Resource: <span className="line-through text-slate-400">{explanation.baseline.resource_id}</span> → New Resource: <span className="text-emerald-700 font-bold">{allocation.resource_id}</span>
              </div>
            )}
          </div>
        )}

        {/* Executive Summary */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Operational Decision Summary</span>
          </label>
          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] text-xs text-[#172B4D] leading-relaxed shadow-xs">
            {explanation.summary}
          </div>
        </div>

        {/* Assigned Resource & Crew Specification */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Assigned Resource & Crew Complement</span>
          </label>
          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Aircraft Allocation:</span>
              <span className="font-mono text-xs font-bold text-[#172B4D]">
                {allocation.resource_id ? allocation.resource_id : 'None (Unassigned)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Required Airframe Type:</span>
              <span className="text-xs text-[#172B4D] font-medium">{task.required_resource_type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Payload Capacity Required:</span>
              <span className="font-mono text-xs text-[#172B4D]">{task.payload_required_kg.toLocaleString()} kg</span>
            </div>
            {allocation.crew.length > 0 && (
              <div className="pt-2 border-t border-[#E5EAF1]">
                <div className="text-[11px] text-[#64748B] mb-1.5 font-medium">Assigned Crew:</div>
                <div className="flex flex-wrap gap-1.5">
                  {allocation.crew.map((cm) => (
                    <span
                      key={cm.crew_id}
                      className="px-2 py-0.5 rounded bg-white text-[#172B4D] border border-[#DCE3EC] text-[11px] font-mono shadow-xs"
                    >
                      {cm.crew_id} <span className="text-[#64748B]">({cm.role})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decision Reason Chips */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
            Decision Reason Codes (Hover for definitions)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {explanation.reason_codes.map((code) => (
              <ReasonChip key={code} code={code} />
            ))}
          </div>
        </div>

        {/* Rejected Alternatives */}
        {explanation.alternatives.length > 0 && (
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
              Rejected Alternative Candidates & Reasons
            </label>
            <div className="border border-[#E5EAF1] rounded-lg overflow-hidden divide-y divide-[#E5EAF1] bg-white shadow-xs">
              {explanation.alternatives.map((alt, i) => (
                <div key={i} className="p-2.5 text-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#172B4D]">{alt.entity_id}</span>
                    <ReasonChip code={alt.code} />
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-snug">{alt.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Provenance & Freshness */}
        {explanation.data_used.length > 0 && (
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 font-semibold">
              <Database className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Data Provenance & Telemetry Freshness</span>
            </label>
            <div className="border border-[#E5EAF1] rounded-lg overflow-hidden divide-y divide-[#E5EAF1] bg-white shadow-xs">
              {explanation.data_used.map((du, i) => (
                <div key={i} className="p-2.5 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono font-semibold text-[#172B4D]">{du.entity_id}</span>
                    <div className="text-[10px] text-[#64748B] font-mono">Source: {du.source_system}</div>
                  </div>
                  <FreshnessBadge observedAt={du.observed_at} dataStatus={du.data_status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Binding Constraints */}
        {explanation.binding_constraints.length > 0 && (
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
              Active Operational Constraints Satisfied
            </label>
            <ul className="space-y-1 text-xs text-[#475569]">
              {explanation.binding_constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#2563EB] mt-0.5">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-[#E5EAF1] bg-[#F8FAFC] text-[11px] text-[#64748B] text-center font-mono">
        Synthetic explanation • Generated via deterministic CP-SAT candidate evaluation
      </div>
    </div>
  );
};
