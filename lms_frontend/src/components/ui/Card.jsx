import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card
 * Surface component with optional header/footer areas.
 */
export default function Card({
  children,
  className = '',
  header,
  footer,
  role = 'region',
  ariaLabel,
}) {
  return (
    <section className={['ui-card', className].filter(Boolean).join(' ')} role={role} aria-label={ariaLabel}>
      {header ? <div className="ui-card__header">{header}</div> : null}
      <div className="ui-card__body">{children}</div>
      {footer ? <div className="ui-card__footer">{footer}</div> : null}
    </section>
  );
}
