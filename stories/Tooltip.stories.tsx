import type { Meta, StoryObj } from '@storybook/react-vite';
import Tooltip from '../src/simple/Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Simple/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          const importLine = `import Tooltip from 'uibora/simple';`;
          return source.includes('import Tooltip') ? source : `${importLine}\n\n${source}`;
        },
        language: 'tsx',
      },
    },
  },
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    placement: 'bottom',
    title: <span>Lorem ipsum<br />on multiple line<br /><u>With HTML</u></span>,
    children: <span style={{ color: 'rgb(var(--uib-color-text))' }}>Hover me !</span>
  },
};

