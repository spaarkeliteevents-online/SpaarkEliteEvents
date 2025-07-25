import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LuxuryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = `
    premium-button relative overflow-hidden font-medium rounded-xl
    transition-all duration-300 ease-out will-change-transform
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    flex items-center justify-center gap-2
  `;

  const variantClasses = {
    primary: `
      luxury-bg-primary text-white shadow-medium
      hover:shadow-large focus:ring-pink-200
      before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
    `,
    secondary: `
      luxury-bg-glass text-luxury-text-secondary border-2 border-pink-200
      hover:border-pink-300 hover:bg-pink-50 focus:ring-pink-200
      backdrop-blur-10
    `,
    ghost: `
      text-luxury-text-secondary hover:luxury-bg-glass
      focus:ring-pink-200 hover:backdrop-blur-10
    `
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default LuxuryButton;