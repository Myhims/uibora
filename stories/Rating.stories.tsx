import type { Meta, StoryObj } from '@storybook/react-vite';
import Rating from '../src/simple/Rating';

const meta: Meta<typeof Rating> = {
  title: 'Simple/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
  },
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          const importLine = `import Rating from 'uibora/simple';`;
          return source.includes('import Rating') ? source : `${importLine}\n\n${source}`;
        },
        language: 'tsx',
      },
    },
  }
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    onChange: (event) => {
      // Exemple : lire la valeur de l'input
      console.log('onChange event:', event.currentTarget.value);
    },
    initialValue: 3
  },
};
