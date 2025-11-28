import type { Meta, StoryObj } from '@storybook/react-vite';
import Spinner from '../src/progress/Spinner';


const meta: Meta<typeof Spinner> = {
  title: 'Progress/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'big', 'full'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Big: Story = {
  args: {
    size: 'big',
  },
};



