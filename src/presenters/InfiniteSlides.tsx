import clsx from 'clsx';
import { useEffect, useState, type HtmlHTMLAttributes, type ReactNode } from 'react';
import s from './InfiniteSlides.module.scss';

/**
 * @property slides : An array of React nodes representing the slides to display.
 *                                   This property is required.
 *
 * @property delay : Optional delay in milliseconds between each automatic slide transition.
 *                               The delay will never be less than 700 ms (values below 700 ms will be adjusted).
 *                               Default: 4000 ms.
 */
interface IInfiniteSlidesProps extends HtmlHTMLAttributes<HTMLDivElement> {
    slides: ReactNode[]
    delay?: number
}

const InfiniteSlides = ({
     slides = [],
     delay = 4000,
     className,
      ...props
     }: IInfiniteSlidesProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const activeIndex = currentIndex % slides.length;
    const nextIndex = (currentIndex + 1) % slides.length;
    const incomingIndex = (currentIndex + 2) % slides.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % slides.length);
                setIsAnimating(false);
            }, 600);
        }, Math.max(700, delay));

        return () => clearInterval(interval);
    }, [slides.length, delay]);

    return (
        <div
            className={clsx(className, s['infinite-slides'], isAnimating && s['infinite-slides--state-animating'])}
            {...props}
        >
            <div className={clsx(s['infinite-slides__slide'], s['infinite-slides__slide__main'])}>
                {slides[activeIndex]}
            </div>
            <div className={clsx(s['infinite-slides__slide'], s['infinite-slides__slide__new'])}>
                {slides[nextIndex]}
            </div>
            <div className={clsx(s['infinite-slides__slide'], s['infinite-slides__slide__pop'])}>
                {slides[incomingIndex]}
            </div>
        </div>
    );
};

export default InfiniteSlides;