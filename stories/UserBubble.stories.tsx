import type { Meta, StoryObj } from '@storybook/react-vite';
import UserBubble, { UserBubbleSize } from '../src/simple/UserBubble';


const meta: Meta<typeof UserBubble> = {
  title: 'Simple/User Bubble',
  component: UserBubble,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: [UserBubbleSize.xs, UserBubbleSize.s, UserBubbleSize.m, UserBubbleSize.l, UserBubbleSize.xl],
    }
  }
};

export default meta;
type Story = StoryObj<typeof UserBubble>;

export const Default: Story = {
  args: {
    firstName: "John",
    lastName: "Doo"
  },
};

export const ThemeColor: Story = {
  args: {
    firstName: "John",
    lastName: "Doo",
    backgroundColor: "rgb(var(--uib-color-primary))"
  },
};

export const Many: Story = {
  render: (args) => {

    return <div style={{ display: 'flex', gap: '1em', alignItems: 'end' }}>
      <UserBubble firstName='Paola' lastName='Smith'  size={UserBubbleSize.xxl} imageSrc='https://uneimage.fr/photos/abeille_.JPG' />
      <UserBubble firstName='Rachel' lastName='Holloway'  size={UserBubbleSize.xxl} withRing />
      <UserBubble firstName='Gordon' lastName='Griffin'  size={UserBubbleSize.xxl} />
      <UserBubble firstName='Wendy' lastName='Copeland' size={UserBubbleSize.xl} />
      <UserBubble firstName='Victoria' lastName='Jefferson' size={UserBubbleSize.l} />
      <UserBubble firstName='Gavin' lastName='Nolan' size={UserBubbleSize.m} />
      <UserBubble firstName='Lola' lastName='Carrey' size={UserBubbleSize.m} withRing/>
      <UserBubble firstName='Carl' lastName='Brock' size={UserBubbleSize.s} />
      <UserBubble firstName='Abigail' lastName='Estrada' size={UserBubbleSize.xs} />
    </div>
  },
};