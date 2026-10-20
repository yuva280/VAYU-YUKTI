import React, { useState } from 'react';
import { OptimisationRun } from '../api/mockTypes';
import { useRole } from '../app/RoleContext';
import { mockService } from '../api/mockService';
import { StatusBadge } from './StatusBadge';
import { ShieldAlert, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';

interface ReviewPanelProps {
  run: OptimisationRun;
  onReviewSubmitted: (updatedRun: OptimisationRun) => void;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({ run, onReviewSubmitted }) => {
  const { isPlanner } = useRole();
  const [comment, setComment] = useState(
    'Approved operational retasking of T-04 to AC-06. Airframe capacity and crew qualifications validated with 0 hard constraint violations.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isProposed = run.review_status === 'PROPOSED';
  const isReviewed = run.review_status === 'APPROVED' || run.review_status === 'REJECTED';

  const handleDecision = (decision: 'APPROVED' | 'REJECTED') => {
    if (isPlanner) {
      setErrorMsg('Unauthorized: Only an authorised Reviewer can submit plan approval or rejection.');
      return;
    }

    if (!comment.trim()) {
      setErrorMsg('Please provide an operational review comment explaining your decision.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const updated = mockService.submitReview(run.id, decision, comment, 'Reviewer (Operations Lead)');
      setIsSubmitting(false);
      onReviewSubmitted(updated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error recording review decision');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#E5EAF1] rounded-lg p-5 space-y-6 shadow-sm">
      {/* Review Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAF1]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-sm font-bold text-[#172B4D]">
              Run Review Decision — {run.id}
            </h3>
            <span className="text-xs text-[#64748B] font-mono">(Version {run.version_number})</span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Human-in-the-loop governance: only approved allocations become the active plan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B] font-mono">Current Status:</span>
          <StatusBadge status={run.review_status} />
        </div>
      </div>

      {/* Role Restriction Banner if Planner */}
      {isPlanner && (
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-amber-900 block mb-0.5">
              Planner Role Active (Inspection Only)
            </span>
            <p className="text-amber-800 leading-relaxed">
              Planners can generate proposals and inspect diffs, but approval authority is restricted to the{' '}
              <span className="font-semibold text-amber-900">Reviewer</span> role. Switch role using the top-bar demo selector to submit approval.
            </p>
          </div>
        </div>
      )}

      {/* Independent Verifier Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E5EAF1]">
          <div className="text-[11px] font-mono text-[#64748B] uppercase font-semibold">Independent Verifier</div>
          <div className="text-lg font-mono font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>0 Violations</span>
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">All hard constraints verified</div>
        </div>

        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E5EAF1]">
          <div className="text-[11px] font-mono text-[#64748B] uppercase font-semibold">Priority Task Coverage</div>
          <div className="text-lg font-mono font-bold text-[#172B4D] mt-1">
            P1: 100% • P2: 100%
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">{run.task_coverage.assigned} of 14 tasks assigned</div>
        </div>

        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E5EAF1]">
          <div className="text-[11px] font-mono text-[#64748B] uppercase font-semibold">Solver Status</div>
          <div className="text-lg font-mono font-bold text-[#172B4D] mt-1 font-mono">
            {run.solver_status} ({run.solve_time_ms} ms)
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">Single-worker deterministic CP-SAT</div>
        </div>
      </div>

      {/* Prior Review Details if already reviewed */}
      {isReviewed && (
        <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-semibold text-[#172B4D]">
                Reviewed by {run.reviewed_by || 'Reviewer'}
              </span>
            </div>
            <span className="font-mono text-[#64748B] text-[11px]">
              {run.reviewed_at ? new Date(run.reviewed_at).toUTCString() : ''}
            </span>
          </div>
          <div className="text-xs text-[#475569] italic pl-4 border-l-2 border-emerald-400">
            "{run.reviewer_comment}"
          </div>
        </div>
      )}

      {/* Restrained Decision Confirmation Banner */}
      {run.review_status === 'APPROVED' && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs animate-in fade-in duration-300 shadow-xs">
          <div className="flex items-center gap-2.5 text-emerald-800 font-semibold">
            <span className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </span>
            <span>Plan Authorized & Recorded in Simulated SHA-256 Audit Ledger</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
            ACTIVE PLAN v2
          </span>
        </div>
      )}

      {/* Reviewer Comment Input */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 font-semibold">
          <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Operational Reviewer Comment</span>
        </label>
        <textarea
          rows={3}
          disabled={!isProposed || isPlanner}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter operational rationale for approving or rejecting this allocation..."
          className="w-full bg-white border border-[#DCE3EC] rounded-lg p-3 text-xs text-[#172B4D] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed shadow-xs"
        />
      </div>

      {errorMsg && (
        <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Decision Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          disabled={!isProposed || isPlanner || isSubmitting}
          onClick={() => handleDecision('REJECTED')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
            !isProposed || isPlanner
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 active:scale-95 cursor-pointer shadow-xs'
          }`}
          title={isPlanner ? 'Only Reviewer role can reject' : 'Reject proposed plan'}
        >
          <XCircle className="w-4 h-4 text-rose-600" />
          <span>Reject Proposal</span>
        </button>

        <button
          type="button"
          disabled={!isProposed || isPlanner || isSubmitting}
          onClick={() => handleDecision('APPROVED')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all ${
            !isProposed || isPlanner
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 cursor-pointer shadow-emerald-600/20'
          }`}
          title={isPlanner ? 'Only Reviewer role can approve' : 'Approve plan for active operations'}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Approve Operational Plan</span>
        </button>
      </div>
    </div>
  );
};
