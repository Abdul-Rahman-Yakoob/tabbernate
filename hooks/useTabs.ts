import { useEffect, useState } from 'react';
import type { Tab } from '@/utils/tabs';
import { queryAllTabs, subscribeToTabChanges } from '@/services/tabService';

/** All open tabs, kept live while the component is mounted. */
export function useTabs(): Tab[] {
  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    const refresh = () => {
      queryAllTabs().then(setTabs);
    };
    refresh();
    return subscribeToTabChanges(refresh);
  }, []);

  return tabs;
}
