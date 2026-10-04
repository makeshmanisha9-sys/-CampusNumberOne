import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export const StatCard = ({ title, value, change = '+12%', icon: Icon, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${style}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{change}</span>
        </span>
      </div>
    </div>
  );
};

export default StatCard;
