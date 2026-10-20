import React from 'react';

interface KpiTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  };
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const KpiTile: React.FC<KpiTileProps> = ({
  label,
  value,
  subValue,
  badge,
  icon,
  onClick,
  className = '',
}) => {
  const getBadgeStyle = () => {
    if (!badge) return '';
    switch (badge.variant) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border border-amber-200';
      case 'danger':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E5EAF1] rounded-lg p-4 shadow-sm transition-all duration-150 ${
        onClick
          ? 'cursor-pointer hover:border-[#2563EB] hover:shadow-md active:scale-[0.99]'
          : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-[#64748B] truncate">
          {label}
        </span>
        {icon && <span className="text-[#64748B] text-sm">{icon}</span>}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-[28px] font-bold text-[#172B4D] tracking-tight leading-none font-mono">
          {value}
        </div>
        {badge && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${getBadgeStyle()}`}>
            {badge.text}
          </span>
        )}
      </div>

      {subValue && (
        <div className="mt-2 text-[12px] text-[#64748B] truncate">
          {subValue}
        </div>
      )}
    </div>
  );
};
