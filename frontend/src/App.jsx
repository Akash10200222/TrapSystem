import {
  RefreshCw,
  Bug,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  Zap,
  Wifi,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import { useTrapData } from './hooks/useTrapData';
import { StatCard } from './components/StatCard';
import { CountPerHourChart, CumulativeChart } from './components/HourlyChart';
import { HistoryTable } from './components/HistoryTable';

export default function App() {
  const {
    entries,
    totalCount,
    todayCount,
    latestValue,
    hourlyData,
    loading,
    error,
    lastUpdated,
    refresh,
  } = useTrapData();

  const peakHour = hourlyData.reduce(
    (max, h) => (h.countPerHour > max.countPerHour ? h : max),
    { label: '—', countPerHour: 0, hour: '', cumulativeTotal: 0 }
  );

  const totalEntries = entries.length;
  const positiveEntries = entries.filter(e => e.value > 0).length;
  const negativeEntries = entries.filter(e => e.value < 0).length;

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-violet-950 via-indigo-950 to-fuchsia-950">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-[3px] border-violet-700/50" />
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-[3px] border-transparent border-t-fuchsia-400" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-white">Loading Trap Data</p>
            <p className="mt-1 text-xs text-violet-300">Connecting to MongoDB...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && entries.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-950 via-slate-950 to-red-950 p-4">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 ring-2 ring-red-500/30">
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">Connection Failed</p>
            <p className="mt-2 text-sm text-red-300/80">{error}</p>
          </div>
          <button
            onClick={refresh}
            className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:shadow-xl hover:shadow-red-600/40 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/30">
                <Bug className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">
                  TrapSystem
                </h1>
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-2.5 w-2.5 text-violet-400" />
                  <p className="text-[10px] font-medium uppercase tracking-widest text-violet-400">
                    IoT Dashboard
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 ring-1 ring-emerald-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11px] font-semibold text-emerald-400">Live</span>
              </div>
              <button
                onClick={refresh}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 active:scale-95"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Error Banner */}
        {error && entries.length > 0 && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-400" />
            <p className="text-sm font-medium text-amber-300">
              Connection issue: {error} — showing last known data
            </p>
          </div>
        )}

        {/* Last Updated */}
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-slate-500" />
            <p className="text-xs text-slate-500">
              Last updated:{' '}
              {lastUpdated.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
          <span className="text-slate-700">·</span>
          <p className="text-xs text-slate-500">Auto-refresh every 5s</p>
          <span className="text-slate-700">·</span>
          <p className="text-xs text-slate-500">
            <span className="text-emerald-400">{positiveEntries} ↑</span>{' '}
            <span className="text-red-400">{negativeEntries} ↓</span>{' '}
            of {totalEntries} entries
          </p>
        </div>

        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            title="Latest Value"
            value={latestValue}
            subtitle="Most recent reading"
            icon={<Zap className="h-5 w-5 text-amber-300" />}
            gradientFrom="from-amber-600"
            gradientTo="to-orange-700"
            glowColor="shadow-amber-500/20"
          />
          <StatCard
            title="Net Total"
            value={totalCount}
            subtitle={`+${entries.filter(e => e.value > 0).reduce((s, e) => s + e.value, 0)} / ${entries.filter(e => e.value < 0).reduce((s, e) => s + e.value, 0)}`}
            icon={<BarChart3 className="h-5 w-5 text-violet-300" />}
            gradientFrom="from-violet-600"
            gradientTo="to-purple-700"
            glowColor="shadow-violet-500/20"
          />
          <StatCard
            title="Today"
            value={todayCount}
            subtitle="Since midnight"
            icon={<Calendar className="h-5 w-5 text-cyan-300" />}
            gradientFrom="from-cyan-600"
            gradientTo="to-blue-700"
            glowColor="shadow-cyan-500/20"
          />
          <StatCard
            title="Peak Hour"
            value={peakHour.countPerHour}
            subtitle={peakHour.label !== '—' ? `at ${peakHour.label}` : 'No data'}
            icon={peakHour.countPerHour >= 0
              ? <TrendingUp className="h-5 w-5 text-emerald-300" />
              : <TrendingDown className="h-5 w-5 text-red-300" />
            }
            gradientFrom="from-emerald-600"
            gradientTo="to-teal-700"
            glowColor="shadow-emerald-500/20"
          />
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/80 to-slate-900 p-1">
            <CountPerHourChart data={hourlyData} />
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/80 to-slate-900 p-1">
            <CumulativeChart data={hourlyData} />
          </div>
        </div>

        {/* History Table */}
        <div className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-950/50 to-slate-900 p-1">
          <HistoryTable entries={entries} />
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/5 py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-violet-500" />
              <span className="text-xs font-semibold text-slate-500">TrapSystem</span>
            </div>
            <p className="text-[11px] text-slate-600 text-center">
              ThingSpeak → MongoDB → Dashboard
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
