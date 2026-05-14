import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Hash } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export function HistoryTable({ entries }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);

  const paginatedEntries = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return entries.slice(start, start + ITEMS_PER_PAGE);
  }, [entries, page]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
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

  const runningTotals = useMemo(() => {
    const totals = [];
    const sorted = [...entries].reverse();
    let cumulative = 0;
    const map = new Map();
    for (const e of sorted) {
      cumulative += e.value;
      map.set(e._id, cumulative);
    }
    for (const e of paginatedEntries) {
      totals.push(map.get(e._id) || 0);
    }
    return totals;
  }, [entries, paginatedEntries]);

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-lg shadow-slate-200/50">
      <div className="border-b border-slate-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Trap History</h3>
            <p className="text-sm text-slate-500">
              {entries.length} total entries from ThingSpeak → MongoDB
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Clock className="h-5 w-5 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                #
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Entry ID
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Value
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Running Total
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Date
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Time
              </th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Ago
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedEntries.map((entry, idx) => (
              <tr
                key={entry._id}
                className="transition-colors hover:bg-indigo-50/30"
              >
                <td className="whitespace-nowrap px-6 py-3.5 text-xs font-medium text-slate-400">
                  {page * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-mono font-medium text-slate-600">
                    <Hash className="h-3 w-3" />
                    {entry._id.slice(-8)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3.5">
                  <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full bg-indigo-50 px-2.5 text-sm font-bold text-indigo-600">
                    {entry.value}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3.5">
                  <span className="text-sm font-semibold text-slate-700">
                    {runningTotals[idx]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-sm text-slate-600">
                  {formatDate(entry.createdAt)}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-sm text-slate-500">
                  {formatTime(entry.createdAt)}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-right">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                    {getTimeAgo(entry.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden divide-y divide-slate-100">
        {paginatedEntries.map((entry, idx) => (
          <div key={entry._id} className="px-5 py-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">
                  #{page * ITEMS_PER_PAGE + idx + 1}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600">
                  <Hash className="h-3 w-3" />
                  {entry._id.slice(-8)}
                </span>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                {getTimeAgo(entry.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-[10px] uppercase text-slate-400">Value</p>
                  <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full bg-indigo-50 px-2 text-sm font-bold text-indigo-600">
                    {entry.value}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase text-slate-400">Total</p>
                  <span className="text-sm font-semibold text-slate-700">
                    {runningTotals[idx]}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                {formatDate(entry.createdAt)} · {formatTime(entry.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-500">
            Showing {page * ITEMS_PER_PAGE + 1}–
            {Math.min((page + 1) * ITEMS_PER_PAGE, entries.length)} of{' '}
            {entries.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (page < 3) {
                pageNum = i;
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
