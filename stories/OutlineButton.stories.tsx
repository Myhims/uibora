import type { Meta, StoryObj } from '@storybook/react-vite';
import OutlineButton from '../src/buttons/OutlineButton';

const meta: Meta<typeof OutlineButton> = {
  title: 'Buttons/Outline Button',
  component: OutlineButton,
  tags: ['autodocs'],
  argTypes: {
    radius: {
      control: { type: 'select' },
      options: ['big', 'small', 0, 5, 10, 15, 20],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium'],
    },
  },
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          const importLine = `import OutlineButton from 'uibora/buttons';`;
          return source.includes('import OutlineButton') ? source : `${importLine}\n\n${source}`;
        },
        language: 'tsx',
      },
    },
  }
};

export default meta;
type Story = StoryObj<typeof OutlineButton>;

export const Default: Story = {
  args: {
    children: 'enabled'
  },
};

export const Readonly: Story = {
  args: {
    children: 'disabled',
    readonly: true
  },
};

export const Destructive: Story = {
  args: {
    children: 'delete',
    color: '#ca2323'
  },
};

export const Valid: Story = {
  args: {
    children: 'accept',
    color: '#289123'
  },
};