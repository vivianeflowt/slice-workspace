import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full
            px-3
            py-2
            bg-gray-800
            border
            rounded-lg
            outline-none
            transition-colors
            duration-200
            ${error ? 'border-red-500' : 'border-gray-600'}
            ${error ? 'focus:border-red-500' : 'focus:border-blue-500'}
            ${className}
          `}
          {...props}
        />
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-400'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
