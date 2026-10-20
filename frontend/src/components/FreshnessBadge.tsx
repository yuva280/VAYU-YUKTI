import React from 'react';

interface FreshnessBadgeProps {
  observedAt: string;
  dataStatus?: string;
}

export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({ observedAt, dataStatus }) => {
  const getRelativeText = (iso: string) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      // Fixed reference time for demo scenario: 2026-11-02T06:00:00Z
      const refTime = new Date('2026-11-02T06:00:00Z').getTime();
      const diffMs = refTime - d.getTime();
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));

      if (diffHours >= 24) {
        return `${diffHours}h ago (Threshold exceeded)`;
      } else if (diffHours > 0) {
        return `${diffHours}h ago`;
      } else {
        const diffMins = Math.max(5, Math.round(diffMs / (1000 * 60)));
        return `${diffMins}m ago`;
      }
    } catch {
      return observedAt;
    }
  };

  const isStale = dataStatus === 'STALE' || getRelativeText(observedAt).includes('exceeded');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${
        isStale
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-[#F1F5F9] text-[#475569] border-[#DCE3EC]'
      }`}
      title={`Observed at: ${observedAt}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isStale ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600'}`} />
      <span>{getRelativeText(observedAt)}</span>
    </span>
  );
};
