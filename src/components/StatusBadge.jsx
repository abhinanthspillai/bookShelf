import { STATUSES } from '../config/constants.js';

const STATUS_CONFIG = {
  'to-read': {
    label: 'To read',
    classes: 'bg-slate-100 text-slate-700 border-slate-200/80',
    dotClasses: 'bg-slate-400',
  },
  'reading': {
    label: 'Reading',
    classes: 'bg-[#FDF7ED] text-[#B8812E] border-[#ECD5AE]',
    dotClasses: 'bg-[#B8812E]',
  },
  'finished': {
    label: 'Finished',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClasses: 'bg-emerald-500',
  },
};

export function StatusBadge({ status, className = '' }) {
  const config = STATUS_CONFIG[status] || {
    label: STATUSES.find(s => s.value === status)?.label || 'To read',
    classes: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClasses: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${config.classes} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClasses}`} aria-hidden="true" />
      {config.label}
    </span>
  );
}

export default StatusBadge;
