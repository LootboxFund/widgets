/// <reference types="react" />
import { TokenPickerTarget } from './state';
import { TokenData } from 'lib/hooks/constants';
import { ScreenSize } from '../../hooks/useScreenSize/index';
export interface SwapInputProps {
    selectedToken?: TokenData;
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
