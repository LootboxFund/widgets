/// <reference types="react" />
import { Token } from 'lib/types';
export declare function TokenSelectDialog({ onSelect }: {
    onSelect: (token: Token) => void;
}): JSX.Element;
interface TokenSelectProps {
    value?: Token;
    collapsed: boolean;
    disabled?: boolean;
    onSelect: (value: Token) => void;
}
export default function TokenSelect({ value, collapsed, disabled, onSelect }: TokenSelectProps): JSX.Element;
export {};
