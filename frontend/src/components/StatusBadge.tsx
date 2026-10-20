import React from 'react';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case 'AVAILABLE':
      case 'OPTIMAL':
      case 'APPROVED':
      case 'ASSIGNED':
      case 'VALID':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PROPOSED':
      case 'FEASIBLE':
      case 'WARNING':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'UNSERVICEABLE':
      case 'IN_MAINTENANCE':
      case 'INFEASIBLE':
      case 'REJECTED':
      case 'UNASSIGNED':
      case 'CONFLICT':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'SUPERSEDED':
      case 'STALE':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${pad} ${getStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{status}</span>
    </span>
  );
};
