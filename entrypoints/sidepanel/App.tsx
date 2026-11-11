import { useMemo, useState } from 'react';
import { Toolbar } from '../../components/Toolbar';
import { TabList } from "../../components/TabList";
import { useTabs } from "../../hooks/useTabs";
import { useNow } from "../../hooks/useNow";
import { activateTab, closeTab, sleepTab } from "../../services/tabService";
import { filterTabs, sortTabs, type SortMode } from '../../utils/tabs';
import './App.css';

/**
 * Wires state to components. It holds no tab logic of its own:
 * filtering and sorting live in utils/tabs.ts, browser calls in
 * services/tabService.ts, and rendering in components/.
 */
function App() {
  const tabs = useTabs();
  const now = useNow();
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('tabOrder');

  const visibleTabs = useMemo(
    () => sortTabs(filterTabs(tabs, query), sortMode),
    [tabs, query, sortMode],
  );

  return (
    <div className="app">
      <Toolbar
        query={query}
        onQueryChange={setQuery}
        sortMode={sortMode}
        onSortChange={setSortMode}
        tabCount={tabs.length}
      />

      {visibleTabs.length === 0 && query ? (
        <p className="empty">No tabs match “{query}”</p>
      ) : (
        <TabList
          tabs={visibleTabs}
          now={now}
          onActivate={activateTab}
          onClose={closeTab}
          onSleep={sleepTab}
        />
      )}
    </div>
  );
}

export default App;
