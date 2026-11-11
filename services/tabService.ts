/**
 * The only place in the side panel that calls the browser tabs API.
 *
 * Components and hooks go through these functions instead of calling
 * `browser.tabs` directly, so browser-specific details (missing ids,
 * error handling, which events matter) live in one file.
 */
import type { Tab } from '@/utils/tabs';

export function queryAllTabs(): Promise<Tab[]> {
  return browser.tabs.query({});
}

export function activateTab(tab: Tab): void {
  if (tab.id === undefined) return;
  browser.tabs.update(tab.id, { active: true });
  browser.windows.update(tab.windowId, { focused: true });
}

export function closeTab(tab: Tab): void {
  if (tab.id === undefined) return;
  browser.tabs.remove(tab.id);
}

/** Frees the tab's memory. It stays in the tab strip and reloads when opened. */
export function sleepTab(tab: Tab): void {
  if (tab.id === undefined) return;
  browser.tabs
    .discard(tab.id)
    .catch((err) => console.warn('Could not sleep tab', err));
}

/**
 * Calls `onChange` whenever the set of tabs or their state changes.
 * Returns an unsubscribe function, which fits straight into useEffect cleanup.
 */
export function subscribeToTabChanges(onChange: () => void): () => void {
  const events = [
    browser.tabs.onCreated,
    browser.tabs.onRemoved,
    browser.tabs.onUpdated, // title/favicon changes, and sleeping
    browser.tabs.onActivated, // switching tabs
    browser.tabs.onMoved, // reordering tabs
  ];
  events.forEach((event) => event.addListener(onChange));
  return () => events.forEach((event) => event.removeListener(onChange));
}
