import { Color } from 'lib/theme';
import { ReactNode } from 'react';
export declare const Overlay: import("styled-components").StyledComponent<"div", import("../theme/theme").ComputedTheme, {
    color?: keyof import("lib/theme").Colors | undefined;
    align?: string | undefined;
    justify?: string | undefined;
    pad?: number | undefined;
    gap?: number | undefined;
    flex?: true | undefined;
    grow?: true | undefined;
    children?: ReactNode;
    theme: import("lib/theme").Theme;
} & {
    updated?: boolean | undefined;
}, never>;
export interface ActionButtonProps {
    color?: Color;
    disabled?: boolean;
    updated?: {
        message: ReactNode;
        action: ReactNode;
    };
    onClick: () => void;
    onUpdate?: () => void;
    children: ReactNode;
}
export default function ActionButton({ color, disabled, updated, onClick, onUpdate, children, }: ActionButtonProps): JSX.Element;