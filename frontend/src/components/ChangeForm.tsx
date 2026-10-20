import React, { useState } from 'react';
import { mockService } from '../api/mockService';
import { AlertTriangle, Sparkles, Check, ArrowRight } from 'lucide-react';
import { ReassessmentStepperModal } from './ReassessmentStepperModal';

interface ChangeFormProps {
  onSuccess: (versionNumber: number) => void;
}

export const ChangeForm: React.FC<ChangeFormProps> = ({ onSuccess }) => {
  const [entityType, setEntityType] = useState('resource');
  const [entityId, setEntityId] = useState('AC-03');
  const [field, setField] = useState('status');
  const [newValue, setNewValue] = useState('UNSERVICEABLE');
  const [reason, setReason] = useState('Unscheduled hydraulic leak detected during pre-flight inspection');
  const [source, setSource] = useState('maintenance_feed');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isV2Applied = mockService.isAC03UnserviceableApplied();
  const [isStepperOpen, setIsStepperOpen] = useState(false);

  const handleApplyPresetAC03 = () => {
    setIsStepperOpen(true);
  };

  const handleStepperComplete = () => {
    setIsStepperOpen(false);
    setIsSubmitting(true);
    const res = mockService.applyPresetChangeAC03Unserviceable('Planner');
    setIsSubmitting(false);
    onSuccess(res.version.version_number);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entityId === 'AC-03' && newValue === 'UNSERVICEABLE') {
      handleApplyPresetAC03();
    } else {
      // In this deterministic demo, preset AC-03 triggers the full validated CP-SAT re-solve
      handleApplyPresetAC03();
    }
  };

  return (
    <div className="bg-white border border-[#E5EAF1] rounded-lg p-5 space-y-6 shadow-sm">
      {/* Preset Demo Buttons Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Preset Demonstration Changes</span>
          </label>
          <span className="text-[11px] text-[#64748B] font-mono">Instant deterministic re-solve</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isV2Applied || isSubmitting}
            onClick={handleApplyPresetAC03}
            className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
              isV2Applied
                ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                : 'bg-amber-50/60 border-amber-200 hover:bg-amber-100/70 hover:border-amber-400 active:scale-[0.99] cursor-pointer shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                AC-03 → UNSERVICEABLE
              </span>
              {isV2Applied ? (
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active in v2
                </span>
              ) : (
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-semibold">
                  Preset 1 (Primary Demo)
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#475569] leading-snug">
              Mark AC-03 unserviceable before P1 relief mission T-04. Solves stability objective: reassigns T-04 to AC-06, preserving all other 13 tasks.
            </p>
          </button>

          <button
            type="button"
            disabled={true}
            className="p-3.5 rounded-lg border bg-slate-50 border-slate-200 text-left opacity-60 cursor-not-allowed flex flex-col justify-between"
            title="Preset 2 (Weather window at Base Bravo already active in baseline scenario)"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold text-[#64748B]">
                Weather: Bravo Ridge Winds
              </span>
              <span className="text-[10px] font-mono text-[#64748B] bg-slate-100 px-1.5 py-0.5 rounded">Seed Window CW-01</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-snug">
              Restricts rotary operations 12:00–15:00 UTC at Base Bravo. Pre-seeded in baseline input model.
            </p>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5EAF1]" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-mono">
          <span className="bg-white px-2 text-[#64748B] font-semibold">Or Manual Change Event Form</span>
        </div>
      </div>

      {/* Manual Change Event Form */}
      <form onSubmit={handleCustomSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-[#64748B] mb-1 font-semibold">Entity Type</label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="w-full bg-white border border-[#DCE3EC] rounded-md px-3 py-2 text-xs text-[#172B4D] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] font-mono"
            >
              <option value="resource">Resource (Airframe)</option>
              <option value="crew">Crew Member</option>
              <option value="task">Task Requirement</option>
              <option value="condition">Condition Window</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#64748B] mb-1 font-semibold">Target Entity ID</label>
            <input
              type="text"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              className="w-full bg-white border border-[#DCE3EC] rounded-md px-3 py-2 text-xs text-[#172B4D] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#64748B] mb-1 font-semibold">Target Field</label>
            <input
              type="text"
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full bg-white border border-[#DCE3EC] rounded-md px-3 py-2 text-xs text-[#172B4D] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-[#64748B] mb-1 font-semibold">New Value</label>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full bg-white border border-[#DCE3EC] rounded-md px-3 py-2 text-xs text-[#172B4D] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#64748B] mb-1 font-semibold">Source Ingestion System</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-white border border-[#DCE3EC] rounded-md px-3 py-2 text-xs text-[#172B4D] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#64748B] mb-1 font-semibold">Operational Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-white border border-[#DCE3EC] rounded-md px-3 py-2 text-xs text-[#172B4D] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isV2Applied}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all ${
              isV2Applied
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-[#2563EB] hover:bg-blue-700 text-white active:scale-95 cursor-pointer shadow-blue-500/20'
            }`}
          >
            {isSubmitting ? (
              <span>Recomputing CP-SAT Plan...</span>
            ) : (
              <>
                <span>Submit Change & Reassess</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <ReassessmentStepperModal
        isOpen={isStepperOpen}
        onComplete={handleStepperComplete}
        onCancel={() => setIsStepperOpen(false)}
      />
    </div>
  );
};
