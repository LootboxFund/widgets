import { TokenData } from 'lib/hooks/constants';
export declare const getCustomTokensList: (chainIdHex: string) => TokenData[];
interface TokenListState {
    defaultTokenList: TokenData[];
    customTokenList: TokenData[];
}
export declare const tokenListState: TokenListState;
export declare const useTokenList: () => readonly {
    readonly address: string;
    readonly decimals: number;
    readonly name: string;
    readonly symbol: string;
    readonly chainIdHex: string;
    readonly chainIdDecimal: string;
    readonly logoURI: string;
    readonly usdPrice?: string | undefined;
    readonly priceOracle?: string | undefined;
}[];
export declare const useCustomTokenList: () => readonly {
    readonly address: string;
    readonly decimals: number;
    readonly name: string;
    readonly symbol: string;
    readonly chainIdHex: string;
    readonly chainIdDecimal: string;
    readonly logoURI: string;
    readonly usdPrice?: string | undefined;
    readonly priceOracle?: string | undefined;
}[];
export declare const addCustomToken: (data: TokenData) => void;
export declare const removeCustomToken: (address: string, chainIdHex: string) => void;
export declare const saveInitialCustomTokens: () => void;
export declare const initTokenList: (chainIdHex?: string | undefined) => void;
export {};
