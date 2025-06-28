import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const tabsWithIcons = [
  { id: 'home', label: 'Home', icon: <FiHome /> },
  { id: 'profile', label: 'Profile', icon: <FiUser /> },
  { id: 'settings', label: 'Settings', icon: <FiSettings /> },
];

const tabsNoIcons = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3' },
];

export const Default: Story = {
  args: {
    tabs: tabsWithIcons,
    activeTab: 'home',
  },
};

export const Pills: Story = {
  args: {
    tabs: tabsWithIcons,
    activeTab: 'profile',
    variant: 'pills',
  },
};

export const Underline: Story = {
  args: {
    tabs: tabsWithIcons,
    activeTab: 'settings',
    variant: 'underline',
  },
};

export const NoIcons: Story = {
  args: {
    tabs: tabsNoIcons,
    activeTab: 'tab1',
  },
};
