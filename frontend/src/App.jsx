import {
  RefreshCw,
  Bug,
  TrendingUp,
  Calendar,
  Activity,
  Zap,
  Wifi,
  AlertCircle,
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

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-[3px] border-slate-700" />
            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-[3px] border-transparent border-t-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-300">Loading Trap Data</p>
            <p className="text-xs text-slate-500">Connecting to MongoDB...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && entries.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-200">Connection Failed</p>
            <p className="mt-1 text-sm text-slate-400">{error}</p>
          </div>
          <button
            onClick={refresh}
            className="mt-2 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200/50">
                <Bug className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  TrapSystem
                </h1>
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-2.5 w-2.5 text-slate-400" />
                  <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                    IoT Dashboard
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 ring-1 ring-emerald-200/50">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">Live</span>
              </div>
              <button
                onClick={refresh}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-95"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {error && entries.length > 0 && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
            <p className="text-sm font-medium text-amber-800">
              Connection issue: {error} — showing last known data
            </p>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-slate-400" />
            <p className="text-xs text-slate-400">
              Last updated:{' '}
              {lastUpdated.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
          <span className="text-slate-300">·</span>
          <p className="text-xs text-slate-400">Auto-refresh every 5 seconds</p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            title="Latest Value"
            value={latestValue}
            subtitle="Most recent reading"
            icon={<Zap className="h-5 w-5 text-amber-600" />}
            accentColor="text-amber-600"
            bgColor="bg-amber-50"
          />
          <StatCard
            title="Total Count"
            value={totalCount}
            subtitle="All time sum"
            icon={<Bug className="h-5 w-5 text-indigo-600" />}
            accentColor="text-indigo-600"
            bgColor="bg-indigo-50"
          />
          <StatCard
            title="Today"
            value={todayCount}
            subtitle="Since midnight"
            icon={<Calendar className="h-5 w-5 text-cyan-600" />}
            accentColor="text-cyan-600"
            bgColor="bg-cyan-50"
          />
          <StatCard
            title="Peak Hour"
            value={peakHour.countPerHour}
            subtitle={peakHour.label !== '—' ? `at ${peakHour.label}` : 'No data'}
            icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
            accentColor="text-emerald-600"
            bgColor="bg-emerald-50"
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <CountPerHourChart data={hourlyData} />
          <CumulativeChart data={hourlyData} />
        </div>

        <HistoryTable entries={entries} />

        <footer className="mt-12 border-t border-slate-200/60 py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-slate-300" />
              <span className="text-xs font-semibold text-slate-400">TrapSystem</span>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              ThingSpeak → MongoDB → Dashboard
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
