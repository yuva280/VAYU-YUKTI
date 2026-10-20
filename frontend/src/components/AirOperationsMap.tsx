import React, { useState } from 'react';
import { mockService } from '../api/mockService';
import { TaskItem } from '../api/mockTypes';
import { Navigation } from 'lucide-react';

interface AirOperationsMapProps {
  onSelectTask?: (task: TaskItem) => void;
  selectedTaskId?: string | null;
}

interface DestinationNode {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  taskId: string;
}

export const AirOperationsMap: React.FC<AirOperationsMapProps> = ({
  onSelectTask,
  selectedTaskId,
}) => {
  const tasks = mockService.getTasks();
  const resources = mockService.getResources();
  const latestRun = mockService.getLatestRun();
  const activeVersion = mockService.getActiveVersion();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [activeNodeId, setActiveNodeId] = useState<string | null>(selectedTaskId || 'T-04');

  // Base coordinates on 960x440 grid
  const bases = [
    { id: 'BASE_ALPHA', name: 'Base Alpha', code: 'BA', role: 'Main Air Logistics Hub', x: 200, y: 240 },
    { id: 'BASE_BRAVO', name: 'Base Bravo', code: 'BB', role: 'Forward Rotary Base', x: 500, y: 110 },
    { id: 'BASE_CHARLIE', name: 'Base Charlie', code: 'BC', role: 'Relief & Survey Staging', x: 740, y: 310 },
  ];

  // Destination nodes linked to mock tasks
  const destinations: DestinationNode[] = [
    { id: 'MED-ALPHA', name: 'Trauma Transfer Center', type: 'Medical Clinic', x: 90, y: 120, taskId: 'T-01' },
    { id: 'VALLEY-DZ', name: 'Northern Relief Lifeline DZ', type: 'Drop Zone', x: 670, y: 60, taskId: 'T-02' },
    { id: 'FOB-LOG', name: 'Forward Outpost Logistics', type: 'Staging Hub', x: 350, y: 160, taskId: 'T-03' },
    { id: 'RELIEF-SEC4', name: 'Sector-4 Relief Lifeline', type: 'Disaster Relief DZ', x: 360, y: 320, taskId: 'T-04' },
    { id: 'COASTAL-SURV', name: 'Eastern Coastal Sector', type: 'Survey Sector', x: 870, y: 200, taskId: 'T-05' },
    { id: 'EQUIP-SHUTTLE', name: 'Equipment Forward Staging', type: 'Logistics Drop', x: 120, y: 340, taskId: 'T-06' },
    { id: 'ALPINE-EVAC', name: 'Alpine Pass Evacuation', type: 'High-Altitude Evac', x: 410, y: 60, taskId: 'T-07' },
    { id: 'TRN-ZONE1', name: 'Range Alpha Flight Corridor', type: 'Training Corridor', x: 860, y: 370, taskId: 'T-08' },
    { id: 'SHELTER-DZ', name: 'Shelter Supply Drop Point', type: 'Airdrop Point', x: 240, y: 400, taskId: 'T-09' },
    { id: 'CATCHMENT-SURV', name: 'Reservoir Flood Basin', type: 'Aerial Survey', x: 620, y: 210, taskId: 'T-10' },
    { id: 'MED-COURIER', name: 'Provincial Clinic Depot', type: 'Medical Relay', x: 820, y: 270, taskId: 'T-11' },
    { id: 'RECON-CORR', name: 'Low-Altitude Route Corridor', type: 'Survey Route', x: 580, y: 360, taskId: 'T-12' },
    { id: 'GEN-TRANSFER', name: 'Power Substation Alpha', type: 'Heavy Equipment', x: 150, y: 210, taskId: 'T-13' },
    { id: 'TRN-CHECK', name: 'Instrument Check Track', type: 'Training Track', x: 690, y: 400, taskId: 'T-14' },
  ];

  // Map task to origin base and destination coordinates
  const routes = tasks.map((t) => {
    const origin = bases.find((b) => b.id === t.base_id) || bases[0];
    const dest = destinations.find((d) => d.taskId === t.id) || {
      id: `DEST-${t.id}`,
      name: t.name,
      type: t.task_type,
      x: origin.x + 80,
      y: origin.y + 60,
      taskId: t.id,
    };

    const alloc = latestRun.allocations[t.id];
    const isAssigned = alloc && alloc.status === 'ASSIGNED';
    const isRetasked = t.id === 'T-04' && activeVersion.version_number > 1;

    // Control point for smooth curved routes
    const midX = (origin.x + dest.x) / 2;
    const midY = (origin.y + dest.y) / 2 - 25;

    return {
      task: t,
      origin,
      dest,
      path: `M ${origin.x} ${origin.y} Q ${midX} ${midY} ${dest.x} ${dest.y}`,
      alloc,
      isAssigned,
      isRetasked,
    };
  });

  const filteredRoutes = routes.filter(({ task }) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'P1') return task.priority === 'P1';
    if (filterCategory === 'RELIEF') return task.task_type === 'Relief Supply' || task.task_type === 'Medical Transfer';
    if (filterCategory === 'LOGISTICS') return task.task_type === 'Logistics Lift';
    if (filterCategory === 'SURVEY') return task.task_type === 'Survey' || task.task_type === 'Training';
    return true;
  });

  const activeTaskObj = tasks.find((t) => t.id === activeNodeId) || tasks.find((t) => t.id === 'T-04') || tasks[0];
  const activeAlloc = activeTaskObj ? latestRun.allocations[activeTaskObj.id] : null;
  const activeResource = activeAlloc && activeAlloc.resource_id ? resources.find((r) => r.id === activeAlloc.resource_id) : null;

  const handleSelectRoute = (taskId: string) => {
    setActiveNodeId(taskId);
    const selectedTask = tasks.find((t) => t.id === taskId);
    if (selectedTask && onSelectTask) {
      onSelectTask(selectedTask);
    }
  };

  return (
    <div className="w-full bg-white border border-[#E5EAF1] rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Schematic Map Header & Filter Toolbar */}
      <div className="px-4 py-3 border-b border-[#E5EAF1] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[#172B4D] font-mono">
                Synthetic Air Operations Airspace Schematic
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold">
                Advisory Operations Dashboard
              </span>
            </div>
            <span className="text-[11px] text-[#64748B]">
              Fictional operational airspace • 3 Base hubs • 14 Coordinated mission corridors
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-[#64748B] mr-1 hidden sm:inline">Filter:</span>
          {[
            { id: 'ALL', label: 'All Corridors (14)' },
            { id: 'P1', label: 'P1 Urgent (3)' },
            { id: 'RELIEF', label: 'Relief & Medical (6)' },
            { id: 'LOGISTICS', label: 'Logistics (4)' },
            { id: 'SURVEY', label: 'Survey & Training (4)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer border ${
                filterCategory === cat.id
                  ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-xs'
                  : 'bg-white text-[#475569] border-[#DCE3EC] hover:bg-[#F1F5F9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main SVG Schematic Canvas Area */}
      <div className="relative w-full bg-[#FAFCFF] overflow-hidden" style={{ minHeight: '380px' }}>
        <svg
          className="w-full h-auto select-none"
          viewBox="0 0 960 440"
          style={{ maxHeight: '420px', minHeight: '340px' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EBF0F7" strokeWidth="0.8" />
            </pattern>
            {/* Radial glow for selected bases */}
            <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="960" height="440" fill="url(#tactical-grid)" />

          {/* Coordinate Marks */}
          <g className="text-[7.5px] font-mono fill-slate-300 font-semibold select-none">
            <text x="30" y="25">34°00&apos;N / 74°00&apos;E</text>
            <text x="480" y="25">34°00&apos;N / 76°00&apos;E</text>
            <text x="860" y="25">34°00&apos;N / 78°00&apos;E</text>
            <text x="30" y="430">32°00&apos;N / 74°00&apos;E</text>
            <text x="860" y="430">32°00&apos;N / 78°00&apos;E</text>
          </g>

          {/* Condition Window Hazard Overlay: CW-01 Bravo Ridge Winds */}
          <g>
            <path
              d="M 440 60 Q 510 40 590 70 Q 580 140 510 160 Q 430 140 440 60 Z"
              fill="rgba(245, 158, 11, 0.08)"
              stroke="#F59E0B"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
            <text x="510" y="100" textAnchor="middle" className="text-[8px] font-mono font-bold fill-amber-800">
              CW-01 BRAVO RIDGE WINDS (12:00–15:00 UTC)
            </text>
            <text x="510" y="112" textAnchor="middle" className="text-[7px] font-mono fill-amber-700">
              Restricts Rotary Ingress · Evaluated by Solver
            </text>
          </g>

          {/* Flight Corridor Route Lines */}
          {filteredRoutes.map(({ task, path, isAssigned, isRetasked }) => {
            const isSelected = activeNodeId === task.id;
            let strokeColor = '#94A3B8';
            let strokeWidth = 1.2;
            let strokeDasharray = 'none';

            if (task.priority === 'P1') {
              strokeColor = '#2563EB';
              strokeWidth = isSelected ? 2.8 : 1.8;
            } else if (task.priority === 'P2') {
              strokeColor = '#0284C7';
              strokeWidth = isSelected ? 2.4 : 1.4;
            } else {
              strokeColor = '#94A3B8';
              strokeWidth = isSelected ? 2 : 1;
              strokeDasharray = '4 3';
            }

            if (!isAssigned) {
              strokeColor = '#E11D48';
              strokeDasharray = '3 3';
            }

            if (isRetasked) {
              strokeColor = '#D97706';
              strokeWidth = 2.8;
            }

            return (
              <g
                key={task.id}
                onClick={() => handleSelectRoute(task.id)}
                className="cursor-pointer transition-opacity"
                opacity={activeNodeId && !isSelected ? 0.35 : 1}
              >
                {/* Invisible wider stroke for easy clicking */}
                <path d={path} stroke="transparent" strokeWidth="14" fill="none" />

                {/* Visible Path */}
                <path
                  id={`route-${task.id}`}
                  d={path}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  fill="none"
                  className={isSelected ? 'animate-pulse' : ''}
                />

                {/* Moving Aircraft Marker along selected or P1 routes */}
                {(isSelected || isRetasked || task.priority === 'P1') && (
                  <circle r="3" fill={isRetasked ? '#D97706' : '#2563EB'}>
                    <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
                      <mpath href={`#route-${task.id}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            );
          })}

          {/* Base Hub Markers */}
          {bases.map((base) => {
            return (
              <g key={base.id} transform={`translate(${base.x}, ${base.y})`}>
                {/* Glow ring */}
                <circle cx="0" cy="0" r="28" fill="url(#hub-glow)" />
                <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
                <circle cx="0" cy="0" r="6" fill="#2563EB" />

                {/* Base Tag */}
                <g transform="translate(0, -22)">
                  <rect
                    x="-42"
                    y="-11"
                    width="84"
                    height="18"
                    rx="4"
                    fill="#1E293B"
                    className="shadow-md"
                  />
                  <text
                    x="0"
                    y="1.5"
                    textAnchor="middle"
                    className="text-[8.5px] font-mono font-bold fill-white"
                  >
                    ★ {base.name.toUpperCase()}
                  </text>
                </g>
                <text
                  x="0"
                  y="26"
                  textAnchor="middle"
                  className="text-[7.5px] font-mono font-semibold fill-slate-500"
                >
                  {base.role}
                </text>
              </g>
            );
          })}

          {/* Destination Nodes */}
          {destinations.map((dest) => {
            const task = tasks.find((t) => t.id === dest.taskId);
            if (!task) return null;
            const isSelected = activeNodeId === task.id;
            const isRetasked = task.id === 'T-04' && activeVersion.version_number > 1;

            let pinColor = '#2563EB';
            if (task.priority === 'P1') pinColor = '#DC2626';
            else if (task.priority === 'P2') pinColor = '#D97706';
            if (isRetasked) pinColor = '#D97706';

            return (
              <g
                key={dest.id}
                transform={`translate(${dest.x}, ${dest.y})`}
                onClick={() => handleSelectRoute(task.id)}
                className="cursor-pointer group"
              >
                {/* Outer ring on selection */}
                {isSelected && (
                  <circle cx="0" cy="0" r="12" fill="none" stroke={pinColor} strokeWidth="1.5" strokeDasharray="3 2" className="animate-spin" style={{ animationDuration: '6s' }} />
                )}
                <circle cx="0" cy="0" r="5" fill="#FFFFFF" stroke={pinColor} strokeWidth="1.8" />
                <circle cx="0" cy="0" r="2.5" fill={pinColor} />

                {/* Node Tag */}
                <g transform="translate(0, 12)">
                  <rect
                    x="-32"
                    y="-4"
                    width="64"
                    height="13"
                    rx="3"
                    fill={isSelected ? '#1E293B' : '#FFFFFF'}
                    stroke={isSelected ? '#1E293B' : '#DCE3EC'}
                    strokeWidth="0.8"
                  />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    className={`text-[7px] font-mono font-bold ${
                      isSelected ? 'fill-white' : 'fill-slate-700'
                    }`}
                  >
                    {dest.taskId} · {dest.name.slice(0, 10)}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Watermark Notice */}
          <text
            x="20"
            y="420"
            className="text-[9px] font-mono fill-slate-400 select-none"
          >
            SYNTHETIC AIR OPERATIONS SCHEMATIC · ADVISORY ONLY · NOT LIVE RADAR
          </text>
        </svg>

        {/* Floating Quick Inspector Card */}
        {activeTaskObj && (
          <div className="absolute bottom-3 right-3 max-w-xs sm:w-80 bg-white/95 backdrop-blur-md border border-[#E5EAF1] rounded-lg p-3.5 shadow-lg text-xs space-y-2 z-10 animate-in fade-in">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E5EAF1]">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="font-bold text-[#172B4D]">{activeTaskObj.id}</span>
                <span className="text-[10px] text-[#64748B]">({activeTaskObj.task_type})</span>
              </div>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                  activeTaskObj.priority === 'P1'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : activeTaskObj.priority === 'P2'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {activeTaskObj.priority} Priority
              </span>
            </div>

            <p className="text-[11px] text-[#172B4D] font-medium leading-tight">
              {activeTaskObj.name}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#475569] bg-[#F8FAFC] p-2 rounded border border-[#E5EAF1]">
              <div>
                <span className="text-[#64748B] block">Origin Hub:</span>
                <span className="font-semibold text-[#172B4D]">{activeTaskObj.base_id.replace('BASE_', '')}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Assigned Airframe:</span>
                <span className="font-bold text-[#2563EB]">
                  {activeAlloc?.resource_id || 'UNASSIGNED'}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Payload Req:</span>
                <span className="font-semibold text-[#172B4D]">{activeTaskObj.payload_required_kg} kg</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Assigned Crew:</span>
                <span className="font-semibold text-[#172B4D]">
                  {activeAlloc?.crew.length ? `${activeAlloc.crew.length} Member(s)` : 'None'}
                </span>
              </div>
            </div>

            {/* Special Highlight for AC-03 Reassessment in v2 */}
            {activeTaskObj.id === 'T-04' && activeVersion.version_number > 1 && (
              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[10px] font-mono text-amber-900 flex items-center justify-between">
                <span>Retasked in v2: <del className="text-slate-400">AC-03</del> ➔ <strong>AC-06</strong></span>
                <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">0 Violations</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-[10px]">
              <span className="text-[#64748B] font-mono">
                {activeResource ? `${activeResource.type} Ready` : 'Synthetic allocation'}
              </span>
              <button
                onClick={() => onSelectTask && onSelectTask(activeTaskObj)}
                className="text-[#2563EB] font-bold hover:underline cursor-pointer flex items-center gap-1 font-mono"
              >
                <span>View Full Reasoning</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Schematic Legend Bar */}
      <div className="px-4 py-2 border-t border-[#E5EAF1] bg-white flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-[#64748B]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] border border-blue-200" />
            <span className="text-[#172B4D] font-semibold">Air Logistics Hub (3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#2563EB]" />
            <span>P1 Priority Corridor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#0284C7]" />
            <span>P2 Routine Corridor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 border-dashed" />
            <span>Unassigned (Capacity Conflict)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-amber-400/60 border border-amber-500" />
            <span>CW-01 Weather Window</span>
          </div>
        </div>

        <span className="text-[10px] text-[#64748B]">
          Click any route or waypoint to inspect mission parameters
        </span>
      </div>
    </div>
  );
};
