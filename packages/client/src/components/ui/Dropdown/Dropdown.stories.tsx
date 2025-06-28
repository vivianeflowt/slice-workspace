import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

const options = [
  { label: 'Opção 1', value: '1' },
  { label: 'Opção 2', value: '2' },
  { label: 'Opção 3', value: '3' },
];

export const Default: Story = {
  args: {
    options,
    placeholder: 'Selecione uma opção',
  },
};

export const WithValue: Story = {
  args: {
    options,
    value: '2',
  },
};

export const Disabled: Story = {
  args: {
    options: options.slice(0, 2),
    value: '1',
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    options: options.slice(0, 2),
    error: 'Por favor, selecione uma opção',
  },
};
