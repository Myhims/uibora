import type { ReactNode } from "react";

export type SplitButtonAction = {
    title: string
    children?: ReactNode
    onClick?: () => void
};