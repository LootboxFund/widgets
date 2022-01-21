import { Input } from 'lib/state/swap';
import { Token } from 'lib/types';
import { ReactNode } from 'react';
interface TokenInputProps {
    input: Input;
    disabled?: boolean;
    onMax?: () => void;
    onChangeInput: (input: number | undefined) => void;
    onChangeToken: (token: Token) => void;
    children: ReactNode;
}
export default function TokenInput({ input: { value, token }, disabled, onMax, onChangeInput, onChangeToken, children, }: TokenInputProps): JSX.Element;
export {};
