import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const meta: Meta<typeof IconButton> = {
  title: 'UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  args: {
    icon: <FiPlus />,
    'aria-label': 'Adicionar',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    icon: <FiEdit2 />,
    'aria-label': 'Editar',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    icon: <FiTrash2 />,
    'aria-label': 'Excluir',
    variant: 'ghost',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <IconButton {...args} size="sm" icon={<FiPlus />} aria-label="Adicionar pequeno" />
      <IconButton {...args} size="md" icon={<FiPlus />} aria-label="Adicionar médio" />
      <IconButton {...args} size="lg" icon={<FiPlus />} aria-label="Adicionar grande" />
    </div>
  ),
  args: {
    variant: 'primary',
  },
};
