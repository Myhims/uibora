import type { Meta, StoryObj } from '@storybook/react-vite';
import Calendar from '../src/planner/Calendar/Calendar';

const meta = {
  title: 'Planner/Calendar',
  component: Calendar,
  parameters: {

  },
  tags: ['autodocs'],
  argTypes: {
  },
  args: {
    calendarEvents: [
      {startedOn : new Date(2025, 10, 16, 10, 0, 0), finishedOn : new Date(2025, 10, 19, 20, 0, 0), title : 'An event'},
      {startedOn : new Date(2025, 10, 1, 10, 0, 0), finishedOn : new Date(2025, 10, 1, 20, 0, 0), title : 'Happy birthday'},
      {startedOn : new Date(2025, 10, 6, 10, 0, 0), finishedOn : new Date(2025, 10, 7, 20, 0, 0), title : 'Training course'},
      {startedOn : new Date(2025, 10, 7, 10, 0, 0), finishedOn : new Date(2025, 10, 8, 20, 0, 0), title : 'Par ici'},
      {startedOn : new Date(2025, 10, 7, 10, 0, 0), finishedOn : new Date(2025, 10, 7, 20, 0, 0), title : 'Rendez-vous'},
      {startedOn : new Date(2025, 10, 5, 10, 0, 0), finishedOn : new Date(2025, 10, 6, 20, 0, 0), title : 'Scrum'},
      {startedOn : new Date(2025, 10, 8, 10, 0, 0), finishedOn : new Date(2025, 10, 9, 20, 0, 0), title : 'Rendez-vous'},
    ]
   },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultView: Story = {
  args: {
  },
};

