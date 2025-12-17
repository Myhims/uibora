import clsx from "clsx";
import { useLayoutEffect, useRef, type HtmlHTMLAttributes } from "react";
import { useAccessibilityCompliance } from "../hooks";
import { useModal } from "./Modal";
import s from './ModalHeader.module.scss';

export interface IModalHeaderProps extends HtmlHTMLAttributes<HTMLDivElement> {
    hideCloseButton?: boolean
}

const ModalHeader = ({
    hideCloseButton = false,
    className,
    children,
    ...props
}: IModalHeaderProps) => {
    const uac = useAccessibilityCompliance<HTMLDivElement>({ role: 'button' }, [props]);
    const { setModalOpen, setHeaderHeight } = useModal();
    const headerRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        const update = () => {
            const height = el.getBoundingClientRect().height;
            setHeaderHeight(height);
        };
        update();

        const ro = new ResizeObserver(() => {
            update();
        });
        ro.observe(el);

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(update).catch(() => { });
        }

        return () => {
            ro.disconnect();
        };
    }, [setHeaderHeight]);

    const handleCloseClick = () => {
        !hideCloseButton && setModalOpen(false);
    }

    return <div ref={headerRef} className={clsx(s['modal-header'], className)} {...props}>
        <div className={s['modal-header__side-start']}></div>
        <div className={s['modal-header__title']} role="heading" aria-level={2}>{children}</div>
        <div {...uac} className={s['modal-header__side-close']} onClick={handleCloseClick}>
            {!hideCloseButton && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
            </svg>}
        </div>
    </div>
}

export default ModalHeader;