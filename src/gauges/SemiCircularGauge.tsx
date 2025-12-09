import React, { useEffect, useState, type ReactNode } from "react";
import { NumberHelper } from "../helpers/NumberHelper";
import s from './SemiCircularGauge.module.scss';
import Separators from "./Separators";

export interface ISemiCircularGaugeProps {
    /** Current value in [0, 100] */
    value: number
    /** Overall size in pixels (width). Height will be ~ size/2 */
    size?: number
    /** Stroke width for the progress arc */
    progressThickness?: number
    /** Stroke width for the background track arc */
    trackThickness?: number
    /** Optional custom color; defaults to rgb(var(--uib-color-primary)) */
    color?: string
    /** Optional track color; defaults to a subtle alpha of the primary */
    trackColor?: string
    /** Add rounded caps for nicer ends (recommended) */
    roundedCaps?: boolean
    /** Optional title for accessibility */
    ariaLabel?: string
    /** visual gap between track and progress */
    inset?: number
    /** Show/hide the needle */
    needleShow?: boolean
    /** Color of the needle line; defaults to currentColor (inherits) */
    needleColor?: string
    /** Thickness of the needle line */
    needleThickness?: number
    /** Needle length in percent */
    needleLength?: number
    /** separators */
    separators?: ReactNode
    /** Text */
    text?: string
    /** Text size */
    textSize?: number
}

const SemiCircularGauge = ({
    value,
    size = 240,
    progressThickness = 6,
    trackThickness = 6,
    color = "rgb(var(--uib-color-primary))",
    trackColor = "color-mix(in oklab, rgb(var(--uib-color-primary)) 30%, white 70%)",
    roundedCaps = true,
    ariaLabel = "Semi-circular progress",
    inset = 0,
    needleShow = false,
    needleLength = 80,
    needleColor = "rgb(var(--uib-color-primary))",
    needleThickness = 2,
    separators,
    text,
    textSize = 16
}: ISemiCircularGaugeProps) => {
    const [domValue, setDomValue] = useState(0);
    // Clamp value to [0, 100]
    const pct = NumberHelper.clamp(domValue, 0, 100);

    // Normalized viewBox so math is layout-independent.
    const vbSize = 100;
    const cx = 50;
    const cy = 50;

    // Outer radius for the track; leave padding so stroke doesn't clip.
    const padding = 2;
    const radiusTrack = 45 - padding;

    // Progress is drawn slightly inside to mimic the “double arc” look.
    const radiusProgress = radiusTrack - inset;

    // Arc path for the upper half-circle (from left to right over the top).
    const arcPath = (r: number) => `M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`;

    // Normalize dash math with pathLength=100 -> full arc length == 100 units.
    const pathLength = 100;
    const dashArrayProgress = `${pct} ${pathLength - pct}`;

    // Rounded caps look better for progress
    const lineCap = roundedCaps ? "round" : "butt";

    // Component dimensions: width = size, height = half of size with a bit of margin
    const width = size;
    const height = Math.ceil(size * 0.55);

    // needle size and geometry
    const outerRadius = radiusTrack + trackThickness / 2;
    const needleLen = outerRadius * NumberHelper.clamp(needleLength / 100, 0, 100);
    const tipWidth = 0;
    const halfTip = tipWidth / 2;
    const wedgePoints = [
        `${cx},${cy - needleThickness}`,
        `${cx},${cy + needleThickness}`,
        `${cx + needleLen},${cy + halfTip}`,
        `${cx + needleLen},${cy - halfTip}`,
    ].join(" ");

    // Angle as degrees : 0..100 -> 180deg..0deg
    const angleDeg = 180 - (180 * pct) / 100;

    const separatorsClone = separators && React.isValidElement(separators) && (separators.type === SemiCircularGauge.Separators)
        ? React.cloneElement(separators, { cx, cy, outerRadius })
        : null;


    useEffect(() => {
        // Delay to let CSS see an initial state
        const t = setTimeout(() => setDomValue(value), 1);
        return () => clearTimeout(t);
    }, [value]);

    return (
        <svg
            className={s['semi-circular-gauge']}
            width={width}
            height={height}
            viewBox={`0 0 ${vbSize} ${vbSize / 2}`}
            role="img"
            aria-label={`${ariaLabel}: ${pct}%`}
        >
            {/* Track (thin outer semi-circle) */}
            <path
                d={arcPath(radiusTrack)}
                fill="none"
                stroke={trackColor}
                strokeWidth={trackThickness}
                strokeLinecap={lineCap}
                pathLength={pathLength}
            />

            {/* Progress (inner semi-circle) */}
            <path
                className={s['semi-circular-gauge__progress']}
                d={arcPath(radiusProgress)}
                fill="none"
                stroke={color}
                strokeWidth={progressThickness}
                strokeLinecap={lineCap}
                pathLength={pathLength}
                // Show only pct% of the arc
                strokeDasharray={dashArrayProgress}
                strokeDashoffset={0}
            />

            {/* Needle */}
            {needleShow && <g
                className={s["semi-circular-gauge__needle"]}
                style={{ transform: `rotate(-${angleDeg}deg)` }} // <-- CSS property so transition applies
            >
                <polygon
                    points={wedgePoints}
                    fill={needleColor} // use the needle color as fill
                />
                {needleThickness > 0 && (
                    <circle cx={cx} cy={cy} r={needleThickness} fill={needleColor} />
                )}
            </g>}

            {separatorsClone !== null && <>
                {separatorsClone}
            </>
            }
            {text &&
                <text
                    className={s["semi-circular-gauge__text"]}
                    x="50"
                    y="70%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontWeight="bold"
                    fontSize={textSize}
                >
                    {text}
                </text>
            }

        </svg>
    );
};

SemiCircularGauge.Separators = Separators;
export default SemiCircularGauge;
