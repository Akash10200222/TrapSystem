export function StatCard({ title, value, subtitle, icon, gradientFrom, gradientTo, glowColor }) {
  const isNegative = typeof value === 'number' && value < 0;

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} p-5 shadow-xl ${glowColor} transition-all hover:scale-[1.02] hover:shadow-2xl`}>
      {/* Decorative circles */}
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/5 blur-xl" />
      <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
            {title}
          </p>
          <p className={`text-3xl font-extrabold tracking-tight text-white ${isNegative ? 'text-red-200' : ''}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-[11px] font-medium text-white/40">{subtitle}</p>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}
