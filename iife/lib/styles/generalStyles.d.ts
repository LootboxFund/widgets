import { Theme } from 'lib/theme';
interface HorizontalProps {
    readonly justifyContent?: 'flex-start' | 'center' | 'space-evenly' | 'space-between' | 'flex-end';
    readonly verticalCenter?: boolean;
    readonly baseline?: boolean;
    readonly spacing?: 1 | 2 | 3 | 4 | 5;
    readonly wrap?: boolean;
}
export declare const $Horizontal: import("styled-components").StyledComponent<"div", import("../theme/theme").ComputedTheme, HorizontalProps, never>;
export declare const $Vertical: import("styled-components").StyledComponent<"div", import("../theme/theme").ComputedTheme, {
    spacing?: 1 | 2 | 3 | 4 | 5 | undefined;
}, never>;
declare const Column: import("styled-components").StyledComponent<"div", import("../theme/theme").ComputedTheme, {
    align?: string | undefined;
    color?: keyof import("lib/theme").Colors | undefined;
    justify?: string | undefined;
    gap?: number | undefined;
    padded?: true | undefined;
    flex?: true | undefined;
    grow?: true | undefined;
    theme: Theme;
    css?: import("styled-components").FlattenInterpolation<import("styled-components").ThemedStyledProps<object, import("../theme/theme").ComputedTheme>> | undefined;
}, never>;
export default Column;
