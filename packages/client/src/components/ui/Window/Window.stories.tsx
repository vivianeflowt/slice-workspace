import type { Meta, StoryObj } from '@storybook/react';
import { Window } from './Window';
import { FiMessageSquare, FiUser, FiSettings, FiBell, FiStar, FiHome } from 'react-icons/fi';
import {
  MdHome,
  MdPerson,
  MdSettings,
  MdChat,
  MdFavorite,
  MdNotifications,
  MdStar,
  MdInfo,
  MdHelp,
  MdClose,
  MdMinimize,
} from 'react-icons/md';
import React from 'react';

const iconOptions = {
  Nenhum: null,
  // Material Design (padrão)
  'MD Home': 'MdHome',
  'MD Pessoa': 'MdPerson',
  'MD Configurações': 'MdSettings',
  'MD Chat': 'MdChat',
  'MD Favorito': 'MdFavorite',
  'MD Notificação': 'MdNotifications',
  'MD Estrela': 'MdStar',
  'MD Info': 'MdInfo',
  'MD Ajuda': 'MdHelp',
  'MD Fechar': 'MdClose',
  'MD Minimizar': 'MdMinimize',
  // Feather (extra)
  'Feather Mensagem': 'FiMessageSquare',
  'Feather Usuário': 'FiUser',
  'Feather Configurações': 'FiSettings',
  'Feather Notificação': 'FiBell',
  'Feather Favorito': 'FiStar',
  'Feather Home': 'FiHome',
};

const iconMap = {
  MdHome,
  MdPerson,
  MdSettings,
  MdChat,
  MdFavorite,
  MdNotifications,
  MdStar,
  MdInfo,
  MdHelp,
  MdClose,
  MdMinimize,
  FiMessageSquare,
  FiUser,
  FiSettings,
  FiBell,
  FiStar,
  FiHome,
};

const meta: Meta<typeof Window> = {
  title: 'UI/Window',
  component: Window,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      description: 'Ícone exibido no círculo',
    },
    iconCircleColor: { control: 'color', description: 'Cor interna do círculo do ícone' },
    iconCircleBorderColor: { control: 'color', description: 'Cor da borda do círculo do ícone' },
    iconCircleBorderSize: {
      control: { type: 'range', min: 1, max: 8, step: 0.5 },
      description: 'Espessura da borda do círculo',
    },
    iconColor: { control: 'color', description: 'Cor do ícone' },
    iconSize: {
      control: { type: 'range', min: 8, max: 48, step: 1 },
      description: 'Tamanho do ícone',
    },
    iconCircleShadow: { control: 'text', description: 'Box-shadow do círculo' },
    titlebarColor: { control: 'color', description: 'Cor da titlebar' },
    titleFontSize: {
      control: { type: 'range', min: 10, max: 24, step: 1 },
      description: 'Tamanho da fonte do título',
    },
    controlButtonColor: { control: 'color', description: 'Cor dos botões de minimizar/fechar' },
    bodyColor: { control: 'color', description: 'Cor do body' },
    bodyShadow: {
      control: {
        type: 'select',
        options: [
          'Leve (padrão): 0 6px 28px 0 rgba(0,0,0,0.22), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
          'Forte: 0 12px 48px 0 rgba(0,0,0,0.32), 0 3px 8px 0 rgba(0,0,0,0.18)',
          'Sutil: 0 2px 8px 0 rgba(0,0,0,0.10)',
          'Nenhum: none',
          'Customizado...',
        ],
      },
      description: 'Box-shadow do body',
    },
    bodyShadowColor: { control: 'color', description: 'Cor do shadow do body' },
    bodyShadowOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Opacidade do shadow do body',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Window>;

export const Default: Story = {
  args: {
    title: 'Janela Exemplo',
    children: 'Conteúdo da janela',
    icon: 'Nenhum',
    iconCircleColor: '#262833',
    iconCircleBorderColor: '#4a4e5a',
    iconCircleBorderSize: 2.5,
    iconColor: '#f3f4f7',
    iconSize: 20,
    iconCircleShadow: '0 4px 16px 0 rgba(0,0,0,0.22), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
    titlebarColor: '#202127',
    titleFontSize: 13,
    controlButtonColor: '#bfc7d5',
    bodyColor: '#20222a',
    bodyShadow: '0 6px 28px 0 rgba(0,0,0,0.22), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
    bodyShadowColor: '',
    bodyShadowOpacity: 0.22,
  },
  render: (args) => {
    const { icon, iconColor, iconSize, ...rest } = args;
    let iconElement = null;
    if (icon && icon !== 'Nenhum') {
      if (typeof icon === 'string' && iconMap[icon as keyof typeof iconMap]) {
        const IconComp = iconMap[icon as keyof typeof iconMap];
        iconElement = <IconComp color={iconColor} size={iconSize} />;
      } else if (
        React.isValidElement(icon) &&
        Object.values(iconMap).some((Comp) => icon.type === Comp)
      ) {
        iconElement = React.cloneElement(
          icon as React.ReactElement<any>,
          { size: iconSize } as any,
        );
      } else if (React.isValidElement(icon)) {
        iconElement = icon;
      }
    }
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'transparent',
          position: 'relative',
        }}
      >
        <Window {...rest} icon={iconElement} center={true} />
      </div>
    );
  },
};

export const Exemplo3: Story = {
  args: {
    title: 'Janela Exemplo',
    children: 'Conteúdo da janela',
    icon: 'Feather Mensagem',
    iconCircleColor: '#191818',
    iconCircleBorderColor: '#676767',
    iconCircleBorderSize: 1,
    iconColor: '#9f9f9f',
    iconSize: 12,
    iconCircleShadow: '0 4px 8px 0 rgba(20,20,20,0.3), 0 1px 1px 0 rgba(20,20,20,0.3)',
    titlebarColor: '#17171b',
    titleFontSize: 12,
    controlButtonColor: '#d6d6d6',
    bodyColor: '#1e2029',
    bodyShadow: '0 6px 28px 0 rgba(0,0,0,0.22), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
    bodyShadowColor: '#0a0a0a',
    bodyShadowOpacity: 0.7,
  },

  render: (args) => {
    const { icon, iconColor, iconSize, ...rest } = args;
    let iconElement = null;
    if (icon && icon !== 'Nenhum') {
      if (typeof icon === 'string' && iconMap[icon as keyof typeof iconMap]) {
        const IconComp = iconMap[icon as keyof typeof iconMap];
        iconElement = <IconComp color={iconColor} size={iconSize} />;
      } else if (
        React.isValidElement(icon) &&
        Object.values(iconMap).some((Comp) => icon.type === Comp)
      ) {
        iconElement = React.cloneElement(
          icon as React.ReactElement<any>,
          { size: iconSize } as any,
        );
      } else if (React.isValidElement(icon)) {
        iconElement = icon;
      }
    }
    return <Window {...rest} icon={iconElement} />;
  },
};

export const Harmonia: Story = {
  args: {
    title: 'Chat',
    children: 'Conteúdo da janela',
    icon: 'Feather Mensagem',
    iconCircleColor: '#262833',
    iconCircleBorderColor: '#4a4e5a',
    iconCircleBorderSize: 1.5,
    iconColor: '#f3f4f7',
    iconSize: 15,
    iconCircleShadow: '0 4px 16px 0 rgba(40,40,50,0.22), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
    titlebarColor: '#23242a',
    titleFontSize: 13,
    controlButtonColor: '#bfc7d5',
    bodyColor: '#20222c',
    bodyShadow: '0 6px 28px 0 rgba(0,0,0,0.22), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
    bodyShadowColor: '',
    bodyShadowOpacity: 0.22,
  },
  render: (args) => {
    const { icon, iconColor, iconSize, ...rest } = args;
    let iconElement = null;
    if (icon && icon !== 'Nenhum') {
      if (typeof icon === 'string' && iconMap[icon as keyof typeof iconMap]) {
        const IconComp = iconMap[icon as keyof typeof iconMap];
        iconElement = <IconComp color={iconColor} size={iconSize} />;
      } else if (
        React.isValidElement(icon) &&
        Object.values(iconMap).some((Comp) => icon.type === Comp)
      ) {
        iconElement = React.cloneElement(
          icon as React.ReactElement<any>,
          { size: iconSize } as any,
        );
      } else if (React.isValidElement(icon)) {
        iconElement = icon;
      }
    }
    return <Window {...rest} icon={iconElement} />;
  },
};
