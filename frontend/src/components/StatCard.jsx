export function StatCard({ title, value, subtitle, icon, accentColor, bgColor }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-lg shadow-slate-200/50 transition-shadow hover:shadow-xl">
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full ${bgColor} opacity-30 blur-3xl transition-opacity group-hover:opacity-50`}
      />
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className={`text-3xl font-extrabold tracking-tight ${accentColor}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-[11px] font-medium text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bgColor} shadow-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
