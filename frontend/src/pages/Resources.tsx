import React, { useState, useEffect } from 'react';
import { mockService } from '../api/mockService';
import { ResourceItem, CrewMember } from '../api/mockTypes';
import { StatusBadge } from '../components/StatusBadge';
import { FreshnessBadge } from '../components/FreshnessBadge';
import { Timeline } from '../components/Timeline';
import { Plane, Users, Database, AlertCircle, X, Search, LayoutGrid, List, Clock } from 'lucide-react';

export const Resources: React.FC = () => {
  const [tab, setTab] = useState<'aircraft' | 'crew'>('aircraft');
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<ResourceItem | CrewMember | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    return mockService.subscribe(() => setRefreshKey((k) => k + 1));
  }, []);

  const resources = mockService.getResources();
  const crew = mockService.getCrew();
  const tasks = mockService.getTasks();
  const conditions = mockService.getConditions();
  const latestRun = mockService.getLatestRun();

  const filteredResources = resources.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.base_id.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCrew = crew.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.base_id.toLowerCase().includes(search.toLowerCase())
  );

  // Group tasks by assigned resource
  const tasksByResource: Record<string, typeof tasks> = {};
  resources.forEach((r) => {
    tasksByResource[r.id] = [];
  });
  tasks.forEach((t) => {
    const alloc = latestRun.allocations[t.id];
    if (alloc && alloc.status === 'ASSIGNED' && alloc.resource_id && tasksByResource[alloc.resource_id]) {
      tasksByResource[alloc.resource_id].push(t);
    }
  });

  return (
    <div key={refreshKey} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#172B4D]">
              Fleet Readiness & Flight Crew Registry
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold">
              12 Airframes · 18 Crew
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            Fleet coordination and airframe serviceability fused across 3 operational bases with real-time maintenance limits.
          </p>
        </div>

        {/* Tab Switcher, View Mode & Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, base, or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-[#DCE3EC] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#172B4D] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] w-44 sm:w-56 font-mono shadow-xs"
            />
          </div>

          {/* Table / Board toggle for aircraft */}
          {tab === 'aircraft' && (
            <div className="flex bg-[#F1F5F9] border border-[#DCE3EC] rounded-lg p-1">
              <button
                onClick={() => setViewMode('board')}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === 'board'
                    ? 'bg-white text-[#2563EB] shadow-xs font-bold'
                    : 'text-[#64748B] hover:text-[#172B4D]'
                }`}
                title="Fleet Command Board View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#2563EB] shadow-xs font-bold'
                    : 'text-[#64748B] hover:text-[#172B4D]'
                }`}
                title="Detailed Manifest Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex bg-[#F1F5F9] border border-[#DCE3EC] rounded-lg p-1">
            <button
              onClick={() => {
                setTab('aircraft');
                setSelectedItem(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                tab === 'aircraft'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#172B4D]'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Airframes ({resources.length})</span>
            </button>
            <button
              onClick={() => {
                setTab('crew');
                setSelectedItem(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                tab === 'crew'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#172B4D]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Flight Crew ({crew.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Fleet Content + Side Provenance Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={selectedItem ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {tab === 'aircraft' ? (
            viewMode === 'board' ? (
              /* Fleet Command Board View */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredResources.map((res) => {
                    const isSelected = selectedItem?.id === res.id;
                    const isDefective = res.data_status === 'STALE' || res.data_status === 'CONFLICT';
                    const assignedSorties = tasksByResource[res.id] || [];
                    const isUnserviceable = res.status === 'UNSERVICEABLE' || res.status === 'IN_MAINTENANCE';

                    return (
                      <div
                        key={res.id}
                        onClick={() => setSelectedItem(res)}
                        className={`bg-white border rounded-xl p-4 transition-all cursor-pointer shadow-xs space-y-3 ${
                          isSelected
                            ? 'border-[#2563EB] ring-2 ring-[#2563EB]/40 shadow-md'
                            : isUnserviceable
                            ? 'border-rose-200 bg-rose-50/20 hover:border-rose-300'
                            : isDefective
                            ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
                            : 'border-[#E5EAF1] hover:border-[#2563EB]/50 hover:shadow-sm'
                        }`}
                      >
                        {/* Airframe Card Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isUnserviceable ? 'bg-rose-100 text-rose-700' : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                            }`}>
                              {res.type.includes('Helicopter') || res.type.includes('Mi-17') ? (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 2v4M4 6h16M12 6c-3 0-5 2-5 5v4h10v-4c0-3-2-5-5-5zM7 15l-3 4h16l-3-4" />
                                </svg>
                              ) : (
                                <Plane className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-mono font-bold text-sm text-[#172B4D] flex items-center gap-1.5">
                                <span>{res.id}</span>
                                {isDefective && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                              </div>
                              <span className="text-[11px] text-[#64748B] block">{res.type}</span>
                            </div>
                          </div>
                          <StatusBadge status={res.status} size="sm" />
                        </div>

                        {/* Station & Payload Specs */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5EAF1]">
                          <div>
                            <span className="text-[#64748B] text-[10px] block">Base Station:</span>
                            <span className="font-semibold text-[#172B4D]">{res.base_id.replace('BASE_', '')}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] text-[10px] block">Capacity:</span>
                            <span className="font-semibold text-[#172B4D]">{res.payload_capacity_kg.toLocaleString()} kg</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] text-[10px] block">Maint Hours Left:</span>
                            <span className={`font-semibold ${res.hours_to_maintenance < 30 ? 'text-amber-700' : 'text-emerald-700'}`}>
                              {res.hours_to_maintenance}h
                            </span>
                          </div>
                          <div>
                            <span className="text-[#64748B] text-[10px] block">Freshness:</span>
                            <span className="text-[10px] text-[#475569]">{res.data_status}</span>
                          </div>
                        </div>

                        {/* Assigned Sorties Today */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-[#64748B] text-[10px] uppercase font-mono">
                              Assigned Sorties Today ({assignedSorties.length}):
                            </span>
                            <span className="text-[10px] font-mono text-[#64748B]">
                              {assignedSorties.length ? `${assignedSorties.reduce((acc, t) => acc + t.duration_minutes, 0)}m flight` : 'Idle'}
                            </span>
                          </div>

                          {assignedSorties.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {assignedSorties.map((t) => (
                                <span
                                  key={t.id}
                                  className="px-2 py-0.5 rounded bg-white text-[#172B4D] border border-[#DCE3EC] text-[10px] font-mono shadow-xs flex items-center gap-1 font-semibold"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                                  <span>{t.id}</span>
                                  <span className="text-[#64748B] font-normal">({t.priority})</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[11px] text-[#64748B] italic bg-[#F8FAFC] px-2 py-1 rounded border border-[#E5EAF1]">
                              {isUnserviceable ? 'Ground hold — excluded from allocation' : 'Available for immediate retasking'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Fleet Scheduling Matrix */}
                <div className="space-y-3 pt-4 border-t border-[#E5EAF1]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#172B4D] font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#2563EB]" />
                      <span>Fleet Sortie Scheduling Matrix (06:00 – 18:00 UTC)</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#64748B]">
                      12 Airframe Tracks
                    </span>
                  </div>

                  <Timeline
                    resources={resources}
                    tasks={tasks}
                    allocations={latestRun.allocations}
                    conditions={conditions}
                    selectedTaskId={null}
                    onSelectTask={(t) => {
                      const res = resources.find((r) => latestRun.allocations[t.id]?.resource_id === r.id);
                      if (res) setSelectedItem(res);
                    }}
                    compact={true}
                  />
                </div>
              </div>
            ) : (
              /* Detailed Table View */
              <div className="border border-[#E5EAF1] rounded-lg overflow-x-auto bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#475569] uppercase font-mono text-[11px] tracking-wider border-b border-[#E5EAF1]">
                    <tr>
                      <th className="py-3 px-4">Airframe ID</th>
                      <th className="py-3 px-3">Base</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Data Quality</th>
                      <th className="py-3 px-3">Freshness</th>
                      <th className="py-3 px-4">Payload / Hours Left</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1]">
                    {filteredResources.map((res) => {
                      const isSelected = selectedItem?.id === res.id;
                      const isDefective = res.data_status === 'STALE' || res.data_status === 'CONFLICT';

                      return (
                        <tr
                          key={res.id}
                          onClick={() => setSelectedItem(res)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/70 border-l-2 border-[#2563EB]'
                              : isDefective
                              ? 'bg-amber-50/50 hover:bg-amber-50/80'
                              : 'hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-[#172B4D] flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] shrink-0">
                              {res.type.includes('Helicopter') || res.type.includes('Mi-17') ? (
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 2v4M4 6h16M12 6c-3 0-5 2-5 5v4h10v-4c0-3-2-5-5-5zM7 15l-3 4h16l-3-4" />
                                </svg>
                              ) : (
                                <Plane className="w-3 h-3" />
                              )}
                            </span>
                            <span>{res.id}</span>
                            {isDefective && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                          </td>
                          <td className="py-3 px-3 font-mono text-[#475569]">
                            {res.base_id.replace('BASE_', 'Base ')}
                          </td>
                          <td className="py-3 px-3 text-[#172B4D]">{res.type}</td>
                          <td className="py-3 px-3">
                            <StatusBadge status={res.status} size="sm" />
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                                res.data_status === 'VALID'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : res.data_status === 'STALE'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {res.data_status}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <FreshnessBadge observedAt={res.observed_at} dataStatus={res.data_status} />
                          </td>
                          <td className="py-3 px-4 font-mono text-[#475569]">
                            {res.payload_capacity_kg.toLocaleString()} kg • {res.hours_to_maintenance}h
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* Crew Table View */
            <div className="border border-[#E5EAF1] rounded-lg overflow-x-auto bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#475569] uppercase font-mono text-[11px] tracking-wider border-b border-[#E5EAF1]">
                  <tr>
                    <th className="py-3 px-4">Crew ID</th>
                    <th className="py-3 px-3">Name / Role</th>
                    <th className="py-3 px-3">Base</th>
                    <th className="py-3 px-3">Type Qualifications</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Data Status</th>
                    <th className="py-3 px-4">Duty Hours Today</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAF1]">
                  {filteredCrew.map((c) => {
                    const isSelected = selectedItem?.id === c.id;
                    const isDefective = c.data_status === 'REJECTED';

                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedItem(c)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/70 border-l-2 border-[#2563EB]'
                            : isDefective
                            ? 'bg-rose-50/50 hover:bg-rose-50/80'
                            : 'hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#172B4D] flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] shrink-0">
                            <Users className="w-3 h-3" />
                          </span>
                          <span>{c.id}</span>
                          {isDefective && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                        </td>
                        <td className="py-3 px-3 text-[#172B4D] font-medium">{c.name}</td>
                        <td className="py-3 px-3 font-mono text-[#475569]">
                          {c.base_id.replace('BASE_', 'Base ')}
                        </td>
                        <td className="py-3 px-3">
                          {c.qualifications.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {c.qualifications.map((q) => (
                                <span
                                  key={q}
                                  className="px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#172B4D] border border-[#DCE3EC] text-[10px] font-mono"
                                >
                                  {q}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] font-mono text-rose-700 italic">
                              None / Missing Ingestion Field
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={c.status} size="sm" />
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                              c.data_status === 'VALID'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {c.data_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[#475569]">
                          {c.duty_hours_today}h / {c.max_duty_hours}h max
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side Panel: Provenance & Raw Record Inspector */}
        {selectedItem && (
          <div className="bg-white border border-[#E5EAF1] rounded-lg p-5 space-y-4 self-start shadow-sm">
            <div className="flex items-start justify-between pb-3 border-b border-[#E5EAF1]">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#64748B] font-semibold">
                  Provenance Inspector
                </span>
                <h3 className="text-base font-bold text-[#172B4D] font-mono mt-0.5">
                  {selectedItem.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-[#64748B] hover:text-[#172B4D] p-1 rounded hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Canonical Entity:</span>
                <span className="font-mono text-[#172B4D] font-semibold">{selectedItem.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Assigned Station:</span>
                <span className="font-mono text-[#172B4D]">{selectedItem.base_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Source Feed Adapter:</span>
                <span className="font-mono text-[#172B4D]">{selectedItem.source_system}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Observation Timestamp:</span>
                <span className="font-mono text-[#172B4D]">{selectedItem.observed_at}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Eligibility Filter Status:</span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] border ${
                    selectedItem.data_status === 'VALID'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {selectedItem.data_status === 'VALID' ? 'ELIGIBLE' : 'EXCLUDED (DATA DEFECT)'}
                </span>
              </div>
            </div>

            {/* Raw Ingestion Record Payload */}
            {selectedItem.raw_record && (
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 font-semibold">
                  <Database className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Raw Feeds Ingested</span>
                </label>
                <pre className="p-3 bg-[#F8FAFC] border border-[#E5EAF1] rounded-lg text-[10px] font-mono text-[#172B4D] overflow-x-auto leading-relaxed shadow-xs">
                  {JSON.stringify(selectedItem.raw_record, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
