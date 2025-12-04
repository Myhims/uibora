import type { Meta, StoryObj } from '@storybook/react-vite';
import LargeSlider from '../src/presenters/LargeSlider';

const meta: Meta<typeof LargeSlider> = {
  title: 'Presenters/Large Slider',
  component: LargeSlider,
  tags: ['autodocs'],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof LargeSlider>;

const Slides = <div style={{ display: 'flex', gap: '1em' }}>
  <div style={{ width: 300, borderRadius: 8, height: 200, backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/barriere_corail_reunion_.JPG')" }}></div>
  <div style={{ width: 300, borderRadius: 8, height: 200, backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/Volcan_hekla_.JPG')" }}></div>
  <div style={{ width: 300, borderRadius: 8, height: 200, backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/silice_.JPG')" }}></div>
  <div style={{ width: 300, borderRadius: 8, height: 200, backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/champignon_.JPG')" }}></div>
  <div style={{ width: 300, borderRadius: 8, height: 200, backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/coucher_soleil_champs_.JPG')" }}></div>
  <div style={{ width: 300, borderRadius: 8, height: 200, backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/islande_fleur_jaune_.JPG')" }}></div>
  <div style={{ width: 300, borderRadius: 8, height: 200, backgroundPosition: 'center', backgroundImage: "url('https://uneimage.fr/photos/Toile_rosee_.JPG')" }}></div>
</div>

export const Default: Story = {
  args: {
    children: Slides,
    previousButton: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z" /></svg>,
    nextButton: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
  },
};
