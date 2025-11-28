import type { Meta, StoryObj } from '@storybook/react-vite';
import InfiniteSlides from '../src/presenters/InfiniteSlides';

const meta: Meta<typeof InfiniteSlides> = {
  title: 'Presenters/Infinite Slides',
  component: InfiniteSlides,
  tags: ['autodocs'],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof InfiniteSlides>;

export const Default: Story = {
  args: {
    slides: [<div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/barriere_corail_reunion_.JPG')" }}></div>,
    <div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/Volcan_hekla_.JPG')" }}></div>,
    <div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/silice_.JPG')" }}></div>,
    <div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/champignon_.JPG')" }}></div>,
    ],
    style: { height: '30dvh', width: '100%' }
  },
};

export const DelayCustom: Story = {
  args: {
    slides: [<div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/barriere_corail_reunion_.JPG')" }}></div>,
    <div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/Volcan_hekla_.JPG')" }}></div>,
    <div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/champignon_.JPG')" }}></div>,
    ],
    delay: 6000,
    style: { height: '30dvh', width: '100%' }
  },
};