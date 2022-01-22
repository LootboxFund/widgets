export declare type TokenData = {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
    chainId: number;
    logoURI: string;
    usdPrice?: number;
};
export declare const tokenMap: Record<string, TokenData[]>;
export declare const DEMO_CUSTOM_TOKEN_LIST: TokenData[];
