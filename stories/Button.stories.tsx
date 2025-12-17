import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '../src/buttons/Button';

const meta: Meta<typeof Button> = {
  title: 'Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    radius: {
      control: { type: 'select' },
      options: ['big', 'small', 0, 5, 10, 15, 20],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          const importLine = `import Button from 'uibora/buttons';`;
          return source.includes('import Button') ? source : `${importLine}\n\n${source}`;
        },
        language: 'tsx',
      },
    },
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const ContainedDefault: Story = {
  args: {
    variant: 'contained',
    children: 'enabled'
  },
};

export const ContainedReadonly: Story = {
  args: {
    variant: 'contained',
    children: 'disabled',
    readonly: true
  },
};

export const ContainedDestructive: Story = {
  args: {
    variant: 'contained',
    children: 'delete',
    color: '#ca2323'
  },
};

export const ContainedValid: Story = {
  args: {
    variant: 'contained',
    children: 'accept',
    color: '#289123'
  },
};

export const OutlineDefault: Story = {
  args: {
    children: 'enabled'
  },
};

export const OutlineReadonly: Story = {
  args: {
    children: 'disabled',
    readonly: true
  },
};

export const OutlineDestructive: Story = {
  args: {
    children: 'delete',
    color: '#ca2323'
  },
};

export const OutlineValid: Story = {
  args: {
    children: 'accept',
    color: '#289123'
  },
};