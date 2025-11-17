import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * useToast
 * Hook to show toasts from anywhere within ToastProvider.
 */
const ToastContext = createContext(null);

export function ToastProvider({ children, duration = 3500 }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, variant = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) =>
      setTimeout(() => dismiss(t.id), duration)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, duration, dismiss]);

  const value = { show, dismiss };
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="ui-toast__container" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={['ui-toast', `ui-toast--${t.variant}`].join(' ')}>
            <span>{t.message}</span>
            <Button variant="ghost" size="sm" onClick={() => dismiss(t.id)} ariaLabel="Dismiss">
              Close
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
