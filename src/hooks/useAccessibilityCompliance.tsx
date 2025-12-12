import { type DependencyList, useEffect, useRef } from 'react';

const useAccessibilityCompliance = <T extends HTMLElement>({ role = 'link' }: { role?: string } = {}, dependencies?: DependencyList) => {
    const handleClick = (onClick: () => void) => (event: MouseEvent | KeyboardEvent) => {
        // Check if the event is triggered by the Enter key
        const isEnterKey = event.type === 'keydown' && (event as KeyboardEvent).key === 'Enter';
        // Check if the event is triggered by the Space key
        const isSpaceKey = event.type === 'keydown' && (event as KeyboardEvent).key === ' ';

        if (isEnterKey || isSpaceKey) {
            onClick();
        }
    };

    const elementRef = useRef<T | null>(null);

    useEffect(() => {
        const element = elementRef.current;

        if (element) {
            // Set tabindex to make the element focusable
            element.setAttribute('tabindex', '0');
            // Set role attribute
            element.setAttribute('role', role);

            const handleClickEvent = handleClick(() => {
                elementRef.current?.click();
            });

            // Attach event listeners
            element.addEventListener('keydown', handleClickEvent);

            return () => {
                // Clean up event listeners
                element.removeEventListener('keydown', handleClickEvent);
            };
        }

        return () => { }
    }, dependencies ?? []);

    return { ref: elementRef };
};

export default useAccessibilityCompliance;
