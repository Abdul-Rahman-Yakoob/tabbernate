/**
 * Pure tab logic: filtering, sorting and formatting.
 *
 * Nothing in this file touches the browser API or React, so every function
 * here can be unit-tested with plain data (see tests/tabs.test.ts).
 */
import type { Browser } from 'wxt/browser';

export type Tab = Browser.tabs.Tab;

// ---------- search ----------

/** Case-insensitive match on title or URL. An empty query returns all tabs. */
export function filterTabs(tabs: Tab[], query: string): Tab[] {
  const q = query.trim().toLowerCase();
  if (!q) return tabs;
  return tabs.filter(
    (tab) =>
      tab.title?.toLowerCase().includes(q) ||
      tab.url?.toLowerCase().includes(q),
  );
}

// ---------- sorting ----------

export type SortMode = 'tabOrder' | 'recent' | 'leastRecent' | 'awakeFirst';

type Comparator = (a: Tab, b: Tab) => number;

/** The order tabs appear in Chrome's tab strip, window by window. */
const byTabOrder: Comparator = (a, b) =>
  a.windowId - b.windowId || a.index - b.index;

/** The active tab is in use right now, so it counts as the most recent. */
const lastUsed = (tab: Tab): number =>
  tab.active ? Number.POSITIVE_INFINITY : (tab.lastAccessed ?? 0);

/**
 * One comparator per sort mode. To add a new sort, add an entry here and to
 * SORT_OPTIONS; nothing else needs to change.
 */
const COMPARATORS: Record<SortMode, Comparator> = {
  tabOrder: byTabOrder,
  recent: (a, b) => lastUsed(b) - lastUsed(a) || byTabOrder(a, b),
  leastRecent: (a, b) => lastUsed(a) - lastUsed(b) || byTabOrder(a, b),
  awakeFirst: (a, b) =>
    Number(Boolean(a.discarded)) - Number(Boolean(b.discarded)) ||
    byTabOrder(a, b),
};

export const SORT_OPTIONS: ReadonlyArray<{ value: SortMode; label: string }> = [
  { value: 'tabOrder', label: 'Tab order' },
  { value: 'recent', label: 'Recently used' },
  { value: 'leastRecent', label: 'Least recently used' },
  { value: 'awakeFirst', label: 'Awake first' },
];

/** Returns a new sorted array; never mutates the input. */
export function sortTabs(tabs: Tab[], mode: SortMode): Tab[] {
  return [...tabs].sort(COMPARATORS[mode]);
}

// ---------- formatting ----------

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Short "last used" label: "Now", "5m", "3h", "2d".
 * `now` is passed in rather than read from Date.now(), which keeps the
 * function pure and lets tests use a fixed time.
 */
export function formatLastUsed(tab: Tab, now: number): string {
  if (tab.active) return 'Now';
  if (!tab.lastAccessed) return '';
  const diff = Math.max(0, now - tab.lastAccessed);
  if (diff < MINUTE) return 'Now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`;
  return `${Math.floor(diff / DAY)}d`;
}
