interface HorizontalProps {
    readonly justifyContent?: 'flex-start' | 'center' | 'space-evenly' | 'space-between' | 'flex-end';
    readonly verticalCenter?: boolean;
    readonly baseline?: boolean;
    readonly spacing?: 1 | 2 | 3 | 4 | 5;
    readonly wrap?: boolean;
    readonly flex?: number;
}
export declare const $Horizontal: import("styled-components").StyledComponent<"div", any, HorizontalProps, never>;
export declare const $Vertical: import("styled-components").StyledComponent<"div", any, {
    spacing?: 1 | 2 | 3 | 4 | 5 | undefined;
    flex?: number | undefined;
}, never>;
export {};
