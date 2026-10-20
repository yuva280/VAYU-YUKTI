import React, { useState } from 'react';
import { mockService } from '../api/mockService';
import { DataQualityIssue } from '../api/mockTypes';
import { Database, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const DataQuality: React.FC = () => {
  const issues = mockService.getDataQualityIssues();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedIssue, setSelectedIssue] = useState<DataQualityIssue | null>(issues[0] || null);

  const filteredIssues = issues.filter((iss) => {
    if (filterType === 'ALL') return true;
    return iss.issue_type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#172B4D]">
              Data Ingestion Quality & Schema Gate
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
              3 Active Defects
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            Validation layer enforces strict boundary contracts. Discrepancies, stale timestamps, and missing fields are excluded before solver ingestion.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          {['ALL', 'STALE', 'CONFLICT', 'MISSING_FIELD'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                  : 'bg-white text-[#475569] border-[#DCE3EC] hover:bg-[#F8FAFC]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Safety Summary Banner with subtle scanning indicator */}
      <div className="relative overflow-hidden p-4 rounded-lg bg-amber-50/70 border border-amber-200 flex items-center justify-between shadow-xs">
        {/* Subtle animated scanning beam overlay */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent animate-data-scan pointer-events-none" />

        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-900 block">
                Automated Exclusion Policy Enforced
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                Active Schema Scan
              </span>
            </div>
            <span className="text-amber-800">
              Entities failing validation constraints are automatically quarantined. The CP-SAT solver never assigns unverified or contradictory airframes.
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-emerald-700 font-semibold shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Solver Input Sanitized</span>
        </div>
      </div>

      {/* Main Layout: Issues List + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issues List Column */}
        <div className="lg:col-span-2 space-y-3">
          {filteredIssues.map((issue) => {
            const isSelected = selectedIssue?.id === issue.id;

            return (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className={`p-4 rounded-lg border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-blue-50/20 border-[#2563EB] ring-1 ring-[#2563EB]/40 shadow-sm'
                    : 'bg-white border-[#E5EAF1] hover:border-[#2563EB]/40 hover:bg-[#F8FAFC] shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#172B4D]">
                      {issue.entity_id}
                    </span>
                    <span className="text-xs text-[#64748B] font-mono">
                      ({issue.entity_type.toUpperCase()})
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                        issue.issue_type === 'CONFLICT'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : issue.issue_type === 'STALE'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-orange-50 text-orange-800 border-orange-200'
                      }`}
                    >
                      {issue.issue_type}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                    EXCLUDED FROM ALLOCATION
                  </span>
                </div>

                <p className="text-xs text-[#475569] leading-relaxed">
                  {issue.message}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#64748B] font-mono pt-1 border-t border-[#E5EAF1]">
                  <span>Target Field: <code className="text-[#172B4D] font-semibold">{issue.field}</code></span>
                  <span>Detected at: {issue.detected_at}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Issue Raw Record Inspector */}
        {selectedIssue && (
          <div className="bg-white border border-[#E5EAF1] rounded-lg p-5 space-y-4 self-start shadow-sm">
            <div className="pb-3 border-b border-[#E5EAF1]">
              <span className="font-mono text-xs uppercase tracking-wider text-[#64748B] font-semibold">
                Discrepancy Inspector
              </span>
              <h3 className="text-base font-bold text-[#172B4D] font-mono mt-0.5 flex items-center justify-between">
                <span>{selectedIssue.entity_id}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono font-semibold">
                  {selectedIssue.severity}
                </span>
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#64748B] block mb-1 font-semibold">Issue Rule Description:</span>
                <div className="p-3 bg-[#F8FAFC] border border-[#E5EAF1] rounded text-[#172B4D] leading-relaxed">
                  {selectedIssue.message}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Defect Classification:</span>
                <span className="font-mono text-[#172B4D] font-semibold">{selectedIssue.issue_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Solver Status:</span>
                <span className="font-mono text-rose-700 font-bold">STRICTLY EXCLUDED</span>
              </div>
            </div>

            {/* Raw JSON Feeds Evidence */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 font-semibold">
                <Database className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Raw Feed Payload Evidence</span>
              </label>
              <pre className="p-3 bg-[#F8FAFC] border border-[#E5EAF1] rounded-lg text-[10px] font-mono text-[#172B4D] overflow-x-auto leading-relaxed shadow-xs">
                {JSON.stringify(selectedIssue.raw_record, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
