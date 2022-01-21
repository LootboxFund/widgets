/// <reference types="react" />
import { TokenInfo } from '@uniswap/token-lists';
interface DefaultTokenAmount {
    address?: string | {
        [chainId: number]: string;
    };
    amount?: number;
}
interface SwapDefaults {
    tokenList: string | TokenInfo[];
    input: DefaultTokenAmount;
    output: DefaultTokenAmount;
}
export interface SwapProps {
    defaults?: Partial<SwapDefaults>;
}
export interface CrowdSaleProps {
    defaults?: Partial<SwapDefaults>;
}
declare const CrowdSale: ({ defaults }: CrowdSaleProps) => JSX.Element;
export default CrowdSale;
