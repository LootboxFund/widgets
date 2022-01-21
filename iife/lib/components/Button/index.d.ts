/// <reference types="react" />
export interface ButtonProps {
    onClick: () => void;
}
declare const Button: (props: ButtonProps) => JSX.Element;
export declare const $Button: import("styled-components").StyledComponent<"button", any, {
    backgroundColor?: string | undefined;
    color?: string | undefined;
    colorHover?: string | undefined;
    backgroundColorHover?: string | undefined;
}, never>;
export default Button;
