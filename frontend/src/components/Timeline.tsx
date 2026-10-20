import React from 'react';
import { ResourceItem, TaskItem, TaskAllocation, ConditionWindow } from '../api/mockTypes';
import { formatUtcTime, getPriorityBadgeColor } from '../lib/format';

interface TimelineProps {
  resources: ResourceItem[];
  tasks: TaskItem[];
  allocations: Record<string, TaskAllocation>;
  conditions?: ConditionWindow[];
  selectedTaskId?: string | null;
  onSelectTask: (task: TaskItem) => void;
  highlightChangedTaskId?: string | null;
  compact?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({
  resources,
  tasks,
  allocations,
  conditions = [],
  selectedTaskId,
  onSelectTask,
  highlightChangedTaskId,
  compact = false,
}) => {
  // Scenario horizon: 06:00 UTC to 18:00 UTC (720 minutes)
  const horizonStartMinutes = 6 * 60; // 360
  const totalHorizonMinutes = 12 * 60; // 720

  const getMinutesFromUtc = (iso: string): number => {
    try {
      const d = new Date(iso);
      return d.getUTCHours() * 60 + d.getUTCMinutes();
    } catch {
      return horizonStartMinutes;
    }
  };

  const getPositionStyle = (startIso: string, endIso: string) => {
    const startM = getMinutesFromUtc(startIso);
    const endM = getMinutesFromUtc(endIso);
    const offsetM = Math.max(0, startM - horizonStartMinutes);
    const durationM = Math.max(15, endM - startM);

    const leftPercent = (offsetM / totalHorizonMinutes) * 100;
    const widthPercent = (durationM / totalHorizonMinutes) * 100;

    return {
      left: `${Math.max(0, Math.min(100, leftPercent))}%`,
      width: `${Math.max(2, Math.min(100 - leftPercent, widthPercent))}%`,
    };
  };

  // Group tasks by assigned resource
  const tasksByResource: Record<string, TaskItem[]> = {};
  resources.forEach((r) => {
    tasksByResource[r.id] = [];
  });

  const unassignedTasks: TaskItem[] = [];

  tasks.forEach((task) => {
    const alloc = allocations[task.id];
    if (alloc && alloc.status === 'ASSIGNED' && alloc.resource_id && tasksByResource[alloc.resource_id]) {
      tasksByResource[alloc.resource_id].push(task);
    } else {
      unassignedTasks.push(task);
    }
  });

  // Hours ticks from 06:00 to 18:00 UTC
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  return (
    <div className="w-full bg-white border border-[#E5EAF1] rounded-lg overflow-hidden shadow-sm flex flex-col">
      {/* Time Header Scale */}
      <div className="flex border-b border-[#E5EAF1] bg-[#F8FAFC] sticky top-0 z-20">
        <div className="w-56 shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#64748B] border-r border-[#E5EAF1] flex items-center justify-between">
          <span>Airframe / Resource</span>
          <span className="text-[10px] text-[#64748B] font-mono">12 Airframes</span>
        </div>
        <div className="flex-1 relative h-9">
          {hours.map((hour, idx) => {
            const leftPercent = ((idx * 60) / totalHorizonMinutes) * 100;
            return (
              <div
                key={hour}
                className="absolute top-0 bottom-0 border-l border-[#E5EAF1] flex flex-col justify-between"
                style={{ left: `${leftPercent}%` }}
              >
                <span className="text-[10px] font-mono text-[#64748B] pl-1 pt-0.5">
                  {hour.toString().padStart(2, '0')}:00
                </span>
                <span className="h-1.5 w-px bg-[#CBD5E1]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Weather/Condition Windows indicator strip if any */}
      {conditions.length > 0 && !compact && (
        <div className="flex border-b border-[#E5EAF1] bg-amber-50/60 text-[11px]">
          <div className="w-56 shrink-0 px-4 py-1.5 text-[11px] font-mono text-amber-800 border-r border-[#E5EAF1] flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            <span>Condition Restrictions</span>
          </div>
          <div className="flex-1 relative h-7 bg-amber-50/40">
            {conditions.map((cw) => {
              const pos = getPositionStyle(cw.start_at, cw.end_at);
              return (
                <div
                  key={cw.id}
                  className="absolute top-1 bottom-1 bg-amber-100/90 border border-amber-300 rounded px-1.5 flex items-center justify-between text-[10px] font-mono text-amber-900 truncate shadow-xs"
                  style={pos}
                  title={`${cw.name}: ${cw.description} (${formatUtcTime(cw.start_at)} – ${formatUtcTime(cw.end_at)})`}
                >
                  <span className="truncate font-semibold">{cw.name}</span>
                  <span className="text-[9px] text-amber-700 hidden sm:inline ml-1">
                    [Blocks {cw.blocked_resource_types.join(', ')}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resource Rows */}
      <div className="divide-y divide-[#E5EAF1] overflow-y-auto max-h-[520px]">
        {resources.map((resource) => {
          const resTasks = tasksByResource[resource.id] || [];
          const isUnserviceable = resource.status === 'UNSERVICEABLE' || resource.status === 'IN_MAINTENANCE';

          return (
            <div
              key={resource.id}
              className={`flex transition-colors hover:bg-[#F8FAFC] ${
                isUnserviceable ? 'bg-rose-50/30' : ''
              }`}
            >
              {/* Resource Label Sidebar */}
              <div className="w-56 shrink-0 px-4 py-2.5 border-r border-[#E5EAF1] flex flex-col justify-center bg-white">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs font-semibold text-[#172B4D]">
                    {resource.id}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${
                      resource.data_status === 'STALE'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : resource.data_status === 'CONFLICT'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : isUnserviceable
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {resource.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-0.5">
                  <span className="truncate">{resource.type}</span>
                  <span className="font-mono text-[10px]">{resource.base_id.replace('BASE_', '')}</span>
                </div>
              </div>

              {/* Resource Timeline Track */}
              <div className="flex-1 relative h-12 bg-white">
                {/* Hourly grid lines */}
                {hours.map((_, idx) => {
                  const leftPercent = ((idx * 60) / totalHorizonMinutes) * 100;
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 border-l border-[#F1F5F9] pointer-events-none"
                      style={{ left: `${leftPercent}%` }}
                    />
                  );
                })}

                {/* Unserviceable overlay if applicable */}
                {isUnserviceable && (
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(225,29,72,0.04)_10px,rgba(225,29,72,0.04)_20px)] pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-rose-600 font-semibold bg-white/80 px-2 py-0.5 rounded border border-rose-200 shadow-xs">
                      Ground Hold / Unserviceable
                    </span>
                  </div>
                )}

                {/* Task Blocks placed on this resource */}
                {resTasks.map((task) => {
                  const pos = getPositionStyle(task.start_at, task.end_at);
                  const isSelected = selectedTaskId === task.id;
                  const isHighlighted = highlightChangedTaskId === task.id;
                  const colors = getPriorityBadgeColor(task.priority);

                  return (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className={`absolute top-1.5 bottom-1.5 rounded border px-2 py-0.5 cursor-pointer transition-all duration-150 flex flex-col justify-between overflow-hidden shadow-xs z-10 ${
                        isHighlighted
                          ? 'border-[#2563EB] bg-blue-50 ring-2 ring-[#2563EB]/40 shadow-sm animate-retask-glow'
                          : isSelected
                          ? 'border-[#2563EB] bg-blue-50 ring-2 ring-[#2563EB]/60 shadow-md'
                          : `${colors.bg} ${colors.border} hover:border-slate-400 hover:shadow-xs`
                      }`}
                      style={pos}
                      title={`${task.id}: ${task.name} (${formatUtcTime(task.start_at)} – ${formatUtcTime(task.end_at)}) | Priority ${task.priority}`}
                    >
                      <div className="flex items-center justify-between gap-1 leading-none">
                        <div className="flex items-center gap-1 min-w-0">
                          {/* Mini Aviation Mission Type Glyph */}
                          <svg className="w-2.5 h-2.5 text-[#2563EB] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                          </svg>
                          <span className="font-mono text-[11px] font-bold text-[#172B4D] truncate">
                            {task.id}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold px-1 rounded ${colors.text} bg-white/90 border border-current`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#475569] leading-none pt-0.5">
                        <span className="truncate">{task.task_type}</span>
                        <span className="font-mono text-[8.5px] text-[#64748B] shrink-0 pl-1 font-semibold">
                          ◈ {task.base_id.replace('BASE_', '')[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Unassigned Tasks Lane at the bottom */}
        <div className="flex bg-[#FFFBFB] border-t-2 border-[#E5EAF1]">
          <div className="w-56 shrink-0 px-4 py-3 border-r border-[#E5EAF1] flex flex-col justify-center bg-[#FFF8F8]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-800">
                UNASSIGNED TASKS
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono font-semibold">
                {unassignedTasks.length} Task
              </span>
            </div>
            <span className="text-[11px] text-[#64748B] mt-0.5">
              Capacity conflicts / Ineligible
            </span>
          </div>

          <div className="flex-1 relative h-14 bg-[#FFFBFB]">
            {hours.map((_, idx) => {
              const leftPercent = ((idx * 60) / totalHorizonMinutes) * 100;
              return (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 border-l border-[#F1F5F9] pointer-events-none"
                  style={{ left: `${leftPercent}%` }}
                />
              );
            })}

            {unassignedTasks.map((task) => {
              const pos = getPositionStyle(task.start_at, task.end_at);
              const isSelected = selectedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className={`absolute top-2 bottom-2 rounded border border-dashed border-rose-400 bg-rose-50/80 px-2 py-0.5 cursor-pointer transition-all flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? 'ring-2 ring-rose-400 bg-rose-100 border-rose-500 shadow-sm'
                      : 'hover:border-rose-500 hover:bg-rose-100/60'
                  }`}
                  style={pos}
                  title={`Unassigned: ${task.id} - ${task.name}. Click to inspect reason codes.`}
                >
                  <div className="flex items-center justify-between gap-1 leading-none">
                    <span className="font-mono text-[11px] font-bold text-rose-800 truncate">
                      {task.id} (UNASSIGNED)
                    </span>
                    <span className="text-[9px] font-bold text-rose-700 bg-white/90 border border-rose-200 px-1 rounded">
                      {task.priority}
                    </span>
                  </div>
                  <div className="text-[10px] text-rose-700 truncate leading-none">
                    {task.task_type} • {task.base_id.replace('BASE_', '')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
