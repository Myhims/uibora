
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import Portal from './Portal';
import s from './Tooltip.module.scss';

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
    title: React.ReactNode | string;
    placement?: Placement;
    children: React.ReactElement; // Important: must be a single React element
}

const Tooltip: React.FC<TooltipProps> = ({
    title,
    placement = 'top',
    children,
}) => {
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [visible, setVisible] = useState(false);
    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!visible) return;

        const trigger = triggerRef.current;
        const tooltip = tooltipRef.current;
        if (!trigger || !tooltip) return;

        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (placement) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - 8;
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'bottom':
                top = triggerRect.bottom + 8;
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'left':
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                left = triggerRect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                left = triggerRect.right + 8;
                break;
        }

        const padding = 8;
        if (top < padding) top = padding;
        if (left < padding) left = padding;
        if (top + tooltipRect.height > window.innerHeight - padding) {
            top = window.innerHeight - tooltipRect.height - padding;
        }
        if (left + tooltipRect.width > window.innerWidth - padding) {
            left = window.innerWidth - tooltipRect.width - padding;
        }

        setStyle({ top, left, position: 'fixed' });
    }, [placement, title, visible]);

    // Inject handlers and ref into child
    const childWithProps = React.cloneElement(children as React.ReactElement<any>, {
        ref: triggerRef as React.Ref<any>,
        onMouseEnter: () => setVisible(true),
        onMouseLeave: () => setVisible(false),
    });

    return (
        <>
            {childWithProps}
            {visible && (
                <Portal parent={document.body}>
                    <div
                        ref={tooltipRef}
                        className={clsx(s.tooltip, s[`tooltip--state-${placement}`])}
                        style={style}
                    >
                        {title}
                    </div>
                </Portal>
            )}
        </>
    );
};

export default Tooltip;
