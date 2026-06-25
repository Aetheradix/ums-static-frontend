import { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'white' | 'white-outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className,
  type = 'button',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 cursor-pointer';
  const variants = {
    primary:
      'bg-blue text-white hover:bg-blue-dark hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'border-2 border-blue text-blue hover:bg-blue hover:text-white hover:-translate-y-0.5',
    ghost: 'text-navy hover:text-blue hover:bg-blue-light',
    white:
      'bg-white text-blue hover:bg-white/90 hover:shadow-glow hover:-translate-y-0.5',
    'white-outline':
      'border-2 border-white text-white hover:bg-white hover:text-blue hover:-translate-y-0.5',
  };
  const sizes = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-7 py-3 text-base',
    lg: 'px-9 py-4 text-lg',
  };

  const classes = clsx(base, variants[variant], sizes[size], className);
  if (href)
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
