import type { Meta, StoryObj } from '@storybook/react-vite';
import SplitButton from '../src/buttons/SplitButton';
import { ButtonSize } from '../src/buttons/models/ButtonSize';

const meta = {
  title: 'Buttons/Split Button',
  component: SplitButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          const importLine = `import SplitButton, { ButtonSize } from 'uibora/buttons';`;
          return source.includes('import SplitButton') ? source : `${importLine}\n\n${source}`;
        },
        language: 'tsx',
      },
    },
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Medium: Story = {
  render: () => (
    <SplitButton
      activeTab={0}
      className="custom"
      size={ButtonSize.medium}
    >
      <SplitButton.Action title="Month" onClick={() => console.log('Month')} />
      <SplitButton.Action title="Week" onClick={() => console.log('Week')} />
      <SplitButton.Action title="Day" onClick={() => console.log('Day')} />
    </SplitButton>
  ),
};

export const Small: Story = {
  render: () => (
    <SplitButton
      activeTab={0}
      className="custom"
      size={ButtonSize.small}
    >
      <SplitButton.Action title="Month" onClick={() => console.log('Month')} />
      <SplitButton.Action title="Week" onClick={() => console.log('Week')} />
      <SplitButton.Action title="Day" onClick={() => console.log('Day')} />
    </SplitButton>
  ),
};


