import { Button as PrimeButton } from 'primereact/button';
import React from 'react';
import './Button.css';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant =
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'outlined'
  | 'text';

type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  type?: ButtonType;
  icon?: string;
  label?: string;
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  size?: ButtonSize;
  isActive?: boolean;
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  ariaLabel?: string;
}

const CLASS_BASE = 'p-button p-component';

export default function Button({
  label,
  icon,
  onClick,
  isLoading,
  className,
  variant,
  type = 'button',
  disabled = false,
  size = 'medium',
  isActive,
  tooltip,
  tooltipPosition = 'top',
  ariaLabel,
}: React.PropsWithChildren<ButtonProps>) {
  const cssVariant: ButtonVariant =
    isActive !== undefined
      ? isActive
        ? 'success'
        : 'danger'
      : type === 'reset'
        ? 'danger'
        : type === 'submit' && !variant
          ? 'primary'
          : (variant ?? 'outlined');

  /* ui changes update starts - 11/05/2026 */
  const computedSize: ButtonSize =
    type === 'reset'
      ? 'medium'
      : cssVariant === 'outlined' ||
          cssVariant === 'success' ||
          cssVariant === 'danger'
        ? 'small'
        : size;
  /* ui changes update ends - 11/05/2026 */

  /* ui changes update starts - 11/05/2026 */
  const outlinedAutoWidth =
    cssVariant === 'outlined' && (type === 'button' || type === 'reset')
      ? 'button-auto-width'
      : '';
  /* ui changes update ends - 11/05/2026 */

  const classNameFull = [
    CLASS_BASE,
    `button-variant-${cssVariant}`,
    `button-size-${computedSize}`,
    outlinedAutoWidth,
    disabled ? 'button-disabled' : '',
    className ?? '',
  ]
    .join(' ')
    .trim();

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const rippleSize = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - rippleSize / 2;
    const y = e.clientY - rect.top - rippleSize / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${rippleSize}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <PrimeButton
      type={type}
      className={classNameFull}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      icon={icon ? `pi pi-${icon}` : undefined}
      label={label}
      loading={isLoading}
      disabled={disabled}
      tooltip={tooltip}
      tooltipOptions={{
        position: tooltipPosition,
        showDelay: 150,
        hideDelay: 50,
      }}
      aria-label={ariaLabel ?? tooltip ?? label}
    />
  );
}
