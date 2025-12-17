import clsx from "clsx";
import { useMemo, type HtmlHTMLAttributes } from "react";
import { useAccessibilityCompliance } from "../hooks";
import s from './Button.module.scss';
import { ButtonSize } from "./models/ButtonSize";

export interface IButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    /**
     * Indicates whether the button is read-only.
     * When true, the button is displayed but not interactive.
     */
    readonly?: boolean;

    /**
     * Defines the size of the button.
     * Must be a predefined value from the ButtonSize enum.
     */
    size?: ButtonSize;

    /**
     * Specifies the border radius of the button.
     * - 'small': slightly rounded corners.
     * - 'big': highly rounded corners (circular).
     * - number: custom radius in pixels (e.g., 8 for 8px).
     */
    radius?: 'small' | 'big' | number;

    /** Color of the button */
    color?: string;

    /** Style of the button */
    variant?: 'outline' | 'contained' | 'text'
}

const Button = ({
    role,
    readonly = false,
    size = ButtonSize.medium,
    radius = 'big',
    color = 'rgb(var(--uib-color-primary))',
    variant = 'outline',
    className,
    ...props
}: IButtonProps) => {
    const rippleColor = variant === 'contained' ? 'rgb(var(--uib-color-primary-foreground))' : color;

    const uac = useAccessibilityCompliance<HTMLButtonElement>({
        role: role ?? 'button',
        readonly,
        rippleColor: rippleColor,
        rippleOverflowAreaSize: 1,
    }, [props]);

    const radiusSize = useMemo(() => {
        if (typeof radius === 'number') {
            return `${radius}px`
        }
        else {
            switch (radius) {
                case 'big': return 'var(--uib-material-border-radius-big)';
                case 'small': return 'var(--uib-material-border-radius-small)';
                default: return '0';
            }
        }
    }, [radius])

    return <button
        className={clsx(s['button'], s[`button--variant-${variant}`], s[`button--size-${size}`], className)}
        {...props}
        {...uac}
        style={{ 
            ['--uib-button-radius' as any]: radiusSize,
            ['--uib-button-color' as any]: color
         }}
    />
}

export default Button;