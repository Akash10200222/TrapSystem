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
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-2 text-xs font-semibold text-slate-500">{label}</p>
      {payload.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 py-0.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-slate-600">{item.name}:</span>
          <span className="text-xs font-bold text-slate-900">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function CountPerHourChart({ data }) {
  const maxVal = Math.max(...data.map((d) => d.countPerHour), 1);

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-lg shadow-slate-200/50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Count Per Hour</h3>
          <p className="text-sm text-slate-500">Trap triggers each hour (last 24h)</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5">
          <div className="h-3 w-3 rounded-sm bg-gradient-to-b from-indigo-500 to-purple-500" />
          <span className="text-xs font-medium text-indigo-700">Hourly</span>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              interval={Math.floor(data.length / 8)}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              domain={[0, Math.ceil(maxVal * 1.2)]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
            <Bar
              dataKey="countPerHour"
              name="Count"
              fill="url(#barGrad)"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CumulativeChart({ data }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-lg shadow-slate-200/50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Cumulative Total</h3>
          <p className="text-sm text-slate-500">Running total over last 24h</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-1.5">
            <div className="h-0.5 w-4 rounded-full bg-cyan-500" />
            <span className="text-xs font-medium text-cyan-700">Total</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-1.5">
            <div className="h-3 w-3 rounded-sm bg-violet-400 opacity-50" />
            <span className="text-xs font-medium text-violet-700">Hourly</span>
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              interval={Math.floor(data.length / 8)}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="right"
              dataKey="countPerHour"
              name="Hourly Count"
              fill="#8b5cf6"
              opacity={0.25}
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="cumulativeTotal"
              name="Cumulative Total"
              fill="url(#areaGrad)"
              stroke="transparent"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cumulativeTotal"
              name="Cumulative Total"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
