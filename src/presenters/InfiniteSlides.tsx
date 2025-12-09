import clsx from 'clsx';
import { useEffect, useRef, useState, type HtmlHTMLAttributes, type ReactNode } from 'react';
import { NumberHelper } from '../helpers/NumberHelper';
import s from './InfiniteSlides.module.scss';

/**
 * @property slides : An array of React nodes representing the slides to display.
 *                                   This property is required.
 *
 * @property delay : Optional delay in milliseconds between each automatic slide transition.
 *                               The delay will never be less than 700 ms (values below 700 ms will be adjusted).
 *                               Default: 4000 ms.
 * @property visibleCards : number of cards visible on screen, defaut is 2, max is 7.
 * @property spacing : spacing of cards (can be : rem, em, px, %, dvw or vw units).
 */
interface IInfiniteSlidesProps extends HtmlHTMLAttributes<HTMLDivElement> {
    slides: ReactNode[]
    delay?: number,
    visibleCards?: 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    spacing?: string
}

const InfiniteSlides = ({
    slides = [],
    delay = 4000,
    visibleCards = 'auto',
    className,
    spacing = '1em',
    style: userStyle,
    ...props
}: IInfiniteSlidesProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [cardsToShow, setCardsToShow] = useState<number>(2);
    const visibleCount = NumberHelper.clamp(cardsToShow, 1, 7) + 1;

    useEffect(() => {
        if (slides.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setIsAnimating(true);
            const animationDurationMs = 600;

            const to = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % slides.length);
                setIsAnimating(false);
            }, animationDurationMs);

            return () => clearTimeout(to);
        }, Math.max(700, delay));

        return () => clearInterval(interval);
    }, [slides.length, delay, cardsToShow]);


    useEffect(() => {
        if (visibleCards !== 'auto') {
            setCardsToShow(visibleCards);
            return;
        }

        const updateCards = () => {
            const width = containerRef.current?.offsetWidth || window.innerWidth;
            console.log(width);
            let count = 2;
            if (width >= 1700) count = 7;
            else if (width >= 1400) count = 6;
            else if (width >= 1100) count = 5;
            else if (width >= 800) count = 4;
            else if (width >= 500) count = 3;

            setCardsToShow(count);
        };

        updateCards();
        window.addEventListener('resize', updateCards);

        return () => window.removeEventListener('resize', updateCards);
    }, [visibleCards]);


    if (slides.length === 0) {
        return null;
    }

    const amountSlideClass = `infinite-slides--amount-${visibleCount}`;

    const mergedStyle: React.CSSProperties = {
        ['--infinite-slide-spacing' as any]: spacing,
        ...userStyle,
    };

    return <div
        ref={containerRef}
        className={clsx(className, s['infinite-slides'], isAnimating && s['infinite-slides--state-animating'])}
        style={mergedStyle}
        {...props}
    >
        {Array.from({ length: visibleCount }, (_, i) => {
            const slideIndex = (currentIndex + i) % slides.length;
            const numClass = s[`${amountSlideClass}__slide__${i + 1}`];
            return (
                <div key={i} className={clsx(s[`${amountSlideClass}__slide`], numClass)}>
                    {slides[slideIndex]}
                </div>
            );
        })}
    </div>
}

export default InfiniteSlides;
