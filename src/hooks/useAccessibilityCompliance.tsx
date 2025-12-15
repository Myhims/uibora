
import { type DependencyList, useEffect, useRef } from 'react';

type AccessibilityComplianceHookOptions = {
    role?: string
};

const useAccessibilityCompliance = <T extends HTMLElement>(
    { role = 'link' }: AccessibilityComplianceHookOptions = {},
    dependencies?: DependencyList
) => {
    const elementRef = useRef<T | null>(null);

    useEffect(() => {
        const el = elementRef.current;
        if (!el) return;

        // Accessibility
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', role);

        // Ensure ripple container (and remember previous styles to restore on cleanup)
        const prevPosition = getComputedStyle(el).position;
        const prevOverflow = el.style.overflow;
        const prevZIndex = el.style.zIndex;

        if (prevPosition === 'static') {
            el.style.position = 'relative';
        }

        // We will toggle overflow depending on the size
        const ensureOverflowPolicy = () => {
            const rect = el.getBoundingClientRect();
            const tooSmall = rect.width < 34 || rect.height < 34;
            el.style.overflow = tooSmall ? 'visible' : 'hidden';
            if (tooSmall) {
                el.style.zIndex = el.style.zIndex || '0';
            } else {
                el.style.zIndex = prevZIndex;
            }
        };

        // Initial overflow decision
        ensureOverflowPolicy();

        const rippleHost = document.createElement('span');
        rippleHost.setAttribute('aria-hidden', 'true');
        rippleHost.style.position = 'absolute';
        rippleHost.style.inset = '0';
        rippleHost.style.pointerEvents = 'none';
        rippleHost.style.contain = 'layout style'; // helps avoid layout bleed
        el.appendChild(rippleHost);

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const RIPPLE_COLOR = 'rgba(var(--uib-color-primary), .7)';
        const RIPPLE_DURATION_MS = 550;

        const spawnRipple = (localX: number, localY: number, rect: DOMRect) => {
            if (prefersReduced) return;

            const maxX = Math.max(localX, rect.width - localX);
            const maxY = Math.max(localY, rect.height - localY);
            const radius = Math.sqrt(maxX * maxX + maxY * maxY);

            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.width = ripple.style.height = `${radius * 2}px`;
            ripple.style.left = `${localX - radius}px`;
            ripple.style.top = `${localY - radius}px`;
            ripple.style.backgroundColor = RIPPLE_COLOR;
            ripple.style.opacity = '0.16';
            ripple.style.transform = 'scale(0)';
            ripple.style.transition = `transform ${RIPPLE_DURATION_MS}ms ease-out, opacity ${RIPPLE_DURATION_MS}ms ease-out`;
            rippleHost.appendChild(ripple);

            // Force layout, then animate
            ripple.getBoundingClientRect();
            ripple.style.transform = 'scale(1)';
            ripple.style.opacity = '0';

            ripple.addEventListener('transitionend', () => ripple.remove());
        };

        // Handlers
        const onPointerDown = (e: MouseEvent | PointerEvent) => {
            ensureOverflowPolicy(); // re-check in case size changed
            const rect = el.getBoundingClientRect();
            const x = (e as PointerEvent).clientX ?? (e as MouseEvent).clientX;
            const y = (e as PointerEvent).clientY ?? (e as MouseEvent).clientY;
            spawnRipple(x - rect.left, y - rect.top, rect);
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
                ensureOverflowPolicy();
                const rect = el.getBoundingClientRect();
                spawnRipple(rect.width / 2, rect.height / 2, rect);
            }
        };

        const onFocus = () => {
            ensureOverflowPolicy();
            const rect = el.getBoundingClientRect();
            spawnRipple(rect.width / 2, rect.height / 2, rect);
        };

        el.addEventListener('pointerdown', onPointerDown);
        el.addEventListener('mousedown', onPointerDown);
        el.addEventListener('keydown', onKeyDown);
        el.addEventListener('focus', onFocus);

        // Observe size changes to toggle overflow automatically
        const ro = new ResizeObserver(() => {
            ensureOverflowPolicy();
        });
        ro.observe(el);

        return () => {
            el.removeEventListener('pointerdown', onPointerDown);
            el.removeEventListener('mousedown', onPointerDown);
            el.removeEventListener('keydown', onKeyDown);
            el.removeEventListener('focus', onFocus);
            ro.disconnect();
            rippleHost.remove();
            if (prevPosition === 'static') el.style.position = '';
            el.style.overflow = prevOverflow;
            el.style.zIndex = prevZIndex;
        };
    }, dependencies ?? []);

    return { ref: elementRef };
};

export default useAccessibilityCompliance;
