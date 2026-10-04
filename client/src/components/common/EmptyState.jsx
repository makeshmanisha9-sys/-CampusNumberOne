import React from 'react';
import { Sparkles, FolderOpen, CalendarX, BellOff, Award } from 'lucide-react';

const icons = {
  folder: FolderOpen,
  calendar: CalendarX,
  bell: BellOff,
  award: Award,
  sparkles: Sparkles,
};

export const EmptyState = ({
  icon = 'folder',
  title = 'No items found',
  message = 'There are no records matching your criteria or category.',
  actionText,
  onAction,
}) => {
  const IconComponent = icons[icon] || icons.folder;

  return (
    <div className="bg-white/80 rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        <IconComponent className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xs">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
