/// <reference types="react" />
import { TokenPickerTarget } from './state';
import { TokenDataFE } from 'lib/hooks/constants';
import { ScreenSize } from '../../hooks/useScreenSize/index';
export interface SwapInputProps {
    selectedToken?: TokenDataFE;
    targetToken: TokenPickerTarget;
    tokenDisabled?: boolean;
    quantityDisabled?: boolean;
}
declare const SwapInput: (props: SwapInputProps) => JSX.Element;
export declare const $FineText: import("styled-components").StyledComponent<"span", any, {
    screen: ScreenSize;
}, never>;
export declare const $CoinIcon: import("styled-components").StyledComponent<"img", any, {
    screen: ScreenSize;
}, never>;
export declare const $BalanceText: import("styled-components").StyledComponent<"span", any, {
    screen: ScreenSize;
}, never>;
export default SwapInput;
