import { BookCheck, BookOpen, Clock, Library } from 'lucide-react';
import { formatCountsSummary } from '../utils/countByStatus.js';

export function CountsSummary({
  counts = { 'to-read': 0, reading: 0, finished: 0, total: 0 },
  activeFilter = 'all',
  onFilterChange,
}) {
  const summaryText = formatCountsSummary(counts);

  const stats = [
    {
      id: 'all',
      label: 'All Books',
      count: counts.total,
      suffix: counts.total === 1 ? 'book' : 'books',
      icon: Library,
      colorClass: 'text-ink',
    },
    {
      id: 'to-read',
      label: 'To Read',
      count: counts['to-read'],
      suffix: 'to read',
      icon: Clock,
      colorClass: 'text-slate-700',
    },
    {
      id: 'reading',
      label: 'Reading',
      count: counts.reading,
      suffix: 'reading',
      icon: BookOpen,
      colorClass: 'text-gold',
    },
    {
      id: 'finished',
      label: 'Finished',
      count: counts.finished,
      suffix: 'finished',
      icon: BookCheck,
      colorClass: 'text-emerald-700',
    },
  ];

  return (
    <section aria-label="Reading progress counts summary" className="space-y-3">
      {/* Editorial subtitle readout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-muted">
        <span className="font-medium text-ink">Reading Overview</span>
        <span className="text-muted italic" aria-live="polite">
          {summaryText}
        </span>
      </div>

      {/* Responsive Cards Row as interactive filter controls */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        role="group"
        aria-label="Filter by reading status cards"
      >
        {stats.map(stat => {
          const Icon = stat.icon;
          const isActive = activeFilter === stat.id;

          return (
            <button
              key={stat.id}
              type="button"
              onClick={() => onFilterChange && onFilterChange(stat.id)}
              aria-pressed={isActive}
              className={`p-4 rounded-card border transition-all text-left flex flex-col justify-between cursor-pointer min-h-[92px] hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 ${
                isActive
                  ? 'border-ink bg-white shadow-lift ring-2 ring-ink/10'
                  : 'border-border bg-white shadow-soft hover:border-gold/50'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-ink' : 'text-muted'}`}>
                  {stat.label}
                </span>
                <Icon className={`w-4 h-4 ${stat.colorClass}`} aria-hidden="true" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                  {stat.count}
                </span>
                <span className="text-xs text-muted">
                  {stat.id === 'all'
                    ? (stat.count === 1 ? 'title' : 'titles')
                    : stat.suffix}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CountsSummary;
