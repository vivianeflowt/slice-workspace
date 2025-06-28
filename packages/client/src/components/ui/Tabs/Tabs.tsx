import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  className = '',
}) => {
  const getVariantStyles = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-blue-500 text-white'
          : 'hover:bg-gray-700 text-gray-400 hover:text-white';
      case 'underline':
        return isActive
          ? 'border-b-2 border-blue-500 text-white'
          : 'border-b-2 border-transparent text-gray-400 hover:text-white hover:border-gray-600';
      default:
        return isActive
          ? 'bg-gray-700 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-700';
    }
  };

  return (
    <div
      className={`
        flex
        gap-1
        p-1
        ${variant === 'default' ? 'bg-gray-800 rounded-lg' : ''}
        ${className}
      `}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            className={`
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-lg
              transition-all
              duration-200
              ${getVariantStyles(isActive)}
            `}
            onClick={() => onChange?.(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export { Tabs };
