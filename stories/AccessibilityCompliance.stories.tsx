import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import useAccessibilityCompliance from '../src/hooks/useAccessibilityCompliance';

const RippleButton: React.FC = () => {
  const uac1 = useAccessibilityCompliance<HTMLDivElement>({ role: 'button' }, []);
  const uac2 = useAccessibilityCompliance<HTMLInputElement>({ role: 'button' }, []);

  const btnStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px 20px',
        background: 'rgb(224, 224, 224)',
        cursor: 'pointer',
        userSelect: 'none',
        fontSize: '16px',
        borderRadius: 5
      } as CSSProperties;

  return <div style={{ fontFamily: 'var(--uib-font-family)', color: 'rgb(var(--uib-color-text));', display: 'flex', gap: '1em' }}>
    <div
      {...uac1}
      style={btnStyles}
    >
      Button 1
    </div>
    <div
      {...uac2}
      style={btnStyles}
    >
      Button 2
    </div>
  </div>
};

const meta: Meta<typeof RippleButton> = {
  title: 'Hooks/Accessibility Compliance',
  component: RippleButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'This hook makes any element keyboard-accessible and adds a ripple effect on click, focus, or keyboard activation (Enter/Space).',
      },
      source: {
        code: `import React from 'react';
import useAccessibilityCompliance from 'uibora/hooks;

export const MyComponent = () => {
  const uac = useAccessibilityCompliance<HTMLDivElement>({ role: 'button' });

  const handleClick = () => {
    //do something on click
  }

  return <div {...uac} onClick={handleClick}>click me</div>
}`
      },
      language: 'tsx',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RippleButton>;


export const Default: StoryObj<typeof RippleButton> = {
  render: () => <RippleButton />
}