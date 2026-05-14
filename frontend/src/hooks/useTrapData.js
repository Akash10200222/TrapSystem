import { useState, useEffect, useMemo, useCallback } from 'react';
import { getDayKey } from '../helpers/dayKey';

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
      setEntries(data); // sorted newest first from API (_id: -1)
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

  // Latest sensor reading
  const latestValue = useMemo(() => {
    if (entries.length === 0) return 0;
    return entries[0].value;
  }, [entries]);

  /**
   * Core logic:
   * - Group entries by day
   * - Each day's count = that day's LAST (most recent) entry value
   *   (the sensor reading represents the running count, not an increment)
   * - Prior = sum of all previous days' last values
   * - Today = latest reading today
   * - Total = Prior + Today
   */
  const { priorTotal, todayCount, totalCount, dayPriorMap } = useMemo(() => {
    if (entries.length === 0)
      return { priorTotal: 0, todayCount: 0, totalCount: 0, dayPriorMap: {} };

    const todayKey = getDayKey(new Date().toISOString());

    // entries are newest first → first occurrence of a day = its most recent entry
    const dayLastValue = {};
    for (const e of entries) {
      const key = getDayKey(e.createdAt);
      if (!(key in dayLastValue)) {
        dayLastValue[key] = e.value;
      }
    }

    // Sort days chronologically
    const sortedDays = Object.keys(dayLastValue).sort();

    // For each day, calculate cumulative prior (sum of ALL earlier days' last values)
    const dayPrior = {};
    let cumPrior = 0;
    for (const day of sortedDays) {
      dayPrior[day] = cumPrior;
      if (day !== todayKey) {
        cumPrior += dayLastValue[day];
      }
    }

    // If today has no entries yet, still set its prior
    if (!(todayKey in dayPrior)) {
      dayPrior[todayKey] = cumPrior;
    }

    const prior = dayPrior[todayKey] || 0;
    const today = dayLastValue[todayKey] || 0;

    return {
      priorTotal: prior,
      todayCount: today,
      totalCount: prior + today,
      dayPriorMap: dayPrior,
    };
  }, [entries]);

  // Hourly data for last 24 hours
  const hourlyData = useMemo(() => {
    if (entries.length === 0) return [];

    const now = new Date();
    const sorted = [...entries].reverse(); // oldest first

    const hours = [];

    for (let i = 23; i >= 0; i--) {
      const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
      hourStart.setMinutes(0, 0, 0);
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
      const hourDay = getDayKey(hourStart.toISOString());

      // Get entries in this hour (oldest first)
      const hourEntries = sorted.filter((e) => {
        const t = new Date(e.createdAt);
        return t >= hourStart && t < hourEnd;
      });

      // Last entry's value in this hour = sensor reading at end of hour
      const lastVal =
        hourEntries.length > 0
          ? hourEntries[hourEntries.length - 1].value
          : null;

      hours.push({
        hourStart,
        hourDay,
        label: hourStart.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        lastValue: lastVal,
      });
    }

    // Fill nulls: carry forward within same day, reset to 0 at day boundary
    if (hours[0].lastValue === null) hours[0].lastValue = 0;
    for (let i = 1; i < hours.length; i++) {
      if (hours[i].lastValue === null) {
        hours[i].lastValue =
          hours[i].hourDay === hours[i - 1].hourDay
            ? hours[i - 1].lastValue
            : 0;
      }
    }

    // Calculate per-hour change and cumulative total
    const result = [];
    for (let i = 0; i < hours.length; i++) {
      const h = hours[i];
      const prior = dayPriorMap[h.hourDay] || 0;

      let countPerHour;
      if (i === 0) {
        countPerHour = h.lastValue;
      } else {
        const prev = hours[i - 1];
        if (prev.hourDay !== h.hourDay) {
          // Crossed midnight → sensor resets, new day starts fresh
          countPerHour = h.lastValue;
        } else {
          countPerHour = h.lastValue - prev.lastValue;
        }
      }

      result.push({
        hour: h.hourStart.toISOString(),
        label: h.label,
        countPerHour,
        sensorReading: h.lastValue,
        cumulativeTotal: prior + h.lastValue,
      });
    }

    return result;
  }, [entries, dayPriorMap]);

  return {
    entries,
    totalCount,
    todayCount,
    priorTotal,
    latestValue,
    hourlyData,
    loading,
    error,
    lastUpdated,
    dayPriorMap,
    refresh: fetchData,
  };
}
