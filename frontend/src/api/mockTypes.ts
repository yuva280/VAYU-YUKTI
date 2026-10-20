export type AircraftType = 'Transport' | 'Utility Helicopter' | 'Light Utility';
export type ResourceStatus = 'AVAILABLE' | 'UNSERVICEABLE' | 'IN_MAINTENANCE';
export type DataStatus = 'VALID' | 'WARNING' | 'STALE' | 'CONFLICT' | 'REJECTED';
export type PriorityLevel = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
export type DemoRole = 'Planner' | 'Reviewer';
export type RunReviewStatus = 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';

export interface ResourceItem {
  id: string;
  name: string;
  base_id: string;
  type: AircraftType;
  status: ResourceStatus;
  payload_capacity_kg: number;
  hours_to_maintenance: number;
  data_status: DataStatus;
  observed_at: string;
  source_system: string;
  raw_record?: Record<string, any>;
}

export interface CrewMember {
  id: string;
  name: string;
  base_id: string;
  qualifications: AircraftType[];
  duty_hours_today: number;
  max_duty_hours: number;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  data_status: DataStatus;
  observed_at: string;
  source_system: string;
  raw_record?: Record<string, any>;
}

export interface TaskItem {
  id: string;
  name: string;
  task_type: string;
  base_id: string;
  start_at: string;
  end_at: string;
  duration_minutes: number;
  priority: PriorityLevel;
  required_resource_type: AircraftType;
  required_crew_count: number;
  payload_required_kg: number;
}

export interface ConditionWindow {
  id: string;
  base_id: string;
  name: string;
  description: string;
  blocked_resource_types: AircraftType[];
  start_at: string;
  end_at: string;
  severity: 'WARNING' | 'CRITICAL';
}

export interface DataQualityIssue {
  id: string;
  entity_type: 'resource' | 'crew' | 'task' | 'condition';
  entity_id: string;
  field: string;
  severity: 'CRITICAL' | 'WARNING';
  issue_type: 'STALE' | 'CONFLICT' | 'MISSING_FIELD';
  message: string;
  detected_at: string;
  raw_record: Record<string, any>;
  excluded_from_allocation: boolean;
}

export interface AllocationAlternative {
  entity_id: string;
  code: string;
  detail: string;
}

export interface AllocationDataUsed {
  entity_id: string;
  source_system: string;
  observed_at: string;
  data_status: DataStatus;
}

export interface AllocationExplanation {
  summary: string;
  reason_codes: string[];
  alternatives: AllocationAlternative[];
  binding_constraints: string[];
  data_used: AllocationDataUsed[];
  cause: {
    change_event_id: string;
    summary: string;
  } | null;
  baseline: {
    resource_id: string;
    crew_ids: string[];
  } | null;
}

export interface TaskAllocation {
  task_id: string;
  status: 'ASSIGNED' | 'UNASSIGNED';
  resource_id: string | null;
  crew: Array<{ crew_id: string; role: string }>;
  start_at: string;
  end_at: string;
  reason_codes: string[];
  explanation: AllocationExplanation;
}

export interface ScenarioVersion {
  id: string;
  version_number: number;
  scenario_id: string;
  created_at: string;
  created_by: string;
  change_summary: string;
  is_snapshot: boolean;
  snapshot_hash: string;
}

export interface TaskCoverageStats {
  total: number;
  assigned: number;
  unassigned: number;
  p1_coverage: string;
  p2_coverage: string;
  p3_coverage: string;
  p4_coverage: string;
  p5_coverage: string;
}

export interface OptimisationRun {
  id: string;
  version_id: string;
  version_number: number;
  created_at: string;
  solver_status: 'OPTIMAL' | 'FEASIBLE' | 'INFEASIBLE';
  solve_time_ms: number;
  violation_count: number;
  task_coverage: TaskCoverageStats;
  allocations: Record<string, TaskAllocation>;
  review_status: RunReviewStatus;
  reviewer_comment?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: DemoRole | 'SYSTEM';
  action:
    | 'SCENARIO_CREATED'
    | 'INGESTED'
    | 'QUALITY_ISSUES_DETECTED'
    | 'RUN_STARTED'
    | 'RUN_COMPLETED'
    | 'CHANGE_ACCEPTED'
    | 'VERSION_CREATED'
    | 'REVIEW_APPROVED'
    | 'REVIEW_REJECTED'
    | 'RUN_SUPERSEDED'
    | 'SCENARIO_RESET';
  entity_type: string;
  entity_id: string;
  details: string;
  prev_hash: string;
  hash: string;
}

export interface DiffTaskItem {
  task_id: string;
  task_name: string;
  priority: PriorityLevel;
  start_at: string;
  end_at: string;
  base_id: string;
  status_before: 'ASSIGNED' | 'UNASSIGNED';
  resource_before: string | null;
  crew_before: string[];
  status_after: 'ASSIGNED' | 'UNASSIGNED';
  resource_after: string | null;
  crew_after: string[];
  change_category: 'UNCHANGED' | 'REASSIGNED' | 'NEWLY_ASSIGNED' | 'UNASSIGNED';
  is_affected_directly: boolean;
  cause: string;
  explanation_summary: string;
}

export interface DiffResult {
  baseline_version_number: number;
  proposed_version_number: number;
  baseline_run_id: string;
  proposed_run_id: string;
  total_tasks: number;
  tasks_changed_count: number;
  unaffected_tasks_changed_count: number;
  stability_percentage: number;
  tasks: DiffTaskItem[];
}
