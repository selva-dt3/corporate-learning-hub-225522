import React, { useId } from 'react';

/**
 * PUBLIC_INTERFACE
 * Tabs
 * Headless tabs with accessible roles; consumer controls state.
 */
export function Tabs({ value, onChange, children, label = 'Tabs', className = '' }) {
  return (
    <div className={['ui-tabs', className].filter(Boolean).join(' ')} aria-label={label}>
      {children}
    </div>
  );
}

// PUBLIC_INTERFACE
export function TabList({ children }) {
  return (
    <div role="tablist" className="ui-tabs__list">
      {children}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Tab({ id, selected, onSelect, children }) {
  const btnId = id || useId();
  return (
    <button
      id={btnId}
      role="tab"
      aria-selected={selected}
      className={['ui-tab', selected ? 'is-active' : ''].join(' ')}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}

// PUBLIC_INTERFACE
export function TabPanels({ children }) {
  return <div className="ui-tabs__panels">{children}</div>;
}

// PUBLIC_INTERFACE
export function TabPanel({ labelledBy, hidden, children }) {
  return (
    <div
      role="tabpanel"
      aria-labelledby={labelledBy}
      hidden={hidden}
      className="ui-tabpanel"
    >
      {!hidden && children}
    </div>
  );
}
