import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../api/mockService';
import { ChangeForm } from '../components/ChangeForm';
import { GitBranch, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const Scenario: React.FC = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    return mockService.subscribe(() => setRefreshKey((k) => k + 1));
  }, []);

  const versions = mockService.getVersions();
  const activeVersion = mockService.getActiveVersion();

  const handleVersionCreated = (_versionNumber: number) => {
    navigate('/compare');
  };

  return (
    <div key={refreshKey} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172B4D]">
            Scenario Versioning & Retasking Loop
          </h1>
          <p className="text-xs text-[#64748B]">
            Every operational change produces an immutable snapshot version with an independent SHA-256 hash.
          </p>
        </div>

        {versions.length > 1 && (
          <button
            onClick={() => navigate('/compare')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Open Before/After Comparison</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Version History Line */}
      <div className="bg-white border border-[#E5EAF1] rounded-lg p-5 space-y-4 shadow-sm">
        <label className="text-xs font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 font-semibold">
          <GitBranch className="w-4 h-4 text-[#2563EB]" />
          <span>Immutable Scenario Version History</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {versions.map((v) => {
            const isActive = v.id === activeVersion.id;
            const isLatestProposal = v.version_number > 1;

            return (
              <div
                key={v.id}
                className={`p-4 rounded-lg border transition-all duration-300 space-y-2 ${
                  isActive && isLatestProposal
                    ? 'bg-blue-50/30 border-[#2563EB] ring-1 ring-[#2563EB]/50 shadow-md animate-retask-glow'
                    : isActive
                    ? 'bg-blue-50/20 border-[#2563EB] ring-1 ring-[#2563EB]/40 shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E5EAF1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-[#172B4D]">
                      Version {v.version_number}
                    </span>
                    {v.version_number === 1 ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                        Baseline Seed
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                        Reassessed Proposal
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#475569] leading-relaxed font-sans">
                  {v.change_summary}
                </p>

                <div className="space-y-1 pt-2 border-t border-[#E5EAF1] text-[11px] font-mono text-[#64748B]">
                  <div className="flex items-center justify-between">
                    <span>Created by: {v.created_by}</span>
                    <span>{new Date(v.created_at).toLocaleTimeString()} UTC</span>
                  </div>
                  <div className="truncate text-[10px] text-[#64748B]">
                    Snapshot Hash: <code className="text-[#172B4D] font-semibold">{v.snapshot_hash.slice(0, 24)}...</code>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Change Submission Form */}
      <ChangeForm onSuccess={handleVersionCreated} />
    </div>
  );
};
