import type { Meta, StoryObj } from '@storybook/react-vite';
import PrimaryButton from '../src/buttons/PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Buttons/PrimaryButton',
  component: PrimaryButton,
  tags: ['autodocs'],
  argTypes: {
  },
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          const importLine = `import PrimaryButton from 'uibora/buttons';`;
          return source.includes('import PrimaryButton') ? source : `${importLine}\n\n${source}`;
        },
        language: 'tsx',
      },
    },
  }
};

export default meta;
type Story = StoryObj<typeof PrimaryButton>;

export const Default: Story = {
  args: {
    children: 'enabled'
  },
};
