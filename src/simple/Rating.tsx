import clsx from "clsx";
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState, type HtmlHTMLAttributes, type MouseEventHandler, type ReactElement, } from "react";
import { NumberHelper } from "../helpers";
import { useAccessibilityCompliance } from "../hooks";
import s from './Rating.module.scss';

export interface IRatingProps extends HtmlHTMLAttributes<HTMLDivElement> {
    /** Number of items to display (default: 5) */
    count?: number
    /** Initial value: 0..count (uncontrolled mode). Ignored if `value` is provided. */
    initialValue?: number
    /** Disable all interactions */
    readonly?: boolean
    /** Optional callback when the rating value changes */
    onChange?: MouseEventHandler<HTMLInputElement>
    /** Optional className to customize styling */
    className?: string
    /** Custom svg icon path */
    iconPath?: ReactElement<SVGPathElement>
    /**
     * Optional controlled value. If provided, the component becomes controlled
     * and ignores internal state for `value`.
     */
    value?: number
    /** 
     * Name of the form this component belongs to.
     * Useful for &lt;form&gt; post
     */
    formName?: string
    /**
     * Color applied to the selected element or active state.
     * Accepts any valid CSS color value (e.g., hex, rgb, named color).
     */
    selectionColor?: string
    /**
     * Background color of the component.
     * Accepts any valid CSS color value (e.g., hex, rgb, named color).
     */
    backgroundColor?: string

};

export type RatingHandle = {
    /** Get current value (works in controlled and uncontrolled modes) */
    getValue: () => number;
    /** Programmatically set value (uncontrolled mode only) */
    setValue: (v: number) => void;
};

/** Applies the "no reset after >=1" rule and clamps within bounds */
const normalizeNext = (next: number, count: number, lockedNonZero: boolean) => {
    const clamped = NumberHelper.clamp(next, 0, count);
    if (lockedNonZero && clamped < 1) return 1; // prevent reset to 0
    return clamped;
}

const Rating = forwardRef<RatingHandle, IRatingProps>(function Rating(
    {
        count = 5,
        initialValue = 0,
        readonly = false,
        onChange,
        className,
        iconPath,
        formName,
        selectionColor = 'rgb(var(--uib-color-primary))',
        backgroundColor = 'color-mix(in srgb, rgb(var(--uib-color-primary)) 40%, white 60%)',
        value: controlledValue,
        ...props
    },
    ref
) {
    const [uncontrolledValue, setUncontrolledValue] = useState<number>(NumberHelper.clamp(initialValue, 0, count));
    const hasLockedNonZeroRef = useRef<boolean>(initialValue >= 1);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const uac = useAccessibilityCompliance<HTMLDivElement>({ role: 'radiogroup', readonly }, [readonly]);
    const value = controlledValue ?? uncontrolledValue;

    const items = useMemo(() => Array.from({ length: count }, (_, i) => i + 1), [count]);
    const displayValue = hoverIndex ?? value;

    useImperativeHandle(ref, () => ({
        getValue: () => value,
        setValue: (v: number) => {
            if (controlledValue !== undefined) return; // ignore in controlled mode
            const normalized = normalizeNext(v, count, hasLockedNonZeroRef.current);
            if (normalized >= 1) hasLockedNonZeroRef.current = true;
            setUncontrolledValue(normalized);
        },
    }));

    const commit = useCallback((event: React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<any>, next: number) => {
        const normalized = normalizeNext(next, count, hasLockedNonZeroRef.current);

        if (controlledValue === undefined) {
            setUncontrolledValue(normalized);
        }
        if (normalized >= 1) {
            hasLockedNonZeroRef.current = true;
        }

        if (onChange) {
            let eventEdit = { ...event };
            eventEdit.currentTarget.value = normalized;
            eventEdit.currentTarget.name = formName ?? '';

            onChange(eventEdit as React.MouseEvent<HTMLInputElement, MouseEvent>);
        }

    },
        [count, controlledValue, onChange]
    );

    const onItemClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, idx: number) => {
        if (!readonly)
            commit(e, idx);
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (readonly) return;

        const minAllowed = hasLockedNonZeroRef.current ? 1 : 0;

        if (e.key === "ArrowRight") {
            e.preventDefault();
            commit(e, Math.min(value + 1, count));
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            commit(e, Math.max(value - 1, minAllowed));
        } else if (e.key === "Home") {
            e.preventDefault();
            commit(e, minAllowed);
        } else if (e.key === "End") {
            e.preventDefault();
            commit(e, count);
        } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            commit(e, hoverIndex ?? value);
        }
    };

    return <div
        {...uac}
        className={clsx(s["rating"], className)}
        onKeyDown={onKeyDown}
        onMouseLeave={() => setHoverIndex(null)}
        {...props}
    >
        {items.map((i) => {
            const filled = i <= displayValue;
            return (
                <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={i === value}
                    aria-label={`${i} ${i === 1 ? "star" : "stars"}`}
                    disabled={readonly}
                    className={s['rating__item']}
                    onClick={(e) => onItemClick(e, i)}
                    onMouseEnter={() => !readonly && setHoverIndex(i)}
                    onFocus={() => setHoverIndex(null)}
                    style={{
                        cursor: readonly ? "not-allowed" : "pointer",
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                        className={s['rating__item__star']}
                        style={{ display: "block", color: filled ? selectionColor : backgroundColor }}
                    >
                        {iconPath || <path
                            d="M12 2l3.09 6.26 6.91.99-5 4.87 1.18 6.88L12 18.9 5.82 21l1.18-6.88-5-4.87 6.91-.99L12 2z"
                            fill="currentColor"
                        />}
                    </svg>
                </button>
            );
        })}
        {formName && <input
            type="input"
            name={formName}
            value={value}
            readOnly
        />}
    </div>
});

export default Rating;