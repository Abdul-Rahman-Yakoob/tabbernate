import type { MouseEvent } from 'react';
import { formatLastUsed, type Tab } from '@/utils/tabs';
import { Favicon } from './Favicon';
import { CloseIcon, MoonIcon } from './icons';

interface TabTileProps {
  tab: Tab;
  now: number;
  onActivate: (tab: Tab) => void;
  onClose: (tab: Tab) => void;
  onSleep: (tab: Tab) => void;
}

/**
 * One row in the list. Purely presentational: it receives callbacks instead
 * of calling the browser API itself, so it can be reused or tested in isolation.
 */
export function TabTile({ tab, now, onActivate, onClose, onSleep }: TabTileProps) {
  // stop the click bubbling up to the tile, which would switch to the tab
  const handle = (action: (tab: Tab) => void) => (e: MouseEvent) => {
    e.stopPropagation();
    action(tab);
  };

  const className = [
    'tab-tile',
    tab.active && 'active',
    tab.discarded && 'sleeping',
  ]
    .filter(Boolean)
    .join(' ');

  // the active tab can't be slept, and a sleeping tab doesn't need it
  const canSleep = !tab.active && !tab.discarded;

  return (
    <li className={className} title={tab.title} onClick={() => onActivate(tab)}>
      <Favicon src={tab.favIconUrl} />
      <span className="tab-title">{tab.title}</span>
      <span className="tab-meta">{formatLastUsed(tab, now)}</span>

      <div className="tab-actions">
        {canSleep && (
          <button
            className="icon-btn"
            title="Sleep tab: frees memory, reloads when you open it"
            onClick={handle(onSleep)}
          >
            <MoonIcon />
          </button>
        )}
        <button className="icon-btn close" title="Close tab" onClick={handle(onClose)}>
          <CloseIcon />
        </button>
      </div>
    </li>
  );
}
