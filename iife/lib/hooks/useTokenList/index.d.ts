import { TokenDataFE } from 'lib/hooks/constants';
export declare const getCustomTokensList: (chainIdHex: string) => TokenDataFE[];
interface TokenListState {
    defaultTokenList: TokenDataFE[];
    customTokenList: TokenDataFE[];
}
export declare const tokenListState: TokenListState;
export declare const useTokenList: () => readonly {
    readonly usdPrice?: string | undefined;
    readonly address: string;
    readonly decimals: number;
    readonly name: string;
    readonly symbol: string;
    readonly chainIdHex: string;
    readonly chainIdDecimal: string;
    readonly logoURI: string;
    readonly priceOracle: string;
}[];
export declare const useCustomTokenList: () => readonly {
    readonly usdPrice?: string | undefined;
    readonly address: string;
    readonly decimals: number;
    readonly name: string;
    readonly symbol: string;
    readonly chainIdHex: string;
    readonly chainIdDecimal: string;
    readonly logoURI: string;
    readonly priceOracle: string;
}[];
export declare const addCustomToken: (data: TokenDataFE) => void;
export declare const removeCustomToken: (address: string, chainIdHex: string) => void;
export declare const saveInitialCustomTokens: () => void;
export declare const initTokenList: (chainIdHex?: string | undefined) => void;
export {};
