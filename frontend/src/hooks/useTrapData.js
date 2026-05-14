import { useState, useEffect, useMemo, useCallback } from 'react';

export function useTrapData() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/count/all');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setEntries(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const totalCount = useMemo(() => {
    return entries.reduce((sum, e) => sum + e.value, 0);
  }, [entries]);

  const todayCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return entries
      .filter((e) => new Date(e.createdAt) >= today)
      .reduce((sum, e) => sum + e.value, 0);
  }, [entries]);

  const latestValue = useMemo(() => {
    if (entries.length === 0) return 0;
    return entries[0].value;
  }, [entries]);

  const hourlyData = useMemo(() => {
    if (entries.length === 0) return [];

    const now = new Date();
    const hours = [];

    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    let runningTotal = entries
      .filter((e) => new Date(e.createdAt) < twentyFourHoursAgo)
      .reduce((sum, e) => sum + e.value, 0);

    for (let i = 23; i >= 0; i--) {
      const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
      hourStart.setMinutes(0, 0, 0);
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);

      const countPerHour = entries
        .filter((e) => {
          const t = new Date(e.createdAt);
          return t >= hourStart && t < hourEnd;
        })
        .reduce((sum, e) => sum + e.value, 0);

      runningTotal += countPerHour;

      hours.push({
        hour: hourStart.toISOString(),
        label: hourStart.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        countPerHour,
        cumulativeTotal: runningTotal,
      });
    }

    return hours;
  }, [entries]);

  return {
    entries,
    totalCount,
    todayCount,
    latestValue,
    hourlyData,
    loading,
    error,
    lastUpdated,
    refresh: fetchData,
  };
}
