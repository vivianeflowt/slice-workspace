import type { Action } from 'kbar';
import React from 'react';
import { FiMinimize2, FiPlusSquare, FiSearch } from 'react-icons/fi';

export const kbarActions: Action[] = [
  {
    id: 'new-window',
    name: 'Nova Janela',
    shortcut: ['ctrl+n'],
    keywords: 'nova janela new window',
    section: 'Janelas',
    icon: React.createElement(FiPlusSquare),
    perform: () => {
      // TODO: Integrar com sistema de janelas
      alert('Nova Janela');
    },
  },
  {
    id: 'minimize-all',
    name: 'Minimizar Todas',
    shortcut: ['ctrl+m'],
    keywords: 'minimizar minimizar todas minimize all',
    section: 'Janelas',
    icon: React.createElement(FiMinimize2),
    perform: () => {
      // TODO: Integrar com sistema de janelas
      alert('Minimizar Todas');
    },
  },
  {
    id: 'global-search',
    name: 'Busca Global',
    shortcut: ['ctrl+k'],
    keywords: 'busca search global',
    section: 'Sistema',
    icon: React.createElement(FiSearch),
    perform: () => {
      // TODO: Integrar busca global
      alert('Busca Global');
    },
  },
];
