import React, { type JSX } from "react";

export interface ISeparatorsProps {
    /** Set by the gauge component, leave undefined */
    cx?: number;
    /** Set by the gauge component, leave undefined */
    cy?: number;
    /** Set by the gauge component, leave undefined */
    outerRadius?: number;

    /** Tick length (radial, toward the center) */
    length?: number;

    /** Step in percent (e.g., 10 -> 10%, 20%, ...). Must be > 0 and <= 100 */
    step?: number;

    /** Include 0% and 100% ticks */
    includeEnds?: boolean;

    /** Optional inward offset (moves both tick points toward the center) */
    inset?: number;

    /** Stroke style */
    color?: string;
    thickness?: number;
    lineCap?: "round" | "butt";

    /** Optional: start/end percentage of the arc (default 0..100 for a top semicircle) */
    startPercent?: number;
    endPercent?: number;
}

const Separators: React.FC<ISeparatorsProps> = ({
    cx = 0,
    cy = 0,
    outerRadius = 0,
    length = 8,
    step = 10,
    includeEnds = true,
    inset = 7,
    color = "#9aa4b2",
    thickness = 1,
    lineCap = "round",
    startPercent = 0,
    endPercent = 100,
}) => {
    if (step <= 0 || startPercent >= endPercent) return null;

    // Effective radii (apply inward inset, then subtract length for inner point)
    const rOuter = Math.max(0, outerRadius - inset);
    const rInner = Math.max(0, rOuter - length);

    const ticks: JSX.Element[] = [];
    const start = Math.max(0, Math.min(100, startPercent));
    const end = Math.max(0, Math.min(100, endPercent));

    for (let p = start; p <= end; p += step) {
        if (!includeEnds && (p === start || p === end)) continue;

        // Map p% to angle on top semicircle: 0% -> 180deg, 100% -> 0deg
        const angleRad = Math.PI - (Math.PI * (p - start)) / (end - start);
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);

        const xOuter = cx + rOuter * cos;
        const yOuter = cy - rOuter * sin;
        const xInner = cx + rInner * cos;
        const yInner = cy - rInner * sin;

        ticks.push(
            <line
                key={`tick-${p}`}
                x1={xInner}
                y1={yInner}
                x2={xOuter}
                y2={yOuter}
                stroke={color}
                strokeWidth={thickness}
                strokeLinecap={lineCap}
            />
        );
    }

    return <g>{ticks}</g>;
};

export default Separators;
