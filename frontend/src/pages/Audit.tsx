import React, { useState, useEffect } from 'react';
import { mockService } from '../api/mockService';
import { AuditEvent } from '../api/mockTypes';
import { RotateCcw, Filter, CheckCircle2 } from 'lucide-react';

export const Audit: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    return mockService.subscribe(() => setRefreshKey((k) => k + 1));
  }, []);

  const auditLog: AuditEvent[] = mockService.getAuditLog();

  const filteredEvents = auditLog.filter((ev) => {
    if (actionFilter === 'ALL') return true;
    return ev.action === actionFilter;
  });

  const handleResetDemo = () => {
    if (window.confirm('Reset demo scenario to initial deterministic seed state (Version 1)?')) {
      mockService.reset();
    }
  };

  const uniqueActions = ['ALL', ...Array.from(new Set(auditLog.map((ev) => ev.action)))];

  return (
    <div key={refreshKey} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#172B4D]">
              Event Provenance & Simulated Cryptographic Audit Ledger
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulated SHA-256 Chain Verified</span>
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            Append-only simulated hash-chained ledger. Every ingestion, constraint check, CP-SAT solve, and reviewer decision is linked via consecutive SHA-256 digest hashes.
          </p>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={handleResetDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#F8FAFC] border border-[#DCE3EC] text-amber-800 text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-amber-700" />
          <span>Reset Demo to Baseline</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center justify-between bg-white border border-[#E5EAF1] p-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-xs text-[#64748B] font-mono font-medium">Action Filter:</span>
          {uniqueActions.map((action) => (
            <button
              key={action}
              onClick={() => setActionFilter(action)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer border ${
                actionFilter === action
                  ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-xs'
                  : 'bg-[#F8FAFC] text-[#475569] border-[#DCE3EC] hover:bg-[#F1F5F9] hover:text-[#172B4D]'
              }`}
            >
              {action}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#64748B] hidden md:inline">
          {filteredEvents.length} Chain Entries
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="border border-[#E5EAF1] rounded-lg overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-[#475569] uppercase font-mono text-[11px] tracking-wider border-b border-[#E5EAF1]">
            <tr>
              <th className="py-3 px-4">Event ID / Time</th>
              <th className="py-3 px-3">Actor / Role</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Entity</th>
              <th className="py-3 px-4">Operational Details</th>
              <th className="py-3 px-4">Hash Verification Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EAF1] font-mono text-[11px]">
            {filteredEvents.map((ev) => (
              <tr key={ev.id} className="hover:bg-[#F8FAFC] transition-colors text-[#172B4D]">
                <td className="py-3 px-4">
                  <div className="flex items-start gap-2.5">
                    <div className="flex flex-col items-center pt-1 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-50 border-2 border-[#2563EB] shadow-xs" />
                      <span className="w-0.5 h-6 bg-blue-200/80 my-0.5" />
                    </div>
                    <div>
                      <div className="font-bold text-[#172B4D]">{ev.id}</div>
                      <div className="text-[10px] text-[#64748B]">
                        {new Date(ev.timestamp).toUTCString().slice(5, 25)}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-3">
                  <div className="text-[#172B4D] font-semibold">{ev.actor}</div>
                  <div className="text-[10px] text-[#64748B]">{ev.role}</div>
                </td>

                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                      ev.action.includes('APPROVED')
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : ev.action.includes('CHANGE')
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : ev.action.includes('RUN')
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {ev.action}
                  </span>
                </td>

                <td className="py-3 px-3 text-[#172B4D]">
                  <div>{ev.entity_type}</div>
                  <div className="text-[10px] text-[#64748B]">{ev.entity_id}</div>
                </td>

                <td className="py-3 px-4 text-[#475569] font-sans text-xs max-w-sm">
                  {ev.details}
                </td>

                <td className="py-3 px-4 font-mono text-[10px] text-[#64748B]">
                  <div className="flex items-center gap-1 text-[#64748B]">
                    <span className="text-slate-400">prev:</span>
                    <span className="truncate max-w-[120px]">{ev.prev_hash.slice(0, 16)}...</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-bold">
                    <span className="text-slate-400 font-normal">hash:</span>
                    <span className="truncate max-w-[120px]">{ev.hash.slice(0, 16)}...</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
