import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Badge
 * Small, pill-shaped label with color variants.
 */
export default function Badge({ children, variant = 'default', className = '', ...rest }) {
  const variants = {
    default: 'ui-badge--default',
    success: 'ui-badge--success',
    warning: 'ui-badge--warning',
    error: 'ui-badge--error',
    info: 'ui-badge--info',
  };
  const cls = ['ui-badge', variants[variant] || variants.default, className]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}
