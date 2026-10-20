import React, { useState } from 'react';
import { getReasonCode } from '../lib/reasonCodes';

interface ReasonChipProps {
  code: string;
  showTooltip?: boolean;
  className?: string;
}

export const ReasonChip: React.FC<ReasonChipProps> = ({ code, showTooltip = true, className = '' }) => {
  const meta = getReasonCode(code);
  const [isHovered, setIsHovered] = useState(false);

  const getStyle = () => {
    switch (meta.category) {
      case 'assignment':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300';
      case 'eligibility':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300';
      case 'validation':
        return 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-300';
      case 'explainer':
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-300';
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border transition-colors cursor-help ${getStyle()} ${className}`}
      >
        <span className="w-1 h-1 rounded-full bg-current opacity-80" />
        <span>{code}</span>
      </span>

      {showTooltip && isHovered && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white border border-[#DCE3EC] rounded-lg shadow-xl text-left pointer-events-none text-[#172B4D]">
          <div className="font-semibold text-xs text-[#172B4D] mb-1 flex items-center justify-between">
            <span>{meta.label}</span>
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider">{meta.category}</span>
          </div>
          <div className="text-[11px] text-[#475569] leading-snug">
            {meta.description}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
        </div>
      )}
    </div>
  );
};
