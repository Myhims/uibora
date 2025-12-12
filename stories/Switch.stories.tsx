import type { Meta, StoryObj } from '@storybook/react-vite';
import Switch from '../src/simple/Switch';

const meta: Meta<typeof Switch> = {
  title: 'Simple/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
  },
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          const importLine = `import Switch from 'uibora/simple';`;
          return source.includes('import Switch') ? source : `${importLine}\n\n${source}`;
        },
        language: 'tsx',
      },
    },
  }
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
  },
};
