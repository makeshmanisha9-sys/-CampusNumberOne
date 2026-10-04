import React from 'react';

const variantClasses = {
  primary: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  cyan: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30',
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  danger: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
  purple: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  navy: 'bg-slate-800 text-slate-100 border-slate-700',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const Badge = ({ children, variant = 'primary', className = '', dot = false }) => {
  const badgeStyle = variantClasses[variant] || variantClasses.primary;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${badgeStyle} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'success'
              ? 'bg-emerald-500'
              : variant === 'danger'
              ? 'bg-rose-500'
              : variant === 'warning'
              ? 'bg-amber-500'
              : variant === 'cyan'
              ? 'bg-cyan-500'
              : 'bg-blue-500'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
