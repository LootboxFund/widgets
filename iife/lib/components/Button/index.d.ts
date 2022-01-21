/// <reference types="react" />
export interface ButtonProps {
    children: React.ReactChildren;
    style: React.CSSProperties;
}
declare const $Button: import("styled-components").StyledComponent<"button", any, {
    onHoverColor?: string | undefined;
    color?: string | undefined;
    pointer?: "pointer" | "not-allowed" | undefined;
}, never>;
export default $Button;
