import { TokenInfo } from '@uniswap/token-lists';
import { TokenMap } from './utils';
export { DEFAULT_TOKEN_LIST } from './fetchTokenList';
export default function useTokenList(list?: string | TokenInfo[]): TokenMap;
