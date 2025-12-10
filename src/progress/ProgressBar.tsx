
import clsx from 'clsx';
import { useEffect, useState, type HtmlHTMLAttributes } from 'react';
import { ColorHelper } from '../helpers/ColorHelper';
import { NumberHelper } from '../helpers/NumberHelper';
import s from './ProgressBar.module.scss';

type LineCap = 'butt' | 'round' | 'square';

export interface ProgressBarProps extends HtmlHTMLAttributes<HTMLDivElement> {
    /** Progress value in percent (0..100) */
    value: number;
    /** Track background color */
    backgroundColor?: string;
    /** Progress color (ignored if autoColor is true) */
    fillColor?: string;
    /** If true, color is computed from value (red -> yellow -> green) */
    autoColor?: boolean;
    /** Stroke line cap: 'round' | 'square' */
    linecap?: 'round' | 'square';
    /** Stroke thickness (px units in the viewBox) */
    thickness?: number;
    /** Accessible label for screen readers */
    ariaLabel?: string;
    /** Text to show */
    valuePosition?: 'hidden' | 'start' | 'end' | 'center'
}

export const ProgressBar = ({
    value = 0,
    backgroundColor = 'rgb(var(--uib-disabled-color))',
    fillColor = 'rgb(var(--uib-color-primary))',
    autoColor = false,
    linecap = 'round',
    thickness = 11,
    ariaLabel = 'progress',
    valuePosition = 'hidden',
    className,
    ...props
}: ProgressBarProps) => {
    const [clamped, setClamped] = useState<number>(0);
    const strokeColor = autoColor ? ColorHelper.valueToAutoColor(clamped) : fillColor;

    useEffect(() => {
        setTimeout(() => {
            setClamped(NumberHelper.clamp(value, 0, 100));
        }, 1);
    }, [value])

    return <div
        {...props}
        className={clsx(s['progress-bar'], s[`progress-bar--style-${linecap}`], className)}
        style={{ height: thickness, backgroundColor }}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
    >
        <div className={s['progress-bar__fill']}
            style={{
                backgroundColor: strokeColor,
                height: thickness,
                width: `${clamped}%`
            }} >
            {valuePosition !== 'hidden' &&
                <div className={s['progress-bar__fill__text']}
                    style={{
                        justifyContent: valuePosition,
                        color: backgroundColor,
                        fontSize: thickness - 2
                    }}>
                    {clamped}%
                </div>
            }
        </div>
    </div>
};

export default ProgressBar;
