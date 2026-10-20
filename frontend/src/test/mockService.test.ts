import { describe, it, expect, beforeEach } from 'vitest';
import { mockService } from '../api/mockService';

describe('VAYU-YUKTI Mock Service & Domain Logic (FE-4 – FE-10)', () => {
  beforeEach(() => {
    mockService.reset();
  });

  it('FE-4: initializes seeded data quality defects with excluded status', () => {
    const issues = mockService.getDataQualityIssues();
    expect(issues).toHaveLength(3);

    const ac09 = issues.find((i) => i.entity_id === 'AC-09');
    expect(ac09?.issue_type).toBe('STALE');
    expect(ac09?.excluded_from_allocation).toBe(true);

    const ac11 = issues.find((i) => i.entity_id === 'AC-11');
    expect(ac11?.issue_type).toBe('CONFLICT');
    expect(ac11?.excluded_from_allocation).toBe(true);

    const c18 = issues.find((i) => i.entity_id === 'C-18');
    expect(c18?.issue_type).toBe('MISSING_FIELD');
    expect(c18?.excluded_from_allocation).toBe(true);
  });

  it('FE-5: baseline plan v1 assigns P1 tasks and includes reason codes for all allocations', () => {
    const latestRun = mockService.getLatestRun();
    expect(latestRun.version_number).toBe(1);
    expect(latestRun.solver_status).toBe('OPTIMAL');
    expect(latestRun.violation_count).toBe(0);

    const t04Alloc = latestRun.allocations['T-04'];
    expect(t04Alloc.status).toBe('ASSIGNED');
    expect(t04Alloc.resource_id).toBe('AC-03');
    expect(t04Alloc.reason_codes.length).toBeGreaterThan(0);
    expect(t04Alloc.explanation.summary).toBeTruthy();

    const t12Alloc = latestRun.allocations['T-12'];
    expect(t12Alloc.status).toBe('UNASSIGNED');
    expect(t12Alloc.reason_codes).toContain('R_CAPACITY_CONFLICT');
  });

  it('FE-6: AC-03 preset change creates version 2 while keeping version 1 immutable', () => {
    const v1Before = mockService.getVersions()[0];
    const run1Before = mockService.getRuns()[0];

    const { version, run } = mockService.applyPresetChangeAC03Unserviceable('Planner');

    expect(version.version_number).toBe(2);
    expect(run.version_number).toBe(2);
    expect(run.solver_status).toBe('OPTIMAL');
    expect(run.violation_count).toBe(0);

    // In version 2, T-04 is retasked to AC-06
    expect(run.allocations['T-04'].resource_id).toBe('AC-06');
    expect(run.allocations['T-04'].explanation.cause).toBeTruthy();

    // Version 1 snapshot and Run 1 remain byte-identical and unchanged
    const v1After = mockService.getVersions()[0];
    const run1After = mockService.getRuns()[0];
    expect(v1After.snapshot_hash).toBe(v1Before.snapshot_hash);
    expect(run1After.allocations['T-04'].resource_id).toBe(run1Before.allocations['T-04'].resource_id);
    expect(run1After.allocations['T-04'].resource_id).toBe('AC-03');
  });

  it('FE-7: compare diff accurately computes stability and unaffected tasks', () => {
    mockService.applyPresetChangeAC03Unserviceable('Planner');
    const runs = mockService.getRuns();
    const diff = mockService.getDiff(runs[0].id, runs[1].id);

    expect(diff.tasks_changed_count).toBe(1); // Only T-04 changed
    expect(diff.unaffected_tasks_changed_count).toBe(0); // 0 unaffected tasks changed
    expect(diff.stability_percentage).toBe(100); // 100% plan stability
  });

  it('FE-8 & FE-9: Reviewer can approve and update previous approved run to SUPERSEDED', () => {
    mockService.applyPresetChangeAC03Unserviceable('Planner');
    const runs = mockService.getRuns();
    const run2 = runs[1];

    expect(run2.review_status).toBe('PROPOSED');

    const updated = mockService.submitReview(
      run2.id,
      'APPROVED',
      'Approved retasking of T-04 to AC-06.',
      'Reviewer Lead'
    );

    expect(updated.review_status).toBe('APPROVED');

    // Run 1 is now SUPERSEDED
    const run1After = mockService.getRuns()[0];
    expect(run1After.review_status).toBe('SUPERSEDED');

    // Audit log records REVIEW_APPROVED
    const audit = mockService.getAuditLog();
    const lastEvent = audit[audit.length - 1];
    expect(lastEvent.action).toBe('REVIEW_APPROVED');
    expect(lastEvent.role).toBe('Reviewer');
  });

  it('FE-10: reset restores initial deterministic state', () => {
    mockService.applyPresetChangeAC03Unserviceable('Planner');
    expect(mockService.getVersions().length).toBe(2);

    mockService.reset();

    expect(mockService.getVersions().length).toBe(1);
    expect(mockService.getRuns().length).toBe(1);
    expect(mockService.getLatestRun().allocations['T-04'].resource_id).toBe('AC-03');
    expect(mockService.isAC03UnserviceableApplied()).toBe(false);
  });
});
