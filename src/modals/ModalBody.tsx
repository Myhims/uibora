import clsx from "clsx";
import type { HtmlHTMLAttributes } from "react";
import { ModalVariant, useModal } from "./Modal";
import s from './ModalBody.module.scss';

const ModalBody = ({
    className,
    children,
    ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => {
    const { headerHeight, footerHeight, variant, modalOpen } = useModal();

    return <div className={clsx(s['modal-body'], className)}
        {...props}
        style={{
            maxHeight: `calc(100dvh - ${variant === ModalVariant.Slide ? '2rem' : '4rem'} - ${headerHeight}px - ${footerHeight}px)`
        }}
    >
        {modalOpen && children}
    </div>
}

export default ModalBody;