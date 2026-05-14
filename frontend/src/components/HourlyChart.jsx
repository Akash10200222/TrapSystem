import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Area,
  ReferenceLine,
  Cell,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-sm">
      <p className="mb-2 text-xs font-semibold text-slate-400">{label}</p>
      {payload.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 py-0.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-slate-400">{item.name}:</span>
          <span className={`text-xs font-bold ${item.value < 0 ? 'text-red-400' : 'text-white'}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CountPerHourChart({ data }) {
  const hasNegatives = data.some(d => d.countPerHour < 0);

  return (
    <div className="rounded-xl bg-slate-900/80 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Count Per Hour</h3>
          <p className="text-sm text-slate-400">Trap triggers each hour (last 24h)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-1.5 ring-1 ring-indigo-500/30">
            <div className="h-3 w-3 rounded-sm bg-gradient-to-b from-indigo-400 to-violet-500" />
            <span className="text-[11px] font-medium text-indigo-300">Positive</span>
          </div>
          {hasNegatives && (
            <div className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 ring-1 ring-red-500/30">
              <div className="h-3 w-3 rounded-sm bg-gradient-to-b from-red-400 to-rose-500" />
              <span className="text-[11px] font-medium text-red-300">Negative</span>
            </div>
          )}
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="barGradPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="barGradNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f87171" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.95} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval={Math.floor(data.length / 8)}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            {hasNegatives && <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="countPerHour" name="Count" radius={[6, 6, 0, 0]} maxBarSize={32}>
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.countPerHour < 0 ? 'url(#barGradNeg)' : 'url(#barGradPos)'}
                  radius={entry.countPerHour < 0 ? [0, 0, 6, 6] : [6, 6, 0, 0]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CumulativeChart({ data }) {
  const minVal = Math.min(...data.map(d => d.cumulativeTotal));
  const showRefLine = minVal < 0 || data.some(d => d.countPerHour < 0);

  return (
    <div className="rounded-xl bg-slate-900/80 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Cumulative Net Total</h3>
          <p className="text-sm text-slate-400">Running total (positives − negatives) over 24h</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 ring-1 ring-cyan-500/30">
            <div className="h-0.5 w-4 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-medium text-cyan-300">Net Total</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-3 py-1.5 ring-1 ring-violet-500/30">
            <div className="h-3 w-3 rounded-sm bg-violet-500/40" />
            <span className="text-[11px] font-medium text-violet-300">Hourly</span>
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval={Math.floor(data.length / 8)}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            {showRefLine && <ReferenceLine yAxisId="right" y={0} stroke="#475569" strokeDasharray="3 3" />}
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="right"
              dataKey="countPerHour"
              name="Hourly Count"
              maxBarSize={24}
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.countPerHour < 0 ? '#ef444440' : '#8b5cf640'}
                />
              ))}
            </Bar>
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="cumulativeTotal"
              name="Net Total"
              fill="url(#areaGrad)"
              stroke="transparent"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cumulativeTotal"
              name="Net Total"
              stroke="#22d3ee"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#22d3ee', stroke: '#0f172a', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
