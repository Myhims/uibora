import clsx from 'clsx';
import { type HTMLAttributes, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserHelper } from '../helpers/BrowserHelper';
import { useAccessibilityCompliance } from '../hooks';
import s from './LargeSlider.module.scss';

export interface ISliderProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Hide arrows
     */
    showNavigationArrows?: 'auto' | 'always' | 'never'
    /**
     * Customize the previous button
     */
    previousButton?: ReactNode

    /**
     * Customize the next button
     */
    nextButton?: ReactNode

    /**
     * Allow the scrollable area to take up the full screen
     */
    allowFullScreenOverflow?: boolean
}

const Slider = ({
    showNavigationArrows = 'auto',
    className,
    children,
    previousButton = '<',
    nextButton = '>',
    allowFullScreenOverflow = true,
    ...props }: ISliderProps) => {
    const [scrollAmount, setScrollAmount] = useState(0);
    const [previousButtonVisible, setPreviousButtonVisible] = useState(false);
    const [stepSize, setStepSize] = useState(0);
    const [nextButtonVisible, setNextButtonVisible] = useState(true);
    const [hiddenBeforeElement, setHiddenBeforeElement] = useState(Math.round(document.documentElement.clientWidth / 3));
    const [hiddenAfterElement, setHiddenAfterElement] = useState(Math.round(document.documentElement.clientWidth / 3));
    const sliderRef = useRef<HTMLDivElement>(null);
    const sliderContentRef = useRef<HTMLDivElement>(null);
    const sliderChildren = useRef<HTMLDivElement>(null);
    const previousUac = useAccessibilityCompliance<HTMLDivElement>({ role: 'button' }, [scrollAmount]);
    const nextUac = useAccessibilityCompliance<HTMLDivElement>({ role: 'button' }, [scrollAmount]);

    let _domInterval: any;
    let _updateScroll: any;
    let _scrollTo: any;

    const onWindowResized = () => {
        if (sliderRef.current && sliderContentRef.current) {
            sliderRef.current.style.removeProperty('height');
            sliderContentRef.current.style.overflowX = 'scroll';

            sliderRef.current.style.height = (sliderRef.current.clientHeight - BrowserHelper.GetSystemScrollbarHeight() - 30) + 'px';
            sliderContentRef.current.style.overflowX = 'auto';
        }

        setFullWidthPaddings(sliderRef.current);
    }

    const setFullWidthPaddings = (Slider: HTMLElement | null) => {
        if (Slider && Slider.parentElement) {

            if (allowFullScreenOverflow) {
                //set the Slider parent container size
                let offest = window.pageXOffset || document.documentElement.scrollLeft;
                let marginLeft = Slider.parentElement.getBoundingClientRect().left + offest;
                let marginRight = document.documentElement.clientWidth - marginLeft - Slider.parentElement.getBoundingClientRect().width;

                Slider.style.width = document.documentElement.clientWidth + 'px';
                Slider.style.marginLeft = '-' + marginLeft + 'px';

                let stepSize = Math.round(Slider.parentElement.clientWidth * 3 / 4);

                if (hiddenBeforeElement !== marginLeft || hiddenAfterElement != marginRight || stepSize !== stepSize) {
                    setHiddenBeforeElement(marginLeft);
                    setHiddenAfterElement(marginRight);
                    setStepSize(stepSize);
                }
            }
            else {
                let stepSize = Math.round(Slider.parentElement.clientWidth * 3 / 4);
                setStepSize(stepSize);
            }
        }
    }

    const setScrollButtonsVisibility = () => {
        let scrollDiv = sliderContentRef.current as Element;
        if (scrollDiv) {
            let previousButtonVisible = scrollDiv.scrollLeft > 0;
            let nextButtonVisible = scrollDiv.scrollLeft < scrollDiv.scrollWidth - scrollDiv.clientWidth;

            setNextButtonVisible(nextButtonVisible);
            setPreviousButtonVisible(previousButtonVisible);
        }
    }

    useEffect(() => {
        if (sliderContentRef.current && sliderContentRef.current !== null) {
            sliderContentRef.current.scroll(scrollAmount, 0);
        }
    }, [scrollAmount])

    const slideNext = () => {
        if (_scrollTo) clearTimeout(_scrollTo);
        _scrollTo = setTimeout(() => {
            if (sliderContentRef.current && sliderContentRef.current !== null) {
                //get the scroll position in DOM
                let scrollPosition = sliderContentRef.current.scrollLeft + sliderContentRef.current.clientWidth;
                //prevent double clicks at the end of the scroll
                if (scrollPosition < sliderContentRef.current.scrollWidth) {
                    setScrollAmount(Math.round(scrollAmount + stepSize));
                    setNextButtonVisible(Math.round(scrollPosition + stepSize) < sliderContentRef.current.scrollWidth);
                    setPreviousButtonVisible(true);
                }
            }
        }, 100);
    }

    const slidePrevious = () => {
        if (_scrollTo) clearTimeout(_scrollTo);
        _scrollTo = setTimeout(() => {
            if (sliderContentRef.current && sliderContentRef.current !== null) {
                //prevent double clicks at the end of the scroll
                if (sliderContentRef.current.scrollLeft > 0 && sliderContentRef.current && sliderContentRef.current !== null) {
                    setScrollAmount(Math.round(sliderContentRef.current.scrollLeft - stepSize));
                    setNextButtonVisible(true);
                    setPreviousButtonVisible(Math.round(sliderContentRef.current.scrollLeft - stepSize) > 0);
                }
            }
        }, 100);
    }

    useEffect(() => {
        window.requestAnimationFrame(onWindowResized);
        window.addEventListener('resize', onWindowResized);

        return () => {
            window.removeEventListener('resize', onWindowResized);
            // For the Back-Forward Cache (bfcache), we need to clear all timeouts and intervals
            if (_domInterval) {
                clearInterval(_domInterval);
            }
            if (_updateScroll) {
                clearTimeout(_updateScroll);
            }
            if (_scrollTo) {
                clearTimeout(_scrollTo);
            }
        }
    }, [])

    const previousButtonState = previousButtonVisible ? '' : s['large-slider__buttons--state-disabled'];
    const nextButtonState = nextButtonVisible ? '' : s['large-slider__buttons--state-disabled'];

    const showButtons = useMemo(() => {
        if (showNavigationArrows === 'always')
            return true;

        if (showNavigationArrows === 'never' || (showNavigationArrows === 'auto' && sliderChildren.current && sliderContentRef.current && sliderChildren.current.clientWidth < sliderContentRef.current.clientWidth))
            return false;

        return showNavigationArrows === 'auto' && sliderContentRef.current !== null && sliderContentRef.current.scrollWidth > sliderContentRef.current.clientWidth;
    }, [showNavigationArrows, sliderContentRef.current])

    return <div {...props} className={clsx(s['large-slider'], className)}>
        {showButtons &&
            <div className={s['large-slider__buttons']}>
                <div className={clsx(s['large-slider__buttons__previous'], previousButtonState)}
                    onClick={slidePrevious}
                    {...previousUac}>
                    {previousButton}
                </div>
                <div className={clsx(s['large-slider__buttons__next'], nextButtonState)}
                    onClick={slideNext}
                    {...nextUac}>
                    {nextButton}
                </div>
            </div>
        }
        <div className={s['large-slider__container']} ref={sliderRef}>
            <div className={s['large-slider__container__content']} ref={sliderContentRef} onScroll={setScrollButtonsVisibility}>
                {allowFullScreenOverflow &&
                    <div
                        className={s['large-slider__container__content__hidden']}
                        style={{ minWidth: hiddenBeforeElement }} />
                }
                <div ref={sliderChildren} className={s['large-slider__container__content__children']}>
                    {children}
                </div>
                {allowFullScreenOverflow &&
                    <div className={s['large-slider__container__content__hidden']}
                        style={{ minWidth: hiddenAfterElement }}>
                    </div>
                }
            </div>
        </div>
    </div >
}

export default Slider