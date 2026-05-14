import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Hash, ArrowUp, ArrowDown } from 'lucide-react';
import { getDayKey } from '../helpers/dayKey';

const ITEMS_PER_PAGE = 12;

export function HistoryTable({ entries, dayPriorMap }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);

  const paginatedEntries = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return entries.slice(start, start + ITEMS_PER_PAGE);
  }, [entries, page]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  const getTimeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  /**
   * Net total for each entry:
   *   net total = prior (sum of all previous days' last values) + this entry's value
   *
   * Because entry.value = sensor's current running count for that day,
   * NOT an increment. So prior + current reading = true total.
   */
  const netTotals = useMemo(() => {
    return paginatedEntries.map((e) => {
      const dayKey = getDayKey(e.createdAt);
      const prior = dayPriorMap[dayKey] || 0;
      return prior + e.value;
    });
  }, [paginatedEntries, dayPriorMap]);

  return (
    <div className="rounded-xl bg-slate-900/80 overflow-hidden">
      <div className="border-b border-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Trap History</h3>
            <p className="text-sm text-slate-400">
              {entries.length} total entries · Each value = sensor reading at that moment
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 ring-1 ring-fuchsia-500/30">
            <Clock className="h-5 w-5 text-fuchsia-400" />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">#</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Entry ID</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Sensor Value</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Net Total</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Date</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Time</th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">Ago</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedEntries.map((entry, idx) => {
              const isNeg = entry.value < 0;
              const netTotal = netTotals[idx];
              return (
                <tr key={entry._id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-6 py-3.5 text-xs font-medium text-slate-500">
                    {page * ITEMS_PER_PAGE + idx + 1}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-mono font-medium text-slate-400">
                      <Hash className="h-3 w-3" />
                      {entry._id.slice(-8)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${
                      isNeg
                        ? 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                    }`}>
                      {isNeg ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                      {entry.value}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <span className={`text-sm font-semibold ${netTotal < 0 ? 'text-red-400' : 'text-white'}`}>
                      {netTotal.toLocaleString()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-sm text-slate-400">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-sm text-slate-500">
                    {formatTime(entry.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-right">
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      {getTimeAgo(entry.createdAt)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden divide-y divide-white/5">
        {paginatedEntries.map((entry, idx) => {
          const isNeg = entry.value < 0;
          const netTotal = netTotals[idx];
          return (
            <div key={entry._id} className="px-5 py-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">#{page * ITEMS_PER_PAGE + idx + 1}</span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-500">
                    <Hash className="h-3 w-3" />
                    {entry._id.slice(-8)}
                  </span>
                </div>
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                  {getTimeAgo(entry.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-[10px] uppercase text-slate-600">Value</p>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-bold ${
                      isNeg ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {isNeg ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                      {entry.value}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase text-slate-600">Net Total</p>
                    <span className={`text-sm font-semibold ${netTotal < 0 ? 'text-red-400' : 'text-white'}`}>
                      {netTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {formatDate(entry.createdAt)} · {formatTime(entry.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
          <p className="text-xs text-slate-500">
            Page {page + 1} of {totalPages} ({entries.length} entries)
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i;
              else if (page < 3) pageNum = i;
              else if (page > totalPages - 4) pageNum = totalPages - 5 + i;
              else pageNum = page - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                      : 'border border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
