import type { Tab } from '@/utils/tabs';
import { TabTile } from './TabTile';

interface TabListProps {
  tabs: Tab[];
  now: number;
  onActivate: (tab: Tab) => void;
  onClose: (tab: Tab) => void;
  onSleep: (tab: Tab) => void;
}

export function TabList({ tabs, ...handlers }: TabListProps) {
  return (
    <ul className="tabs-container">
      {tabs.map((tab) => (
        <TabTile key={tab.id} tab={tab} {...handlers} />
      ))}
    </ul>
  );
}
