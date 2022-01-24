import { TokenData } from 'lib/hooks/constants';
export declare const getCustomTokensList: (chainIdHex: string) => TokenData[];
interface TokenListState {
    defaultTokenList: TokenData[];
    customTokenList: TokenData[];
}
export declare const stateOfTokenList: TokenListState;
export declare const useTokenList: () => readonly {
    readonly address: string;
    readonly decimals: number;
    readonly name: string;
    readonly symbol: string;
    readonly chainId: number;
    readonly logoURI: string;
    readonly usdPrice?: number | undefined;
    readonly priceOracle?: string | undefined;
}[];
export declare const useCustomTokenList: () => readonly {
    readonly address: string;
    readonly decimals: number;
    readonly name: string;
    readonly symbol: string;
    readonly chainId: number;
    readonly logoURI: string;
    readonly usdPrice?: number | undefined;
    readonly priceOracle?: string | undefined;
}[];
export declare const addCustomToken: (data: TokenData) => void;
export declare const removeCustomToken: (address: string, chainId: number) => void;
export declare const saveInitialCustomTokens: () => void;
export declare const initTokenList: (chainIdHex?: string | undefined) => void;
export {};
