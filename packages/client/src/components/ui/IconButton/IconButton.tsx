import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'p-1',
      md: 'p-2',
      lg: 'p-3',
    };

    const variantClasses = {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
      ghost: 'bg-transparent hover:bg-gray-700 text-gray-400 hover:text-white',
    };

    return (
      <button
        ref={ref}
        className={`
          rounded-lg
          transition-colors
          duration-200
          flex
          items-center
          justify-center
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
        {...props}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';

export { IconButton };
