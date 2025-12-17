import clsx from "clsx";
import { useLayoutEffect, useRef, type HtmlHTMLAttributes } from "react";
import { useModal } from "./Modal";
import s from './ModalFooter.module.scss';

const ModalFooter = ({
    className,
    ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => {
    const { setFooterHeight } = useModal();
    const footerRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const el = footerRef.current;
        if (!el) return;

        const update = () => {
            const height = el.getBoundingClientRect().height;
            setFooterHeight(height);
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
    }, [setFooterHeight]);

    return <div ref={footerRef}
        className={clsx(s['modal-body'], className)}
        {...props}>
    </div>
}

export default ModalFooter;