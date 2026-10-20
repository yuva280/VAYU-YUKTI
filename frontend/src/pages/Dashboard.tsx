import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../api/mockService';
import { KpiTile } from '../components/KpiTile';
import { Timeline } from '../components/Timeline';
import { AirOperationsMap } from '../components/AirOperationsMap';
import { ExplanationDrawer } from '../components/ExplanationDrawer';
import { RadarWidget } from '../components/RadarWidget';
import { FlightRouteVisual } from '../components/FlightRouteVisual';
import { TaskItem } from '../api/mockTypes';
import { useRole } from '../app/RoleContext';
import {
  Plane,
  Users,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  Activity,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isPlanner } = useRole();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    return mockService.subscribe(() => setRefreshKey((k) => k + 1));
  }, []);

  const resources = mockService.getResources();
  const crew = mockService.getCrew();
  const tasks = mockService.getTasks();
  const conditions = mockService.getConditions();
  const dataIssues = mockService.getDataQualityIssues();
  const latestRun = mockService.getLatestRun();
  const activeVersion = mockService.getActiveVersion();
  const auditLog = mockService.getAuditLog();

  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const availableResources = resources.filter((r) => r.status === 'AVAILABLE' && r.data_status !== 'STALE' && r.data_status !== 'CONFLICT').length;
  const availableCrew = crew.filter((c) => c.status === 'AVAILABLE' && c.data_status === 'VALID').length;

  const handleSelectTask = (task: TaskItem) => {
    setSelectedTask(task);
  };

  const recentAudits = auditLog.slice(-3).reverse();

  return (
    <div key={refreshKey} className="space-y-6">
      {/* Page Header with Aviation Branding & Flight Route */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            {/* Aerospace Aircraft SVG Silhouette Emblem */}
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] shadow-xs shrink-0">
              <svg className="w-5 h-5 text-[#2563EB]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#172B4D]">
                  Air Operations Command & Resource Optimisation
                </h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold">
                  v{activeVersion.version_number} Active
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Unified operational picture across 3 bases. Synthetic decision-support solver under deterministic hard constraints.
              </p>
            </div>
          </div>
        </div>

        {/* Corridor Waypoints & Action Button */}
        <div className="flex items-center gap-3">
          <FlightRouteVisual />

          {mockService.isAC03UnserviceableApplied() ? (
            <button
              onClick={() => navigate('/compare')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Inspect Version 1 vs 2 Diff</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/scenario')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>{isPlanner ? 'Inject Demo Change (AC-03)' : 'Inspect Demo Scenario'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Row of 6 KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiTile
          label="Airframes Available"
          value={`${availableResources}/${resources.length}`}
          subValue="2 excluded by validation"
          icon={<Plane className="w-4 h-4 text-[#2563EB]" />}
          badge={{ text: '10 Ready', variant: 'success' }}
          onClick={() => navigate('/resources')}
        />
        <KpiTile
          label="Flight Crew Ready"
          value={`${availableCrew}/${crew.length}`}
          subValue="1 rejected (C-18 defect)"
          icon={<Users className="w-4 h-4 text-[#2563EB]" />}
          badge={{ text: '17 Ready', variant: 'success' }}
          onClick={() => navigate('/resources')}
        />
        <KpiTile
          label="Priority Task Coverage"
          value="100%"
          subValue="P1 (3/3) • P2 (4/4)"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          badge={{ text: '0 Breaches', variant: 'success' }}
          onClick={() => navigate('/plan')}
        />
        <KpiTile
          label="Data Quality Issues"
          value={dataIssues.length}
          subValue="1 Stale • 1 Conflict • 1 Schema"
          icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
          badge={{ text: 'Excluded', variant: 'danger' }}
          onClick={() => navigate('/data-quality')}
        />
        <KpiTile
          label="CP-SAT Solver Status"
          value={latestRun.solver_status}
          subValue={`Solve time: ${latestRun.solve_time_ms} ms`}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          badge={{ text: '0 Violations', variant: 'success' }}
          onClick={() => navigate('/plan')}
        />
        <KpiTile
          label="Governance Review"
          value={latestRun.review_status}
          subValue={latestRun.review_status === 'PROPOSED' ? 'Sign-off needed' : 'Authorized'}
          icon={<ShieldAlert className="w-4 h-4 text-amber-600" />}
          badge={{
            text: latestRun.review_status,
            variant: latestRun.review_status === 'APPROVED' ? 'success' : 'warning',
          }}
          onClick={() => navigate('/review')}
        />
      </div>

      {/* Prominent Command Centre Centerpiece: Air Operations Schematic Map */}
      <AirOperationsMap
        onSelectTask={handleSelectTask}
        selectedTaskId={selectedTask?.id}
      />

      {/* Main Grid: Compact Timeline + Side Alert Feed & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Compact Timeline Section & Recent Decision Feed */}
        <div className="lg:col-span-3 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#172B4D] font-mono">
                  Active Operational Timeline (06:00 – 18:00 UTC)
                </h2>
                <span className="text-xs text-[#64748B] font-mono">
                  Click any task block to inspect decision reasons
                </span>
              </div>
              <button
                onClick={() => navigate('/plan')}
                className="text-xs font-mono text-[#2563EB] hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Full Plan View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <Timeline
              resources={resources}
              tasks={tasks}
              allocations={latestRun.allocations}
              conditions={conditions}
              selectedTaskId={selectedTask?.id}
              onSelectTask={handleSelectTask}
              compact={true}
            />
          </div>

          {/* Recent Decision Activity Strip */}
          <div className="bg-white border border-[#E5EAF1] rounded-lg p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#172B4D] font-semibold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#2563EB]" />
                <span>Recent Governance & Optimization Events</span>
              </span>
              <button
                onClick={() => navigate('/audit')}
                className="text-xs font-mono text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <span>View Full Hash Ledger</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {recentAudits.map((event) => (
                <div
                  key={event.id}
                  className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] space-y-1"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-bold text-[#172B4D]">{event.id}</span>
                    <span className="text-slate-400">{new Date(event.timestamp).toLocaleTimeString()} UTC</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {event.action}
                    </span>
                    <span className="text-[#64748B] text-[10px] truncate">Actor: {event.actor}</span>
                  </div>
                  <p className="text-[11px] text-[#475569] line-clamp-1">
                    {event.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel: Radar Widget + Ingestion Quality & Unassigned Alerts */}
        <div className="space-y-4">
          {/* Compact Synthetic Radar Widget */}
          <RadarWidget />

          <div className="bg-white border border-[#E5EAF1] rounded-lg p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#172B4D] font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pre-Solver Quality Gate</span>
              </span>
              <span className="text-[11px] font-mono text-[#64748B] bg-slate-100 px-1.5 py-0.5 rounded">3 Defect Flags</span>
            </div>

            <div className="space-y-2 text-xs">
              {dataIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => navigate('/data-quality')}
                  className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] hover:border-[#2563EB] transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-[#172B4D]">{issue.entity_id}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${
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
                  <p className="text-[11px] text-[#475569] line-clamp-2 leading-relaxed">
                    {issue.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Unassigned Task Explanation Spotlight */}
          <div className="bg-white border border-[#E5EAF1] rounded-lg p-4 space-y-2 shadow-sm">
            <span className="text-xs font-mono uppercase tracking-wider text-[#172B4D] font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#64748B]" />
              <span>Unassigned Task Rationale</span>
            </span>
            <div
              onClick={() => {
                const t12 = tasks.find((t) => t.id === 'T-12');
                if (t12) setSelectedTask(t12);
              }}
              className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 hover:border-rose-400 transition-colors cursor-pointer text-xs space-y-1 shadow-xs"
            >
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-rose-900">T-12 (P5 Recon)</span>
                <span className="text-[10px] text-rose-700 bg-white border border-rose-200 px-1.5 py-0.5 rounded font-semibold">R_CAPACITY_CONFLICT</span>
              </div>
              <p className="text-[11px] text-rose-950/80 leading-snug">
                Helicopters at Base Bravo fully committed to P1 Relief Lifeline (T-02) and P2 Mountain Evacuation (T-07).
              </p>
              <div className="text-[10px] text-[#2563EB] font-mono pt-1 font-semibold">Click to view mathematical proof in drawer →</div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Drawer when task is clicked */}
      <ExplanationDrawer
        task={selectedTask}
        allocation={selectedTask ? latestRun.allocations[selectedTask.id] || null : null}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};
