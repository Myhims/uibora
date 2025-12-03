import type { Meta, StoryObj } from '@storybook/react-vite';
import DatesHelper from '../src/helpers/DatesHelper';
import DaysSelector from '../src/planner/schedulder/DaysSelector';

const meta: Meta<typeof DaysSelector> = {
  title: 'Planner/Days Selector',
  component: DaysSelector,
  tags: ['autodocs'],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof DaysSelector>;

const nowStart = new Date();
nowStart.setHours(0);
nowStart.setMinutes(0);

const nowEnd = new Date();
nowEnd.setHours(23);
nowEnd.setMinutes(59);

export const Default: Story = {
  args: {
    busyDays: [{
      id: 1,
      start: DatesHelper.addDays(nowStart, 5),
      end: DatesHelper.addDays(nowEnd, 10),
      title: 'holidays',
      color: '#b2a4ffff',
      notification: true
    },
    {
      id: 2,
      start: DatesHelper.addMonth(nowStart, 2),
      end: DatesHelper.addMonth(DatesHelper.addDays(nowEnd, 10), 2),
      title: 'holidays',
      color: '#b2a4ffff'
    }],
    previousButton : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg>,
    nextButton: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
  },
};



