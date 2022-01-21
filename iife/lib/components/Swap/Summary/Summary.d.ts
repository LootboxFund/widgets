/// <reference types="react" />
import { Input } from 'lib/state/swap';
interface SummaryProps {
    input: Required<Pick<Input, 'token' | 'value'>> & Input;
    output: Required<Pick<Input, 'token' | 'value'>> & Input;
    usdc?: boolean;
}
export default function Summary({ input, output, usdc }: SummaryProps): JSX.Element;
export {};
