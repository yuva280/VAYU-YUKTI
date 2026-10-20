import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../api/mockService';
import { ReviewPanel } from '../components/ReviewPanel';
import { OptimisationRun } from '../api/mockTypes';
import { useRole } from '../app/RoleContext';
import { Shield, History, ArrowRight } from 'lucide-react';

export const Review: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    return mockService.subscribe(() => setRefreshKey((k) => k + 1));
  }, []);

  const runs = mockService.getRuns();
  const latestRun = mockService.getLatestRun();

  const handleReviewSubmitted = (_updatedRun: OptimisationRun) => {
    // Review complete, user can inspect audit history
  };

  return (
    <div key={refreshKey} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172B4D]">
            Operational Plan Governance & Human Review
          </h1>
          <p className="text-xs text-[#64748B]">
            Mandatory human sign-off workflow ({role} view). Decisions are recorded in the append-only cryptographic audit chain.
          </p>
        </div>

        <button
          onClick={() => navigate('/audit')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#F8FAFC] border border-[#DCE3EC] text-[#172B4D] text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <History className="w-4 h-4 text-[#2563EB]" />
          <span>View Audit History Log</span>
          <ArrowRight className="w-4 h-4 text-[#64748B]" />
        </button>
      </div>

      {/* Active Run Review Decision Panel */}
      <ReviewPanel run={latestRun} onReviewSubmitted={handleReviewSubmitted} />

      {/* Prior Runs History */}
      <div className="bg-white border border-[#E5EAF1] rounded-lg p-5 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#172B4D] font-mono flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#2563EB]" />
          <span>Historical Run Governance Status</span>
        </h2>

        <div className="border border-[#E5EAF1] rounded-lg overflow-x-auto bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] uppercase font-mono text-[11px] tracking-wider border-b border-[#E5EAF1]">
              <tr>
                <th className="py-2.5 px-4">Run ID</th>
                <th className="py-2.5 px-3">Version</th>
                <th className="py-2.5 px-3">Solver Status</th>
                <th className="py-2.5 px-3">Hard Violations</th>
                <th className="py-2.5 px-3">Task Coverage</th>
                <th className="py-2.5 px-3">Review Status</th>
                <th className="py-2.5 px-4">Reviewer Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF1] font-mono">
              {runs.map((r) => (
                <tr key={r.id} className="hover:bg-[#F8FAFC] text-[#172B4D]">
                  <td className="py-3 px-4 font-bold text-[#172B4D]">{r.id}</td>
                  <td className="py-3 px-3">v{r.version_number}</td>
                  <td className="py-3 px-3 text-emerald-700 font-bold">{r.solver_status}</td>
                  <td className="py-3 px-3 text-emerald-700 font-bold">{r.violation_count}</td>
                  <td className="py-3 px-3 text-[#475569]">
                    {r.task_coverage.assigned}/{r.task_coverage.total} (P1: 100%)
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        r.review_status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : r.review_status === 'PROPOSED'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : r.review_status === 'SUPERSEDED'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {r.review_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px] font-sans text-[#475569] max-w-xs truncate">
                    {r.reviewer_comment || <span className="text-slate-400 italic">Pending review</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
