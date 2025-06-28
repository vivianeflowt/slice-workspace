import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarResults,
  KBarSearch,
  useMatches,
} from 'kbar';
import React from 'react';
import { FiCommand } from 'react-icons/fi';

interface ResultItemProps {
  action: any;
  active: boolean;
}

const ResultItem = React.forwardRef<HTMLDivElement, ResultItemProps>(({ action, active }, ref) => (
  <div
    ref={ref}
    className={`flex items-center gap-3 px-4 py-2 rounded cursor-pointer ${active ? 'bg-blue-700 text-white' : 'bg-transparent text-gray-200'}`}
    style={{ fontSize: 16 }}
  >
    <span className="text-xl">
      {typeof action.icon === 'function' ? action.icon() : action.icon}
    </span>
    <span className="flex-1">{action.name}</span>
    {action.shortcut && (
      <span className="opacity-60 text-xs font-mono bg-gray-800 px-2 py-1 rounded ml-2">
        {action.shortcut.join(' + ').replace('ctrl', 'Ctrl').replace('cmd', 'Cmd')}
      </span>
    )}
  </div>
));

const CustomKBarPortal = () => {
  const { results } = useMatches();
  return (
    <KBarPortal>
      <KBarPositioner className="z-50 flex items-center justify-center bg-black/60">
        <KBarAnimator className="w-full max-w-xl bg-[#23272f] rounded-xl shadow-2xl overflow-hidden border border-[#222]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#222] bg-[#23272f]">
            <FiCommand className="text-blue-400 text-xl" />
            <KBarSearch
              className="flex-1 bg-transparent outline-none text-lg text-white placeholder:text-gray-400"
              placeholder="Digite uma ação ou pesquise..."
            />
          </div>
          <KBarResults
            items={results}
            onRender={({ item, active }) =>
              typeof item === 'string' ? (
                <div className="px-4 py-2 text-xs uppercase opacity-60 tracking-widest bg-[#181a20]">
                  {item}
                </div>
              ) : (
                <ResultItem action={item} active={active} />
              )
            }
          />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
};

export default CustomKBarPortal;
