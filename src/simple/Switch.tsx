import clsx from 'clsx';
import { useEffect, useState, type HtmlHTMLAttributes } from 'react';
import useAccessibilityCompliance from '../hooks/useAccessibilityCompliance';
import s from './Switch.module.scss';

interface ISwitchProps extends HtmlHTMLAttributes<HTMLDivElement> {
    /**
       * Current state of the switch.
       * `true` means ON, `false` means OFF.
       */
    value?: boolean
    /** 
     * Optional callback when the value changes 
     */
    onChange?: React.MouseEventHandler<HTMLInputElement>
    /**
     * Size of the switch component.
     * - `small`: compact version
     * - `medium`: default size
     */
    size?: 'small' | 'medium'
    /**
     * If true, the switch is read-only and cannot be toggled by the user.
     */
    readonly?: boolean
    /** 
     * Name of the form this component belongs to.
     * Useful for &lt;form&gt; post
     */
    formName?: string
}

const Switch = ({
    value = false,
    onChange,
    readonly = false,
    formName,
    className,
    size = 'medium',
    ...props
}: ISwitchProps) => {
    const [checked, setChecked] = useState<boolean>(value === true);
    const uac = useAccessibilityCompliance<HTMLDivElement>({ role: 'button', readonly }, [readonly]);

    const toogleState = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        if (onChange) {
            let eventEdit = { ...event };
            eventEdit.currentTarget.value = `${!checked}`;
            eventEdit.currentTarget.name = formName ?? '';

            onChange(eventEdit);
        }

        setChecked(!checked);
    }

    useEffect(() => {
        setChecked(value === true);
    }, [value])

    return <div
        {...props}
        {...uac}
        className={clsx(s['switch'], checked ? s['switch--state-checked'] : '', s[`switch--size-${size}`], className)}
        onClick={toogleState}
    >
        <div className={s['switch__thumb']}>
            <div className={s['switch__thumb__content']}>
                <div className={s['switch__thumb__content__icon']}></div>
            </div>
            <input
                type="checkbox"
                name={formName}
                checked={checked}
                readOnly
            />
        </div>
    </div >
}

export default Switch;