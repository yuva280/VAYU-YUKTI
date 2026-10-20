export interface ReasonCodeMeta {
  code: string;
  label: string;
  description: string;
  category: 'eligibility' | 'validation' | 'explainer' | 'assignment';
}

export const REASON_CODES: Record<string, ReasonCodeMeta> = {
  R_ELIGIBLE: {
    code: 'R_ELIGIBLE',
    label: 'Passed Eligibility',
    description: 'Passed all operational and technical eligibility constraints.',
    category: 'eligibility',
  },
  R_TYPE_MISMATCH: {
    code: 'R_TYPE_MISMATCH',
    label: 'Type Incompatible',
    description: 'Aircraft type does not match task requirement.',
    category: 'eligibility',
  },
  R_BASE_MISMATCH: {
    code: 'R_BASE_MISMATCH',
    label: 'Base Mismatch',
    description: 'Resource or crew is stationed at a different operational base.',
    category: 'eligibility',
  },
  R_UNSERVICEABLE: {
    code: 'R_UNSERVICEABLE',
    label: 'Unserviceable / In Maintenance',
    description: 'Aircraft status is unserviceable or undergoing unscheduled maintenance.',
    category: 'eligibility',
  },
  R_MAINTENANCE_WINDOW: {
    code: 'R_MAINTENANCE_WINDOW',
    label: 'Maintenance Window Overlap',
    description: 'Scheduled maintenance downtime overlaps with the task operational window.',
    category: 'eligibility',
  },
  R_MAINTENANCE_HOURS: {
    code: 'R_MAINTENANCE_HOURS',
    label: 'Insufficient Airframe Hours',
    description: 'Remaining flight hours before mandatory inspection are insufficient for task duration.',
    category: 'eligibility',
  },
  R_PAYLOAD: {
    code: 'R_PAYLOAD',
    label: 'Payload Limit Exceeded',
    description: 'Required cargo/relief payload exceeds airframe maximum capacity.',
    category: 'eligibility',
  },
  R_CONDITION_BLOCKED: {
    code: 'R_CONDITION_BLOCKED',
    label: 'Weather / Airspace Restriction',
    description: 'Active condition window (weather/airspace restriction) blocks this aircraft category at the base.',
    category: 'eligibility',
  },
  R_STALE_DATA: {
    code: 'R_STALE_DATA',
    label: 'Stale Telemetry Data',
    description: 'Observed timestamp exceeds freshness threshold (>24 hours). Excluded from safe allocation.',
    category: 'validation',
  },
  R_CONFLICTING_DATA: {
    code: 'R_CONFLICTING_DATA',
    label: 'Conflicting Ingestion Feeds',
    description: 'Disagreement detected between readiness and maintenance feeds. Excluded until reconciled.',
    category: 'validation',
  },
  R_CREW_UNQUALIFIED: {
    code: 'R_CREW_UNQUALIFIED',
    label: 'Crew Lacks Type Qualification',
    description: 'Crew member does not hold type qualification for this aircraft airframe.',
    category: 'eligibility',
  },
  R_CREW_UNAVAILABLE: {
    code: 'R_CREW_UNAVAILABLE',
    label: 'Crew Status Unavailable',
    description: 'Crew member is flagged unavailable, on leave, or medical hold.',
    category: 'eligibility',
  },
  R_CREW_DUTY_LIMIT: {
    code: 'R_CREW_DUTY_LIMIT',
    label: 'Crew Duty Limit Exceeded',
    description: 'Assignment would breach mandatory maximum daily duty time or rest requirement.',
    category: 'eligibility',
  },
  R_BUSY_IN_PLAN: {
    code: 'R_BUSY_IN_PLAN',
    label: 'Resource Busy (Task Conflict)',
    description: 'Resource is already committed to an overlapping scheduled task with turnaround buffer.',
    category: 'assignment',
  },
  R_PRIORITY_COVERED: {
    code: 'R_PRIORITY_COVERED',
    label: 'Priority Coverage',
    description: 'Assigned to satisfy mandatory priority requirements (P1/P2 operational mandate).',
    category: 'assignment',
  },
  R_STABILITY_KEPT: {
    code: 'R_STABILITY_KEPT',
    label: 'Plan Stability Preserved',
    description: 'Maintained baseline assignment to minimize operational ripple and retasking disruption.',
    category: 'assignment',
  },
  R_TIE_BREAK: {
    code: 'R_TIE_BREAK',
    label: 'Deterministic Tie-Break',
    description: 'Deterministic tie-breaking rule applied among equally optimal candidates.',
    category: 'assignment',
  },
  R_NO_ELIGIBLE_RESOURCE: {
    code: 'R_NO_ELIGIBLE_RESOURCE',
    label: 'No Eligible Resource',
    description: 'No available resource met all technical and operational eligibility criteria.',
    category: 'explainer',
  },
  R_NO_ELIGIBLE_CREW: {
    code: 'R_NO_ELIGIBLE_CREW',
    label: 'No Eligible Crew',
    description: 'Insufficient qualified crew members available for required flight complement.',
    category: 'explainer',
  },
  R_CAPACITY_CONFLICT: {
    code: 'R_CAPACITY_CONFLICT',
    label: 'Capacity Committed to Higher Priority',
    description: 'Eligible aircraft were allocated to higher- or equal-priority tasks in the operational horizon.',
    category: 'explainer',
  },
};

export function getReasonCode(code: string): ReasonCodeMeta {
  return REASON_CODES[code] || {
    code,
    label: code,
    description: 'Operational decision rule applied.',
    category: 'explainer'
  };
}
