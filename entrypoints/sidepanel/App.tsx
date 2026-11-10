import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import type { Browser } from "wxt/browser";
import "./App.css";

type Tab = Browser.tabs.Tab;

// Small inline SVG icons: crisper and bolder than text glyphs like ☾ and ✕
const MoonIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

function App() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const refresh = () => {
      browser.tabs.query({}).then(setTabs);
    };
    refresh();

    // keep the list live while the panel is open
    browser.tabs.onCreated.addListener(refresh);
    browser.tabs.onRemoved.addListener(refresh);
    browser.tabs.onUpdated.addListener(refresh); // also fires when a tab is put to sleep
    browser.tabs.onActivated.addListener(refresh); // switching tabs
    browser.tabs.onMoved.addListener(refresh); // reordering tabs

    return () => {
      browser.tabs.onCreated.removeListener(refresh);
      browser.tabs.onRemoved.removeListener(refresh);
      browser.tabs.onUpdated.removeListener(refresh);
      browser.tabs.onActivated.removeListener(refresh);
      browser.tabs.onMoved.removeListener(refresh);
    };
  }, []);

  // ---- search: match on title or URL, case-insensitive ----
  const q = query.trim().toLowerCase();
  const visibleTabs = q
    ? tabs.filter(
        (tab) =>
          tab.title?.toLowerCase().includes(q) ||
          tab.url?.toLowerCase().includes(q),
      )
    : tabs;

  // ---- actions ----
  const activate = (tab: Tab) => {
    if (tab.id === undefined) return;
    browser.tabs.update(tab.id, { active: true });
    browser.windows.update(tab.windowId, { focused: true });
  };

  const closeTab = (e: MouseEvent, tab: Tab) => {
    e.stopPropagation(); // don't also trigger the tile's onClick (activate)
    if (tab.id === undefined) return;
    browser.tabs.remove(tab.id);
  };

  const sleepTab = (e: MouseEvent, tab: Tab) => {
    e.stopPropagation();
    if (tab.id === undefined) return;
    // frees the tab's memory; it stays in the tab strip and reloads when opened
    browser.tabs
      .discard(tab.id)
      .catch((err) => console.warn("Could not sleep tab", err));
  };

  return (
    <div className="app">
      <div className="search-bar">
        <input
          type="search"
          placeholder={`Search ${tabs.length} tabs`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          autoFocus
        />
      </div>

      {visibleTabs.length === 0 ? (
        <p className="empty">No tabs match “{query}”</p>
      ) : (
        <ul className="tabs-container">
          {visibleTabs.map((tab) => (
            <li
              key={tab.id}
              className={[
                "tab-tile",
                tab.active && "active",
                tab.discarded && "sleeping",
              ]
                .filter(Boolean)
                .join(" ")}
              title={tab.title}
              onClick={() => activate(tab)}
            >
              {tab.favIconUrl ? (
                <img
                  className="favicon"
                  src={tab.favIconUrl}
                  alt=""
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
              ) : (
                <div className="favicon placeholder" />
              )}

              <span className="tab-title">{tab.title}</span>

              <div className="tab-actions">
                {/* the active tab can't be slept, and a sleeping tab doesn't need it */}
                {!tab.active && !tab.discarded && (
                  <button
                    className="icon-btn"
                    title="Sleep tab: frees memory, reloads when you open it"
                    onClick={(e) => sleepTab(e, tab)}
                  >
                    <MoonIcon />
                  </button>
                )}
                <button
                  className="icon-btn close"
                  title="Close tab"
                  onClick={(e) => closeTab(e, tab)}
                >
                  <CloseIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
