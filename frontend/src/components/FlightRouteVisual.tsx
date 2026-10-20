import React from 'react';

export const FlightRouteVisual: React.FC = () => {
  return (
    <div
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E5EAF1] shadow-xs"
      title="Synthetic Corridor Waypoints: Alpha → Bravo → Charlie"
    >
      <div className="flex flex-col">
        <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-[#64748B]">
          Active Air Corridor
        </span>
        <span className="text-[10px] font-mono font-bold text-[#172B4D]">
          ALPHA ➔ BRAVO ➔ CHARLIE
        </span>
      </div>

      {/* Animated SVG Flight Route with moving aircraft */}
      <svg className="w-48 h-8 overflow-visible" viewBox="0 0 192 32" fill="none">
        {/* Flight Route Curve */}
        <path
          id="flight-route-path"
          d="M 12 22 Q 60 4 100 18 T 180 12"
          stroke="#93C5FD"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          fill="none"
        />

        {/* Waypoint 1 (Alpha) */}
        <circle cx="12" cy="22" r="3.5" fill="#2563EB" />
        <circle cx="12" cy="22" r="6" stroke="#93C5FD" strokeWidth="1" opacity="0.6" />
        <text x="12" y="31" textAnchor="middle" className="text-[6.5px] font-mono font-bold fill-[#64748B]">ALPHA</text>

        {/* Waypoint 2 (Bravo) */}
        <circle cx="100" cy="18" r="3" fill="#2563EB" />
        <text x="100" y="28" textAnchor="middle" className="text-[6.5px] font-mono font-bold fill-[#64748B]">BRAVO</text>

        {/* Waypoint 3 (Charlie) */}
        <circle cx="180" cy="12" r="3.5" fill="#2563EB" />
        <circle cx="180" cy="12" r="6" stroke="#93C5FD" strokeWidth="1" opacity="0.6" />
        <text x="180" y="22" textAnchor="middle" className="text-[6.5px] font-mono font-bold fill-[#64748B]">CHARLIE</text>

        {/* Animated Aircraft along Path */}
        <g>
          {/* Jet Aircraft Icon */}
          <path
            d="M 0 -5 L 2.5 0 L 8 1.5 L 8 3 L 2.5 2.5 L 1.5 6 L 3.5 7.5 L 3.5 8.5 L 0 8 L -3.5 8.5 L -3.5 7.5 L -1.5 6 L -2.5 2.5 L -8 3 L -8 1.5 L -2.5 0 Z"
            fill="#1E40AF"
            stroke="#FFFFFF"
            strokeWidth="0.6"
          />
          {/* Subtle Jet Engine contrail / glow */}
          <circle cx="0" cy="9" r="1.5" fill="#60A5FA" opacity="0.75" />

          {/* SVG animateMotion moves aircraft along path */}
          <animateMotion
            dur="10s"
            repeatCount="indefinite"
            rotate="auto"
          >
            <mpath href="#flight-route-path" />
          </animateMotion>
        </g>
      </svg>
    </div>
  );
};
