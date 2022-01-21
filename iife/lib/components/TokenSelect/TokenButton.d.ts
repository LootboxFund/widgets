/// <reference types="react" />
import { Token } from 'lib/types';
interface TokenButtonProps {
    value?: Token;
    collapsed: boolean;
    disabled?: boolean;
    onClick: () => void;
}
export default function TokenButton({ value, collapsed, disabled, onClick }: TokenButtonProps): JSX.Element;
export {};
