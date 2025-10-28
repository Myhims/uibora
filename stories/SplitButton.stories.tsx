import type { Meta, StoryObj } from '@storybook/react-vite';
import SplitButton from '../src/buttons/SplitButton';
import { SplitButtonSize } from '../src/buttons/models/SplitButtonSize';

const meta = {
  title: 'Buttons/SplitButton',
  component: SplitButton,
  parameters: {},
  tags: ['autodocs'],
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
      size={SplitButtonSize.medium}
    >
      <SplitButton.Tab title="Month" onClick={() => console.log('Month')} />
      <SplitButton.Tab title="Week" onClick={() => console.log('Week')} />
      <SplitButton.Tab title="Day" onClick={() => console.log('Day')} />
    </SplitButton>
  ),
};

export const Small: Story = {
  render: () => (
    <SplitButton
      activeTab={0}
      className="custom"
      size={SplitButtonSize.small}
    >
      <SplitButton.Tab title="Month" onClick={() => console.log('Month')} />
      <SplitButton.Tab title="Week" onClick={() => console.log('Week')} />
      <SplitButton.Tab title="Day" onClick={() => console.log('Day')} />
    </SplitButton>
  ),
};


