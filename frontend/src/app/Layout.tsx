import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useRole } from './RoleContext';
import { mockService } from '../api/mockService';
import {
  LayoutDashboard,
  Plane,
  AlertTriangle,
  GitBranch,
  Calendar,
  ArrowRightLeft,
  ShieldCheck,
  History,
  RotateCcw,
  Clock,
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { role, setRole, isPlanner, isReviewer } = useRole();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    return mockService.subscribe(() => setRefreshKey((k) => k + 1));
  }, []);

  const activeVersion = mockService.getActiveVersion();
  const latestRun = mockService.getLatestRun();
  const dataIssues = mockService.getDataQualityIssues();

  const handleResetDemo = () => {
    if (window.confirm('Reset demo to baseline seed state (Version 1)?')) {
      mockService.reset();
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Resources & Crew', path: '/resources', icon: Plane },
    {
      name: 'Data Quality',
      path: '/data-quality',
      icon: AlertTriangle,
      badge: dataIssues.length > 0 ? `${dataIssues.length}` : undefined,
      badgeVariant: 'danger',
    },
    { name: 'Scenario & Changes', path: '/scenario', icon: GitBranch },
    { name: 'Plan Timeline', path: '/plan', icon: Calendar },
    {
      name: 'Compare & Diff',
      path: '/compare',
      icon: ArrowRightLeft,
      badge: activeVersion.version_number > 1 ? 'v1 vs v2' : undefined,
      badgeVariant: 'warning',
    },
    {
      name: 'Review & Sign-Off',
      path: '/review',
      icon: ShieldCheck,
      badge: latestRun.review_status === 'PROPOSED' ? 'Needs Review' : undefined,
      badgeVariant: 'warning',
    },
    { name: 'Audit & History', path: '/audit', icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-[#172B4D] font-sans antialiased">
      {/* Permanent Mandatory Synthetic / Advisory Banner */}
      <div
        id="synthetic-advisory-banner"
        className="w-full bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px] font-bold uppercase tracking-wider text-center py-1.5 px-4 select-none z-50 flex items-center justify-center gap-2 shadow-xs"
      >
        <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse shrink-0" />
        <span>Synthetic data · advisory only · not connected to any real system</span>
      </div>

      {/* Top Application Bar */}
      <header className="h-16 border-b border-[#E5EAF1] bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold tracking-tight shadow-xs font-mono text-sm">
              VY
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-[#172B4D] text-sm">
                  VAYU-YUKTI
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 uppercase font-semibold">
                  Air Operations Planning
                </span>
              </div>
              <div className="text-[11px] text-[#64748B] font-mono flex items-center gap-2">
                <span>Dynamic Air Operations & Resource Optimisation</span>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-3 pl-4 border-l border-[#E5EAF1] font-mono text-xs">
            <span className="text-[#64748B] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#64748B]" />
              <span>as_of: 06:00 UTC</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#DCE3EC]">
              v{activeVersion.version_number} Active
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>CP-SAT {latestRun.solver_status} (0 Violations)</span>
            </span>
          </div>
        </div>

        {/* Right Header Controls: Demo Role Switcher & Reset */}
        <div className="flex items-center gap-3">
          {/* Demo-Only Role Switcher */}
          <div className="flex items-center gap-1.5 bg-[#F1F5F9] border border-[#DCE3EC] rounded-lg p-1">
            <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider pl-2 hidden sm:inline font-semibold">
              Role ({role}):
            </span>
            <button
              onClick={() => setRole('Planner')}
              className={`px-3 py-1 rounded text-xs font-semibold font-mono transition-colors cursor-pointer ${
                isPlanner
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#172B4D]'
              }`}
              title="Planner: Can create changes and solve proposals (approval restricted)"
            >
              Planner
            </button>
            <button
              onClick={() => setRole('Reviewer')}
              className={`px-3 py-1 rounded text-xs font-semibold font-mono transition-colors cursor-pointer ${
                isReviewer
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#172B4D]'
              }`}
              title="Reviewer: Authorised to approve or reject proposed operational plans"
            >
              Reviewer
            </button>
          </div>

          {/* Quick Reset Demo button */}
          <button
            onClick={handleResetDemo}
            className="p-2 rounded-lg bg-white hover:bg-[#F1F5F9] border border-[#DCE3EC] text-amber-700 transition-colors cursor-pointer shadow-xs"
            title="Reset demo scenario to baseline (Version 1)"
          >
            <RotateCcw className="w-4 h-4 text-amber-700" />
          </button>
        </div>
      </header>

      {/* Body with Sidebar and Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-60 shrink-0 bg-white border-r border-[#E5EAF1] flex flex-col justify-between py-4 shadow-xs">
          <nav className="space-y-1 px-3">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#64748B] font-semibold mb-1">
              Operational Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#EFF6FF] text-[#2563EB] shadow-xs font-semibold border-l-2 border-[#2563EB]'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#172B4D]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 text-current" />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold border ${
                        item.badgeVariant === 'danger'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Footer Info */}
          <div className="px-4 py-3 border-t border-[#E5EAF1] mx-2 text-[11px] font-mono text-[#64748B] space-y-1">
            <div className="flex items-center justify-between font-medium">
              <span>Bases: Alpha/Bravo/Charlie</span>
            </div>
            <div className="text-[10px] text-[#64748B]">
              Deterministic CP-SAT Solver
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main key={refreshKey} className="flex-1 overflow-y-auto p-6 bg-[#F7F9FC]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
