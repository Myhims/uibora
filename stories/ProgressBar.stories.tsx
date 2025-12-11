import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import ProgressBar from '../src/progress/ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Progress/Progress Bar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          const importLine = `import ProgressBar from 'uibora/progress';`;
          return source.includes('import ProgressBar') ? source : `${importLine}\n\n${source}`;
        },
        language: 'tsx',
      },
    },
  },
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
