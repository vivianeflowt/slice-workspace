import React, { useEffect, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  disabled = false,
  error,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`
          w-full
          px-4
          py-2
          text-left
          bg-gray-800
          border
          rounded-lg
          flex
          items-center
          justify-between
          transition-colors
          duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'border-red-500' : 'border-gray-600'}
          ${error ? 'hover:border-red-500' : 'hover:border-blue-500'}
          ${className}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={!selectedOption ? 'text-gray-400' : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          className="
            absolute
            z-10
            w-full
            mt-1
            bg-gray-800
            border
            border-gray-600
            rounded-lg
            shadow-lg
            max-h-60
            overflow-auto
          "
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={`
                px-4
                py-2
                cursor-pointer
                hover:bg-gray-700
                transition-colors
                duration-200
                ${option.value === value ? 'bg-blue-500 text-white' : ''}
              `}
              onClick={() => {
                onChange?.(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export { Dropdown };
