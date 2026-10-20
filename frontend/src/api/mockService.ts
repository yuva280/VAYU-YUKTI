import {
  ResourceItem,
  CrewMember,
  TaskItem,
  ConditionWindow,
  DataQualityIssue,
  OptimisationRun,
  ScenarioVersion,
  AuditEvent,
  DiffResult,
  TaskAllocation,
} from './mockTypes';
import {
  SCENARIO_METADATA,
  INITIAL_RESOURCES,
  INITIAL_CREW,
  INITIAL_TASKS,
  INITIAL_CONDITIONS,
  INITIAL_DATA_ISSUES,
  INITIAL_VERSION_1,
  INITIAL_RUN_V1,
  INITIAL_AUDIT_LOG,
} from './mockFixtures';

// Deep clone helper to guarantee immutability
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// In-memory state holding immutable snapshots and latest data
class MockStateStore {
  metadata = deepClone(SCENARIO_METADATA);
  resources: ResourceItem[] = deepClone(INITIAL_RESOURCES);
  crew: CrewMember[] = deepClone(INITIAL_CREW);
  tasks: TaskItem[] = deepClone(INITIAL_TASKS);
  conditions: ConditionWindow[] = deepClone(INITIAL_CONDITIONS);
  dataIssues: DataQualityIssue[] = deepClone(INITIAL_DATA_ISSUES);

  // Versions collection (never mutated in place)
  versions: ScenarioVersion[] = [deepClone(INITIAL_VERSION_1)];

  // Runs collection
  runs: OptimisationRun[] = [deepClone(INITIAL_RUN_V1)];

  // Audit log (append-only)
  auditLog: AuditEvent[] = deepClone(INITIAL_AUDIT_LOG);

  // Active version ID pointer
  activeVersionId = INITIAL_VERSION_1.id;
  activeRunId = INITIAL_RUN_V1.id;

  // Listeners for reactive updates
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  reset() {
    this.metadata = deepClone(SCENARIO_METADATA);
    this.resources = deepClone(INITIAL_RESOURCES);
    this.crew = deepClone(INITIAL_CREW);
    this.tasks = deepClone(INITIAL_TASKS);
    this.conditions = deepClone(INITIAL_CONDITIONS);
    this.dataIssues = deepClone(INITIAL_DATA_ISSUES);
    this.versions = [deepClone(INITIAL_VERSION_1)];
    this.runs = [deepClone(INITIAL_RUN_V1)];

    const resetAudit = deepClone(INITIAL_AUDIT_LOG);
    const lastHash = resetAudit[resetAudit.length - 1].hash;
    resetAudit.push({
      id: `aud-reset-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Planner',
      role: 'Planner',
      action: 'SCENARIO_RESET',
      entity_type: 'scenario',
      entity_id: this.metadata.id,
      details: 'Demo scenario reset to initial deterministic seed state. Version 1 restored as active.',
      prev_hash: lastHash,
      hash: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce',
    });
    this.auditLog = resetAudit;
    this.activeVersionId = INITIAL_VERSION_1.id;
    this.activeRunId = INITIAL_RUN_V1.id;
    this.notify();
  }
}

const store = new MockStateStore();

export const mockService = {
  reset: () => store.reset(),
  subscribe: (listener: () => void) => store.subscribe(listener),

  getMetadata: () => deepClone(store.metadata),

  getResources: () => deepClone(store.resources),

  getCrew: () => deepClone(store.crew),

  getTasks: () => deepClone(store.tasks),

  getConditions: () => deepClone(store.conditions),

  getDataQualityIssues: () => deepClone(store.dataIssues),

  getVersions: () => deepClone(store.versions),

  getActiveVersion: (): ScenarioVersion => {
    const v = store.versions.find((item) => item.id === store.activeVersionId);
    return deepClone(v || store.versions[store.versions.length - 1]);
  },

  getRuns: () => deepClone(store.runs),

  getLatestRun: (): OptimisationRun => {
    return deepClone(store.runs[store.runs.length - 1]);
  },

  getRunById: (runId: string): OptimisationRun | undefined => {
    const run = store.runs.find((r) => r.id === runId);
    return run ? deepClone(run) : undefined;
  },

  getAuditLog: () => deepClone(store.auditLog),

  // Check if preset AC-03 change has already been applied
  isAC03UnserviceableApplied: (): boolean => {
    return store.versions.some((v) => v.version_number === 2);
  },

  // Apply the deterministic preset change: AC-03 -> UNSERVICEABLE
  applyPresetChangeAC03Unserviceable: (actor = 'Planner'): { version: ScenarioVersion; run: OptimisationRun } => {
    if (mockService.isAC03UnserviceableApplied()) {
      const v2 = store.versions.find((v) => v.version_number === 2)!;
      const r2 = store.runs.find((r) => r.version_id === v2.id)!;
      return { version: deepClone(v2), run: deepClone(r2) };
    }

    const prevAuditHash = store.auditLog[store.auditLog.length - 1].hash;

    // 1. Update AC-03 status in active resources
    const targetAc = store.resources.find((r) => r.id === 'AC-03');
    if (targetAc) {
      targetAc.status = 'UNSERVICEABLE';
    }

    // 2. Audit CHANGE_ACCEPTED
    const changeAuditId = `aud-change-${Date.now()}`;
    const changeHash = '3f9b2d8c1e4a506789abcdef0123456789abcdef0123456789abcdef01234567';
    store.auditLog.push({
      id: changeAuditId,
      timestamp: new Date().toISOString(),
      actor,
      role: 'Planner',
      action: 'CHANGE_ACCEPTED',
      entity_type: 'resource',
      entity_id: 'AC-03',
      details: 'Change event applied: AC-03 status changed from AVAILABLE to UNSERVICEABLE. Reassessment triggered.',
      prev_hash: prevAuditHash,
      hash: changeHash,
    });

    // 3. Create Version 2 (immutable snapshot)
    const version2: ScenarioVersion = {
      id: 'ver-v2-ac03-unserviceable',
      version_number: 2,
      scenario_id: store.metadata.id,
      created_at: new Date().toISOString(),
      created_by: actor,
      change_summary: 'AC-03 marked UNSERVICEABLE: re-solve with stability objective',
      is_snapshot: true,
      snapshot_hash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    };
    store.versions.push(version2);
    store.activeVersionId = version2.id;

    // 4. Audit VERSION_CREATED
    const versionHash = '4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123';
    store.auditLog.push({
      id: `aud-ver-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'SYSTEM_VERSIONING',
      role: 'SYSTEM',
      action: 'VERSION_CREATED',
      entity_type: 'scenario_version',
      entity_id: version2.id,
      details: 'Version 2 created. Affected task identified: T-04 (Priority Relief Lift).',
      prev_hash: changeHash,
      hash: versionHash,
    });

    // 5. Deterministic CP-SAT re-solve for Version 2:
    // Base v1 allocations are cloned; only T-04 is retasked to AC-06; all other 13 tasks remain UNCHANGED!
    const v1Run = store.runs[0];
    const newAllocations: Record<string, TaskAllocation> = deepClone(v1Run.allocations);

    // Retask T-04
    newAllocations['T-04'] = {
      task_id: 'T-04',
      status: 'ASSIGNED',
      resource_id: 'AC-06', // Reassigned from AC-03 to AC-06!
      crew: [{ crew_id: 'C-03', role: 'Commander' }, { crew_id: 'C-07', role: 'Co-Pilot' }],
      start_at: '2026-11-02T09:00:00Z',
      end_at: '2026-11-02T11:30:00Z',
      reason_codes: ['R_ELIGIBLE', 'R_PRIORITY_COVERED', 'R_STABILITY_KEPT'],
      explanation: {
        summary:
          'AC-06 assigned: AC-03 is unserviceable (maintenance feed, v2) and AC-06 is the eligible available Transport at Base Alpha with 8,200 kg capacity and 64h to maintenance.',
        reason_codes: ['R_ELIGIBLE', 'R_PRIORITY_COVERED'],
        alternatives: [
          { entity_id: 'AC-03', code: 'R_UNSERVICEABLE', detail: 'AC-03 status changed to UNSERVICEABLE in Version 2.' },
          { entity_id: 'AC-01', code: 'R_BUSY_IN_PLAN', detail: 'AC-01 committed to logistics lift T-03.' },
          { entity_id: 'AC-11', code: 'R_CONFLICTING_DATA', detail: 'AC-11 excluded from allocation due to feed conflict.' },
        ],
        binding_constraints: ['Payload >= 5200kg', 'Base Match: Base Alpha', 'Max Daily Duty: 8h'],
        data_used: [
          { entity_id: 'AC-06', source_system: 'readiness_feed', observed_at: '2026-11-02T05:45:00Z', data_status: 'VALID' },
        ],
        cause: {
          change_event_id: 'ev-ac03-unserviceable',
          summary: 'AC-03 reported unserviceable. CP-SAT stability objective preserved all other 13 task allocations.',
        },
        baseline: {
          resource_id: 'AC-03',
          crew_ids: ['C-03', 'C-07'],
        },
      },
    };

    const run2: OptimisationRun = {
      id: 'run-v2-002',
      version_id: version2.id,
      version_number: 2,
      created_at: new Date().toISOString(),
      solver_status: 'OPTIMAL',
      solve_time_ms: 388,
      violation_count: 0,
      task_coverage: {
        total: 14,
        assigned: 13,
        unassigned: 1,
        p1_coverage: '3/3 (100%)',
        p2_coverage: '4/4 (100%)',
        p3_coverage: '3/3 (100%)',
        p4_coverage: '2/2 (100%)',
        p5_coverage: '1/2 (50%)',
      },
      review_status: 'PROPOSED', // Requires Reviewer approval
      allocations: newAllocations,
    };

    store.runs.push(run2);
    store.activeRunId = run2.id;

    // 6. Audit RUN_COMPLETED
    const runHash = '5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef012345';
    store.auditLog.push({
      id: `aud-run2-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'SYSTEM_SOLVER',
      role: 'SYSTEM',
      action: 'RUN_COMPLETED',
      entity_type: 'optimisation_run',
      entity_id: run2.id,
      details:
        'Version 2 re-solve completed in 388 ms. Status: OPTIMAL. Violations: 0. Retasked 1 task (T-04 to AC-06). Stability: 100% of unaffected tasks preserved.',
      prev_hash: versionHash,
      hash: runHash,
    });

    store.notify();
    return { version: deepClone(version2), run: deepClone(run2) };
  },

  // Submit human approval or rejection (Reviewer role only)
  submitReview: (
    runId: string,
    decision: 'APPROVED' | 'REJECTED',
    comment: string,
    reviewerName = 'Reviewer'
  ): OptimisationRun => {
    const targetRun = store.runs.find((r) => r.id === runId);
    if (!targetRun) {
      throw new Error(`Run ${runId} not found`);
    }

    const prevAuditHash = store.auditLog[store.auditLog.length - 1].hash;

    if (decision === 'APPROVED') {
      // Mark any prior APPROVED run as SUPERSEDED
      store.runs.forEach((r) => {
        if (r.id !== runId && r.review_status === 'APPROVED') {
          r.review_status = 'SUPERSEDED';
          store.auditLog.push({
            id: `aud-sup-${Date.now()}-${r.id}`,
            timestamp: new Date().toISOString(),
            actor: 'SYSTEM',
            role: 'SYSTEM',
            action: 'RUN_SUPERSEDED',
            entity_type: 'optimisation_run',
            entity_id: r.id,
            details: `Run ${r.id} superseded by newly approved run ${runId}.`,
            prev_hash: prevAuditHash,
            hash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
          });
        }
      });

      targetRun.review_status = 'APPROVED';
      targetRun.reviewed_by = reviewerName;
      targetRun.reviewed_at = new Date().toISOString();
      targetRun.reviewer_comment = comment;

      store.auditLog.push({
        id: `aud-rev-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: reviewerName,
        role: 'Reviewer',
        action: 'REVIEW_APPROVED',
        entity_type: 'optimisation_run',
        entity_id: targetRun.id,
        details: `Run ${targetRun.id} (Version ${targetRun.version_number}) APPROVED by ${reviewerName}. Comment: "${comment}"`,
        prev_hash: prevAuditHash,
        hash: '8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e',
      });
    } else {
      targetRun.review_status = 'REJECTED';
      targetRun.reviewed_by = reviewerName;
      targetRun.reviewed_at = new Date().toISOString();
      targetRun.reviewer_comment = comment;

      store.auditLog.push({
        id: `aud-rev-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: reviewerName,
        role: 'Reviewer',
        action: 'REVIEW_REJECTED',
        entity_type: 'optimisation_run',
        entity_id: targetRun.id,
        details: `Run ${targetRun.id} REJECTED by ${reviewerName}. Comment: "${comment}"`,
        prev_hash: prevAuditHash,
        hash: '9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
      });
    }

    store.notify();
    return deepClone(targetRun);
  },

  // Compute deterministic diff between baseline run and proposed run
  getDiff: (baselineRunId: string, proposedRunId: string): DiffResult => {
    const baseRun = store.runs.find((r) => r.id === baselineRunId) || store.runs[0];
    const propRun = store.runs.find((r) => r.id === proposedRunId) || store.runs[store.runs.length - 1];

    const tasks = store.tasks;
    let tasksChangedCount = 0;
    let unaffectedChangedCount = 0;

    const diffTasks = tasks.map((task) => {
      const bAlloc = baseRun.allocations[task.id];
      const pAlloc = propRun.allocations[task.id];

      const bRes = bAlloc?.resource_id || null;
      const pRes = pAlloc?.resource_id || null;
      const bCrew = bAlloc?.crew?.map((c) => c.crew_id) || [];
      const pCrew = pAlloc?.crew?.map((c) => c.crew_id) || [];

      const isChanged = bRes !== pRes || bAlloc?.status !== pAlloc?.status;
      const isAffectedDirectly = task.id === 'T-04'; // T-04 was directly affected by AC-03 going unserviceable

      let category: 'UNCHANGED' | 'REASSIGNED' | 'NEWLY_ASSIGNED' | 'UNASSIGNED' = 'UNCHANGED';
      if (isChanged) {
        tasksChangedCount++;
        if (!isAffectedDirectly) {
          unaffectedChangedCount++;
        }
        if (bAlloc?.status === 'ASSIGNED' && pAlloc?.status === 'ASSIGNED' && bRes !== pRes) {
          category = 'REASSIGNED';
        } else if (bAlloc?.status === 'UNASSIGNED' && pAlloc?.status === 'ASSIGNED') {
          category = 'NEWLY_ASSIGNED';
        } else if (pAlloc?.status === 'UNASSIGNED') {
          category = 'UNASSIGNED';
        }
      }

      const cause = isAffectedDirectly
        ? 'Direct impact: Resource AC-03 became UNSERVICEABLE. Replaced with AC-06.'
        : 'Preserved by CP-SAT plan stability objective';

      return {
        task_id: task.id,
        task_name: task.name,
        priority: task.priority,
        start_at: task.start_at,
        end_at: task.end_at,
        base_id: task.base_id,
        status_before: bAlloc ? bAlloc.status : 'UNASSIGNED',
        resource_before: bRes,
        crew_before: bCrew,
        status_after: pAlloc ? pAlloc.status : 'UNASSIGNED',
        resource_after: pRes,
        crew_after: pCrew,
        change_category: category,
        is_affected_directly: isAffectedDirectly,
        cause,
        explanation_summary: pAlloc?.explanation?.summary || 'No allocation computed',
      };
    });

    const totalUnaffected = tasks.length - 1; // 13 tasks were outside the affected set
    const stabilityPercentage = Math.round(((totalUnaffected - unaffectedChangedCount) / totalUnaffected) * 100);

    return {
      baseline_version_number: baseRun.version_number,
      proposed_version_number: propRun.version_number,
      baseline_run_id: baseRun.id,
      proposed_run_id: propRun.id,
      total_tasks: tasks.length,
      tasks_changed_count: tasksChangedCount,
      unaffected_tasks_changed_count: unaffectedChangedCount,
      stability_percentage: stabilityPercentage,
      tasks: diffTasks,
    };
  },
};
