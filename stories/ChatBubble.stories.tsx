import type { Meta, StoryObj } from '@storybook/react-vite';
import DatesHelper, { type HumanReadableTime } from '../src/helpers/DatesHelper';
import ChatBubble from '../src/simple/ChatBubble';
import type { IUserBubbleProps } from '../src/simple/UserBubble';

const meta: Meta<typeof ChatBubble> = {
  title: 'Simple/Chat Bubble',
  component: ChatBubble,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          const importLine = `import ChatBubble from 'uibora/simple';`;
          return source.includes('import ChatBubble') ? source : `${importLine}\n\n${source}`;
        },
        language: 'tsx',
      },
    },
  },
  argTypes: {
  }
};

export default meta;
type Story = StoryObj<typeof ChatBubble>;



const i18nAdapter = (time: HumanReadableTime): string => {
  if (time.unit === "date") {
    return String(time.value);
  }

  // Handle "now" unit
  if (time.unit === "now") {
    return "just now";
  }

  const numeric = typeof time.value === "number" ? time.value : Number(time.value);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return "just now";
  }

  const labels: Record<Exclude<HumanReadableTime["unit"], "date" | "now">, { singular: string; plural: string }> = {
    minute: { singular: "minute", plural: "minutes" },
    hour: { singular: "hour", plural: "hours" },
    day: { singular: "day", plural: "days" },
  };

  const unit = time.unit as keyof typeof labels;
  const { singular, plural } = labels[unit];

  const unitLabel = numeric === 1 ? singular : plural;

  return `${numeric} ${unitLabel} ago`;
};

export const Default: Story = {
  args: {
    user: { firstName: 'John', lastName: 'Doo' } as IUserBubbleProps,
    createdOn: DatesHelper.addHours(new Date(), -2),
    footer: <div style={{ fontSize: 9 }}>Delivered</div>,
    position: 'left',
    i18nDurationAdapter: i18nAdapter,
    children: <>Hello, how are you today ?</>
  },
};

export const Many: Story = {
  render: (args) => {
    return <div>
      <ChatBubble user={{ firstName: 'Paola', lastName: 'Smith' }} position='left' createdOn={DatesHelper.addHours(new Date(), -5)} i18nDurationAdapter={i18nAdapter}>
        Hi, I’ve always found quantum physics fascinating...
      </ChatBubble>
      <ChatBubble user={{ firstName: 'Paola', lastName: 'Smith' }} position='left' createdOn={DatesHelper.addHours(new Date(), -5)} i18nDurationAdapter={i18nAdapter} >
        Can you explain what it is in a few words?
      </ChatBubble>
      <ChatBubble user={{ firstName: 'Gordon', lastName: 'Griffin' }} position='right' createdOn={DatesHelper.addHours(new Date(), -4)} i18nDurationAdapter={i18nAdapter} backgroundColor='rgba(var(--uib-color-primary), .1)'>
        Sure! Quantum physics is the branch of physics that studies phenomena at the scale of subatomic particles, like electrons and photons. It describes a world where classical rules no longer apply.
      </ChatBubble>
      <ChatBubble user={{ firstName: 'Victoria', lastName: 'Jefferson' }} position='left' createdOn={DatesHelper.addHours(new Date(), -2)} i18nDurationAdapter={i18nAdapter}>
        So… particles can be in two places at the same time? Is that true or just a myth?
      </ChatBubble>
      <ChatBubble user={{ firstName: 'Gordon', lastName: 'Griffin' }} position='right' createdOn={DatesHelper.addMinutes(new Date(), -30)} i18nDurationAdapter={i18nAdapter}
        footer={<div style={{ fontSize: 9, textAlign: 'right' }}>Modified</div>} backgroundColor='rgba(var(--uib-color-primary), .1)'>
        It’s true in a certain sense. We call it superposition: a particle can exist in multiple states simultaneously until it’s measured. It’s one of the most counterintuitive concepts!
      </ChatBubble>
      <ChatBubble user={{ firstName: 'Lola', lastName: 'Carrey' }} position='left' createdOn={DatesHelper.addMinutes(new Date(), -1)} i18nDurationAdapter={i18nAdapter}>
        And Schrödinger’s cat, is that related to this?
      </ChatBubble>
      <ChatBubble user={{ firstName: 'Victoria', lastName: 'Jefferson' }} position='left' createdOn={DatesHelper.addHours(new Date(), -2)} i18nDurationAdapter={i18nAdapter} >
        Ahaha, asking good questions ^^
      </ChatBubble>
      <ChatBubble user={{ firstName: 'Gordon', lastName: 'Griffin' }} position='right' createdOn={new Date()} i18nDurationAdapter={i18nAdapter} backgroundColor='rgba(var(--uib-color-primary), .1)'>
        Exactly! It’s a thought experiment to illustrate superposition. The cat is both alive and dead until we observe the state of the system.
      </ChatBubble>
    </div>
  },
};