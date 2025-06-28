import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Digite algo...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Nome completo',
    placeholder: 'Digite seu nome',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Digite seu email',
    error: 'Email inválido',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    placeholder: 'Digite sua senha',
    helperText: 'A senha deve ter no mínimo 8 caracteres',
  },
};
