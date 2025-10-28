import type { ReactNode } from "react";

export type SplitButtonTab = {
    title: string
    children?: ReactNode
    onClick?: () => void
};