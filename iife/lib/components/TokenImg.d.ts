/// <reference types="react" />
interface TokenImgProps {
    className?: string;
    token: {
        name?: string;
        symbol: string;
        logoURI?: string;
    };
}
declare function TokenImg({ className, token }: TokenImgProps): JSX.Element;
declare const _default: import("styled-components").StyledComponent<typeof TokenImg, import("../theme/theme").ComputedTheme, {
    size?: number | undefined;
}, never>;
export default _default;
