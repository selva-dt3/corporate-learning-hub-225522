import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button
 * Accessible, theme-aware button with variants and sizes.
 */
export default function Button({
  as: Comp = 'button',
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ariaLabel,
  ...rest
}) {
  const base =
    'ui-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500';
  const variants = {
    primary: 'ui-btn--primary',
    secondary: 'ui-btn--secondary',
    ghost: 'ui-btn--ghost',
    danger: 'ui-btn--danger',
  };
  const sizes = {
    sm: 'ui-btn--sm',
    md: 'ui-btn--md',
    lg: 'ui-btn--lg',
  };
  const cls = [base, variants[variant] || variants.primary, sizes[size] || sizes.md, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Comp
      type={Comp === 'button' ? type : undefined}
      className={cls}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Comp>
  );
}
