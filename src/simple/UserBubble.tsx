import clsx from "clsx";
import React, { type HtmlHTMLAttributes } from "react";
import { ColorHelper } from "../helpers/ColorHelper";
import s from "./UserBubble.module.scss";

export enum UserBubbleSize {
    xs = 12,
    s = 24,
    m = 32,
    l = 48,
    xl = 72,
    xxl = 96
}

export interface IUserBubbleProps extends HtmlHTMLAttributes<HTMLDivElement> {
    size?: UserBubbleSize;
    firstName: string;
    lastName: string;
    imageSrc?: string; // Optional profile image path
    withRing?: boolean; // Optional subtle ring/border
    backgroundColor?: string; // Optional override for background color
    color?: string; // Optional override for text color
}

/** Extract initials */
const getInitials = (firstName: string, lastName: string): string => {
    if (firstName.length < 1 || lastName.length < 1)
        return "?";
    return `${firstName.trim()[0]}${lastName.trim()[0]}`.trim();
}

/** Compute font size relative to bubble size */
const fontSizeFor = (px: number): number => {
    if (px <= UserBubbleSize.xs) return 6;
    if (px <= UserBubbleSize.s) return 12;
    if (px <= UserBubbleSize.m) return 14;
    if (px <= UserBubbleSize.l) return 22;
    if (px <= UserBubbleSize.xl) return 32;
    return 40;
}

export const UserBubble = ({
    size = UserBubbleSize.m,
    firstName,
    lastName,
    imageSrc,
    withRing = false,
    backgroundColor,
    color,
    className,
    ...props
}: IUserBubbleProps) => {
    const hsl = ColorHelper.textsToHsl(`${firstName.trim().toLowerCase()} ${lastName.trim().toLowerCase()}`);
    const computedBg = backgroundColor ?? `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}%)`;
    const computedText = color ?? ColorHelper.hslToTextColor(hsl);
    const fontSize = fontSizeFor(size);
    const ringSize = Math.max(1, Math.round(size * 0.06));

    // CSS custom properties allow styling in SCSS without inline CSS rules
    const styleVars: React.CSSProperties = {
        // Size, background, text color, font size and ring thickness exposed as CSS variables
        // so the SCSS can consume them.
        ["--user-bubble-size" as any]: `${size}px`,
        ["--user-bubble-bg" as any]: computedBg,
        ["--user-bubble-color" as any]: computedText,
        ["--user-bubble-font-size" as any]: `${fontSize}px`,
        ["--user-bubble-ring" as any]: withRing ? `${ringSize}px` : "0px",
    };

    const ariaLabel = `${firstName} ${lastName}${imageSrc ? "" : ` (${getInitials(firstName, lastName)})`}`;

    return <div
        className={clsx(s["user-bubble"], withRing ? s["user-bubble--ring"] : '')}
        style={styleVars}
        role="img"
        aria-label={ariaLabel}
        {...props}
    >
        {imageSrc ? (
            <div
                style={{ backgroundImage: `url('${imageSrc}')` }}
                className={s["user-bubble__img-src"]}
            />
        ) : (
            <span className={s["user-bubble__initials"]}>
                {getInitials(firstName, lastName)}
            </span>
        )}
    </div>
};

export default UserBubble;
