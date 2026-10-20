export function formatUtcTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const hours = d.getUTCHours().toString().padStart(2, '0');
    const minutes = d.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} UTC`;
  } catch {
    return isoString;
  }
}

export function formatUtcDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const year = d.getUTCFullYear();
    const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = d.getUTCDate().toString().padStart(2, '0');
    const hours = d.getUTCHours().toString().padStart(2, '0');
    const minutes = d.getUTCMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
  } catch {
    return isoString;
  }
}

export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatUtcTime(startIso)} – ${formatUtcTime(endIso)}`;
}

export function formatDurationMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function getPriorityBadgeColor(priority: string): { bg: string; text: string; border: string } {
  switch (priority) {
    case 'P1':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    case 'P2':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    case 'P3':
      return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' };
    case 'P4':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'P5':
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

export function getDataQualityStatusColor(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case 'VALID':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'WARNING':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    case 'STALE':
      return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' };
    case 'CONFLICT':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'REJECTED':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  }
}
