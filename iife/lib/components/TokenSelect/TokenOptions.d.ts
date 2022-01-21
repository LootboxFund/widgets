import { KeyboardEvent } from 'react';
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo';
interface TokenOptionsHandle {
    onKeyDown: (e: KeyboardEvent) => void;
    blur: () => void;
}
interface TokenOptionsProps {
    tokens: WrappedTokenInfo[];
    onSelect: (token: WrappedTokenInfo) => void;
}
declare const TokenOptions: import("react").ForwardRefExoticComponent<TokenOptionsProps & import("react").RefAttributes<TokenOptionsHandle>>;
export default TokenOptions;
