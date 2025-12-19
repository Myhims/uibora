import clsx from "clsx"
import { createContext, useCallback, useContext, useEffect, useState, type Dispatch, type HtmlHTMLAttributes, type SetStateAction } from "react"
import s from './Modal.module.scss'
import ModalBody from "./ModalBody"
import ModalFooter from "./ModalFooter"
import ModalHeader from "./ModalHeader"

export enum ModalVariant {
    VerticallyCentered = 'v-center',
    ToTop = 'v-top',
    Slide = 'h-slide',
    FullScreen = 'full-screen'
}

export interface IModalProps extends HtmlHTMLAttributes<HTMLDivElement> {
    isOpen?: boolean
    onToggled?: (value: boolean) => void
    variant?: ModalVariant
    size?: 'large' | 'medium' | 'small'
    static?: boolean
}

type ModalContextValue = {
    setModalOpen: (open: boolean) => void;
    setHeaderHeight: Dispatch<SetStateAction<number>>;
    setFooterHeight: Dispatch<SetStateAction<number>>;
    modalOpen: boolean;
    headerHeight: number;
    footerHeight: number;
    variant: ModalVariant
};

const ModalContext = createContext<ModalContextValue | null>(null);

export const useModal = () => {
    const ctx = useContext(ModalContext);
    if (!ctx) {
        throw new Error('useModal must be used within <Modal>');
    }
    return ctx;
};

const Modal = ({
    isOpen = false,
    onToggled,
    variant = ModalVariant.VerticallyCentered,
    size = 'medium',
    static: isStatic = false,
    children,
    className
}: IModalProps) => {
    const [open, setOpen] = useState<boolean>(isOpen);
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const [footerHeight, setFooterHeight] = useState<number>(0);
    const [staticAnim, setStaticAnim] = useState<boolean>(false);

    const handleOverlayClick = useCallback(() => {
        if (staticAnim) return;

        if (isStatic) {
            setStaticAnim(true);
            setTimeout(() => {
                setStaticAnim(false);
            }, 450);
        }
        else {
            setModalOpen(!open);
        }
    }, [isOpen, open]);

    const setModalOpen = (open: boolean) => {
        setOpen(open);
        onToggled && onToggled(open);
    };

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen])

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
    }, [open]);

    return <ModalContext.Provider value={{ modalOpen : open, setModalOpen, headerHeight, setHeaderHeight, footerHeight, setFooterHeight, variant }}>
        <div className={clsx('modal', open ? s['modal--state-open'] : '', className)} role="dialog">
            <div className={s['modal__overlay']} onClick={handleOverlayClick}></div>
            <div className={clsx(s['modal__container'], s[`modal__container--variant-${variant}`])}
                onClick={handleOverlayClick}>
                <div className={clsx(s['modal__container__panel'], s[`modal__container__panel--size-${size}`], staticAnim ? s[`modal__container__panel--state-static-anim`] : '')}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </div>
    </ModalContext.Provider>
}

Modal.Header = ModalHeader;
(Modal.Header as any).displayName = 'Modal.Header';

Modal.Body = ModalBody;
(Modal.Body as any).displayName = 'Modal.ModalBody';

Modal.Footer = ModalFooter;
(Modal.Footer as any).displayName = 'Modal.ModalFooter';

export default Modal;