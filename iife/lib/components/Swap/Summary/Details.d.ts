/// <reference types="react" />
import { State } from 'lib/state/swap';
import { Token } from 'lib/types';
interface DetailsProps {
    swap: Required<State>['swap'];
    input: Token;
    output: Token;
}
export default function Details({ input: { symbol: inputSymbol }, output: { symbol: outputSymbol }, swap, }: DetailsProps): JSX.Element;
export {};
