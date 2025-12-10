import clsx from "clsx";
import React, { type HTMLAttributes, useEffect, useRef, useState } from 'react';
import type { SplitButtonAction } from './models/SplitButtonAction';
import { SplitButtonSize } from './models/SplitButtonSize';
import s from './SplitButton.module.scss';

interface SplitButtonProps extends HTMLAttributes<HTMLDivElement> {
    size?: SplitButtonSize
    activeTab?: number
    children: React.ReactElement<SplitButtonAction> | React.ReactElement<SplitButtonAction>[]
}

const SplitButton = ({
    size = SplitButtonSize.small,
    activeTab = 0,
    className,
    children,
    ...defaults
}: SplitButtonProps) => {
    const domSelectorNode = useRef<HTMLDivElement>(null);
    const buttonsRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(activeTab);
    const [readyClass, setReadyClass] = useState<string | undefined>('');

    const tabChildren = React.Children.toArray(children) as React.ReactElement<SplitButtonAction>[];

    const moveSelector = (index: number, doCommand: boolean) => {
        const node = buttonsRefs.current[index];
        const selector = domSelectorNode.current;
        if (node && selector) {
            selector.style.left = `calc(${node.offsetLeft}px - 1em)`;
            selector.style.width = `calc(${node.clientWidth}px + 1.7em)`;
            selector.style.top = `calc(${node.offsetTop}px - 7px)`;
        }

        const command = tabChildren[index]?.props.onClick;
        if (command && doCommand) {
            setTimeout(() => {
                command();
            }, 300);
        }

        setSelectedIndex(index);
    };

    useEffect(() => {
        moveSelector(activeTab, false);
    }, [activeTab])

    useEffect(() => {
        const timeoutTab = setTimeout(() => moveSelector(selectedIndex, false), 100);
        const timeoutClass = setTimeout(() => setReadyClass(s['split-button__nodes__node-selector--state-loaded']), 300);

        return () => {
            clearTimeout(timeoutTab);
            clearTimeout(timeoutClass);
        };
    }, []);

    return <div {...defaults} className={clsx(s['split-button'], className, s[`split-button--size-${size}`])}>
        <div className={s['split-button__nodes']}>
            <div ref={domSelectorNode} className={clsx(s['split-button__nodes__node-selector'], readyClass)} />
            {tabChildren.map((child, index) => (
                <button
                    key={index}
                    ref={el => { buttonsRefs.current[index] = el; }}
                    role="tab"
                    className={clsx(s['split-button__nodes__node'], selectedIndex === index ? s['split-button__nodes__node--state-selected'] : '')}
                    onClick={() => moveSelector(index, true)}
                    title={child.props.title}
                >
                    {child.props.title}
                </button>
            ))}
        </div>
    </div>
};

// Compound subcomponent
const Action: React.FC<SplitButtonAction> = () => null;
SplitButton.Action = Action;
(SplitButton.Action as any).displayName = 'SplitButton.Action';

export default SplitButton;
