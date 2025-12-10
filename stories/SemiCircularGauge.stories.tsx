import type { Meta, StoryObj } from '@storybook/react-vite';
import SemiCircularGauge from '../src/gauges/SemiCircularGauge';

const meta: Meta<typeof SemiCircularGauge> = {
    title: 'Gauges/Semi Circular',
    component: SemiCircularGauge,
    tags: ['autodocs'],
    argTypes: {
    },
};

export default meta;
type Story = StoryObj<typeof SemiCircularGauge>;

export const Default: Story = {
    args: {
        value: 75
    },
};

export const Bold: Story = {
    args: {
        value: 75,
        trackThickness: 2,
        progressThickness: 8
    },
};

export const Separated: Story = {
    args: {
        value: 75,
        inset: 7,
        progressThickness: 5,
        trackThickness: 2,
        roundedCaps: false
    },
};

export const TextInside: Story = {
    args: {
        value: 75,
        inset: 0,
        progressThickness: 1,
        trackThickness: 4,
        roundedCaps: false,
        color: 'green',
        trackColor: '#ccc',
        textSuffix: '%'
    },
};

export const Needle: Story = {
    args: {
        value: 75,
        inset: 0,
        progressThickness: 3,
        trackThickness: 3,
        roundedCaps: true,
        needleShow: true
    },
};

export const Separators: Story = {
    args: {
        value: 75,
        separators: <SemiCircularGauge.Separators />
    },
};

export const Counter: Story = {
    args: {
        value: 75,
        inset: 7,
        color: '#269e26ff',
        trackColor: '#1c701cff',
        progressThickness: 5,
        trackThickness: 2,
        roundedCaps: false,
        needleShow: true,
        needleLength: 70,
        needleColor: '#3cca3cff',
        separators: <SemiCircularGauge.Separators color='#1c701cff' lineCap='butt' inset={6} length={10} thickness={.5}/>,
        textSuffix: 'km/h',
        textSize: 5
    },
};