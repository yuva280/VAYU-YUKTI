import React from 'react';
import { Radio } from 'lucide-react';

export const RadarWidget: React.FC = () => {
  return (
    <div className="bg-white border border-[#E5EAF1] rounded-lg p-3 shadow-sm flex flex-col items-center justify-between">
      {/* Header with Title and Mode */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-[#E5EAF1]">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-[#2563EB]" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#172B4D]">
            Sector Airspace Status
          </span>
        </div>
        <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-emerald-600 animate-ping" />
          3 Bases Sync
        </span>
      </div>

      {/* Radar Visual Container */}
      <div className="relative w-36 h-36 my-2 flex items-center justify-center">
        {/* Radar Concentric Rings & Crosshairs Background */}
        <svg className="absolute inset-0 w-full h-full text-[#E2E8F0]" viewBox="0 0 144 144">
          {/* Outer circle */}
          <circle cx="72" cy="72" r="68" fill="#F8FAFC" stroke="currentColor" strokeWidth="1" />
          {/* Middle circle */}
          <circle cx="72" cy="72" r="46" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          {/* Inner circle */}
          <circle cx="72" cy="72" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* Center bullseye */}
          <circle cx="72" cy="72" r="2.5" fill="#2563EB" />

          {/* Crosshairs */}
          <line x1="72" y1="4" x2="72" y2="140" stroke="currentColor" strokeWidth="0.8" />
          <line x1="4" y1="72" x2="140" y2="72" stroke="currentColor" strokeWidth="0.8" />

          {/* Compass labels */}
          <text x="72" y="11" textAnchor="middle" className="text-[7px] font-mono fill-slate-400 font-semibold">N</text>
          <text x="136" y="74.5" textAnchor="end" className="text-[7px] font-mono fill-slate-400 font-semibold">E</text>
          <text x="72" y="139" textAnchor="middle" className="text-[7px] font-mono fill-slate-400 font-semibold">S</text>
          <text x="8" y="74.5" textAnchor="start" className="text-[7px] font-mono fill-slate-400 font-semibold">W</text>
        </svg>

        {/* Rotating Scanner Cone */}
        <div
          className="absolute inset-2 rounded-full overflow-hidden pointer-events-none animate-radar"
          style={{ transformOrigin: 'center center' }}
        >
          <div
            className="w-full h-full"
            style={{
              background: 'conic-gradient(from 0deg, rgba(37, 99, 235, 0.22) 0deg, rgba(37, 99, 235, 0.04) 45deg, transparent 60deg, transparent 360deg)',
            }}
          />
        </div>

        {/* Base Alpha Marker */}
        <div
          className="absolute flex items-center gap-1 pointer-events-none"
          style={{ left: '26px', top: '34px' }}
          title="Base Alpha (Western Sector)"
        >
          <span className="w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-blue-100 shadow-xs" />
          <span className="text-[8px] font-mono font-bold text-[#172B4D] bg-white/90 px-1 rounded border border-slate-200">
            A:ALPHA
          </span>
        </div>

        {/* Base Bravo Marker */}
        <div
          className="absolute flex items-center gap-1 pointer-events-none"
          style={{ right: '22px', top: '56px' }}
          title="Base Bravo (Northern Sector)"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-emerald-100 shadow-xs" />
          <span className="text-[8px] font-mono font-bold text-[#172B4D] bg-white/90 px-1 rounded border border-slate-200">
            B:BRAVO
          </span>
        </div>

        {/* Base Charlie Marker */}
        <div
          className="absolute flex items-center gap-1 pointer-events-none"
          style={{ right: '32px', bottom: '26px' }}
          title="Base Charlie (Southern Sector)"
        >
          <span className="w-2 h-2 rounded-full bg-amber-600 ring-2 ring-amber-100 shadow-xs" />
          <span className="text-[8px] font-mono font-bold text-[#172B4D] bg-white/90 px-1 rounded border border-slate-200">
            C:CHARLIE
          </span>
        </div>
      </div>

      {/* Mandatory Disclaimer Label */}
      <div className="w-full text-center pt-1.5 border-t border-[#E5EAF1]">
        <span className="text-[9px] font-mono text-[#64748B] block leading-tight">
          Synthetic status visualization
        </span>
        <span className="text-[8px] font-mono text-slate-400 block uppercase tracking-wider">
          Not live tracking · advisory only
        </span>
      </div>
    </div>
  );
};
