import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
  ghost: 'bg-transparent hover:bg-gray-700 text-gray-400 hover:text-white',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className = '',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`
          rounded-lg
          font-medium
          transition-colors
          duration-200
          flex
          items-center
          justify-center
          gap-2
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span
            className="loader border-2 border-t-2 border-t-white border-white/30 rounded-full w-4 h-4 animate-spin"
            aria-hidden
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
