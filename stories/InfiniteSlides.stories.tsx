import type { Meta, StoryObj } from '@storybook/react-vite';
import InfiniteSlides from '../src/presenters/InfiniteSlides';

const meta: Meta<typeof InfiniteSlides> = {
  title: 'Presenters/Infinite Slides',
  component: InfiniteSlides,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          const importLine = `import InfiniteSlides from 'uibora/presenters';`;
          return source.includes('import InfiniteSlides') ? source : `${importLine}\n\n${source}`;
        },
        language: 'tsx',
      },
    },
  },
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof InfiniteSlides>;
const Slides = [<div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/barriere_corail_reunion_.JPG')" }}></div>,
<div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/Volcan_hekla_.JPG')" }}></div>,
<div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/silice_.JPG')" }}></div>,
<div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/champignon_.JPG')" }}></div>,
<div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/coucher_soleil_champs_.JPG')" }}></div>,
<div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/islande_fleur_jaune_.JPG')" }}></div>,
<div style={{ height: '100%', backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/Toile_rosee_.JPG')" }}></div>,
]

export const Default: Story = {
  args: {
    slides: Slides,
    style: { height: '30dvh', width: '100%' }
  },
};

export const CustomProps: Story = {
  args: {
    slides: Slides,
    delay: 6000,
    visibleCards: 2,
    spacing: '5px',
    style: { height: '30dvh', width: '100%' }
  },
};