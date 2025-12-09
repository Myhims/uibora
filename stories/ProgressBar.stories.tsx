import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import ProgressBar from '../src/progress/ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Progress/Progress Bar',
  component: ProgressBar,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    value: 80,
    valuePosition: 'center',
  },
};

export const AutoColor: Story = {
  render: (args) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
      // Use an interval to increase the value from 0 to 100 continuously
      const id = setInterval(() => {
        setValue((v) => (v < 100 ? v + 5 : 0));
      }, 750);
      return () => clearInterval(id); // Clean up on unmount / HMR
    }, []);

    return (
      <ProgressBar
        {...args}
        value={value}
        autoColor
      />
    );
  },
};
