import clsx from 'clsx';
import { useEffect, useState, type HtmlHTMLAttributes, type MouseEventHandler } from 'react';
import useAccessibilityCompliance from '../hooks/useAccessibilityCompliance';
import s from './Switch.module.scss';

interface ISwitchProps extends HtmlHTMLAttributes<HTMLDivElement> {
    value?: boolean
    onChange?: MouseEventHandler<HTMLInputElement>
    onSwitchToggle?: (checked: boolean) => void
    size?: 'small' | 'medium'
    readonly?: boolean
    formName?: string
}

const Switch = ({
    value = false,
    onChange,
    onSwitchToggle,
    readonly = false,
    formName,
    className,
    size = 'medium',
    ...props
}: ISwitchProps) => {
    const [checked, setChecked] = useState<boolean>(value === true);
    const uac = useAccessibilityCompliance<HTMLDivElement>({ role: 'button' });

    const toogleState = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        console.log('switch');
        onSwitchToggle && onSwitchToggle(!checked);

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
        className={clsx(s['switch'], checked ? s['switch--state-checked'] : '', s[`switch--size-${size}`], readonly ? s[`switch--is-readonly`] : '', className)}
        onClick={toogleState}
        aria-readonly={readonly}
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