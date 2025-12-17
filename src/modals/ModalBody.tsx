import clsx from "clsx";
import type { HtmlHTMLAttributes } from "react";
import { useModal } from "./Modal";
import s from './ModalBody.module.scss';

const ModalBody = ({
    className,
    ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => {
    const { headerHeight, footerHeight } = useModal();

    return <div className={clsx(s['modal-body'], className)}
        {...props}
        style={{
            maxHeight: `calc(100dvh - 4rem - ${headerHeight}px - ${footerHeight}px)`
        }}
    >
    </div>
}

export default ModalBody;