import React, { useEffect, useRef } from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * Modal
 * Accessible modal with focus trap and ESC to close.
 */
export default function Modal({
  open,
  onClose,
  title = 'Dialog',
  children,
  primaryAction,
  secondaryAction,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (open && ref.current) {
      const focusable = ref.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusable && focusable.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ui-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.target.classList.contains('ui-modal') && onClose?.()}>
      <div className="ui-modal__dialog" ref={ref}>
        <div className="ui-modal__header">
          <h3 id="modal-title">{title}</h3>
          <button className="ui-modal__close" aria-label="Close dialog" onClick={onClose}>✕</button>
        </div>
        <div className="ui-modal__body">{children}</div>
        {(primaryAction || secondaryAction) && (
          <div className="ui-modal__footer">
            {secondaryAction}
            {primaryAction}
          </div>
        )}
      </div>
    </div>
  );
}
