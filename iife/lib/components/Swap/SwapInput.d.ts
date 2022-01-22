/// <reference types="react" />
import { TokenPickerTarget } from './state';
import { TokenData } from 'lib/hooks/useTokenList/tokenMap';
export interface SwapInputProps {
    selectedToken?: TokenData;
    targetToken: TokenPickerTarget;
    tokenDisabled?: boolean;
    quantityDisabled?: boolean;
}
declare const SwapInput: (props: SwapInputProps) => JSX.Element;
export declare const $FineText: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const $CoinIcon: import("styled-components").StyledComponent<"img", any, {}, never>;
export default SwapInput;
