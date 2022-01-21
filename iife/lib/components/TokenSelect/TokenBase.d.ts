/// <reference types="react" />
import { Token } from 'lib/types';
interface TokenBaseProps {
    value: Token;
    onClick: (value: Token) => void;
}
export default function TokenBase({ value, onClick }: TokenBaseProps): JSX.Element;
export {};
