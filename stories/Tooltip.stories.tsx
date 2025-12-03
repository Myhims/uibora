import type { Meta, StoryObj } from '@storybook/react-vite';
import Tooltip from '../src/simple/Tooltip';


const meta: Meta<typeof Tooltip> = {
  title: 'Simple/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Small: Story = {
  args: {
    placement: 'bottom',
    title: <span>Lorem ipsum<br/>on multiple line<br/><u>With HTML</u></span>,
    children: <span>Hover me !</span>
  },
};

