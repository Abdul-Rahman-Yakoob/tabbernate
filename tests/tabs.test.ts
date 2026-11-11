import { describe, expect, it } from 'vitest';
import { filterTabs, formatLastUsed, sortTabs, type Tab } from '../utils/tabs';

// Build a tab with sensible defaults so each test only states what matters.
let nextId = 1;
const makeTab = (overrides: Partial<Tab> = {}): Tab =>
  ({
    id: nextId++,
    index: 0,
    windowId: 1,
    active: false,
    discarded: false,
    title: 'Untitled',
    url: 'https://example.com',
    ...overrides,
  }) as Tab;

const titles = (tabs: Tab[]) => tabs.map((t) => t.title);

describe('filterTabs', () => {
  const tabs = [
    makeTab({ title: 'React docs', url: 'https://react.dev' }),
    makeTab({ title: 'Lofi beats', url: 'https://www.youtube.com/watch?v=1' }),
    makeTab({ title: 'Inbox', url: 'https://mail.google.com' }),
  ];

  it('returns every tab for an empty or blank query', () => {
    expect(filterTabs(tabs, '')).toHaveLength(3);
    expect(filterTabs(tabs, '   ')).toHaveLength(3);
  });

  it('matches titles case-insensitively', () => {
    expect(titles(filterTabs(tabs, 'REACT'))).toEqual(['React docs']);
  });

  it('matches URLs as well as titles', () => {
    expect(titles(filterTabs(tabs, 'youtube'))).toEqual(['Lofi beats']);
  });

  it('returns nothing when no tab matches', () => {
    expect(filterTabs(tabs, 'netflix')).toEqual([]);
  });
});

describe('sortTabs', () => {
  const tabs = [
    makeTab({ title: 'B', windowId: 1, index: 1, lastAccessed: 3_000 }),
    makeTab({ title: 'A', windowId: 1, index: 0, lastAccessed: 1_000, discarded: true }),
    makeTab({ title: 'C', windowId: 2, index: 0, lastAccessed: 2_000, active: true }),
  ];

  it('tabOrder sorts by window, then position', () => {
    expect(titles(sortTabs(tabs, 'tabOrder'))).toEqual(['A', 'B', 'C']);
  });

  it('recent puts the active tab first, then most recently used', () => {
    expect(titles(sortTabs(tabs, 'recent'))).toEqual(['C', 'B', 'A']);
  });

  it('leastRecent puts the oldest tab first', () => {
    expect(titles(sortTabs(tabs, 'leastRecent'))).toEqual(['A', 'B', 'C']);
  });

  it('awakeFirst puts sleeping tabs last', () => {
    expect(titles(sortTabs(tabs, 'awakeFirst'))).toEqual(['B', 'C', 'A']);
  });

  it('does not mutate the input array', () => {
    const before = titles(tabs);
    sortTabs(tabs, 'recent');
    expect(titles(tabs)).toEqual(before);
  });
});

describe('formatLastUsed', () => {
  const now = 10 * 24 * 60 * 60 * 1000; // a fixed point in time
  const ago = (ms: number) => makeTab({ lastAccessed: now - ms });

  it('shows "Now" for the active tab and very recent tabs', () => {
    expect(formatLastUsed(makeTab({ active: true }), now)).toBe('Now');
    expect(formatLastUsed(ago(30_000), now)).toBe('Now');
  });

  it('formats minutes, hours and days', () => {
    expect(formatLastUsed(ago(5 * 60_000), now)).toBe('5m');
    expect(formatLastUsed(ago(3 * 60 * 60_000), now)).toBe('3h');
    expect(formatLastUsed(ago(2 * 24 * 60 * 60_000), now)).toBe('2d');
  });

  it('returns an empty label when lastAccessed is unknown', () => {
    expect(formatLastUsed(makeTab(), now)).toBe('');
  });
});
