import { TokenData } from 'lib/hooks/useTokenList/tokenMap';
export declare const getCustomTokensList: (chainId: number) => TokenData[];
interface TokenListState {
    chainId: number;
    defaultTokenList: TokenData[];
    customTokenList: TokenData[];
}
export declare const stateOfTokenList: TokenListState;
export declare const initializeTokenList: (chainId?: number | undefined) => void;
export declare const useTokenList: () => readonly {
    readonly address: string;
    readonly decimals: number;
    readonly name: string;
    readonly symbol: string;
    readonly chainId: number;
    readonly logoURI: string;
    readonly usdPrice?: number | undefined;
}[];
export declare const useCustomTokenList: () => readonly {
    readonly address: string;
    readonly decimals: number;
    readonly name: string;
    readonly symbol: string;
    readonly chainId: number;
    readonly logoURI: string;
    readonly usdPrice?: number | undefined;
}[];
export declare const addCustomToken: (data: TokenData) => void;
export declare const removeCustomToken: (address: string, chainId: number) => void;
export {};
