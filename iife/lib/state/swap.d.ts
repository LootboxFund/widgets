import { WritableAtom } from 'jotai';
import { Customizable } from 'lib/state/atoms';
import { Token } from 'lib/types';
/** Max slippage, as a percentage. */
export declare enum MaxSlippage {
    P01 = 0.1,
    P05 = 0.5,
    CUSTOM = -1,
    DEFAULT = 0.5
}
export declare const TRANSACTION_TTL_DEFAULT = 40;
export interface Settings {
    maxSlippage: Customizable<MaxSlippage>;
    transactionTtl: number | undefined;
    mockTogglable: boolean;
}
export declare const settingsAtom: WritableAtom<Settings, Settings | typeof import("jotai/utils").RESET | ((prev: Settings) => Settings), void>;
export declare enum Field {
    INPUT = "input",
    OUTPUT = "output"
}
export interface Input {
    value?: number;
    token?: Token;
    usdc?: number;
}
export interface State {
    activeInput: Field;
    [Field.INPUT]: Input & {
        approved?: boolean;
    };
    [Field.OUTPUT]: Input;
    swap?: {
        lpFee: number;
        priceImpact: number;
        slippageTolerance: number;
        integratorFee?: number;
        maximumSent?: number;
        minimumReceived?: number;
    };
}
export declare const stateAtom: WritableAtom<State, State | ((draft: import("immer/dist/internal").WritableDraft<State>) => void), void>;
export declare const inputAtom: WritableAtom<Input & {
    approved?: boolean | undefined;
}, Input & {
    approved?: boolean | undefined;
}, void>;
export declare const outputAtom: WritableAtom<Input, Input, void>;
export declare function useUpdateInputValue(inputAtom: WritableAtom<Input, Input>): (update?: number | undefined) => void;
export declare function useUpdateInputToken(inputAtom: WritableAtom<Input, Input>): (update?: Token | undefined) => void;
export interface Transaction {
    input: Required<Pick<Input, 'token' | 'value'>>;
    output: Required<Pick<Input, 'token' | 'value'>>;
    receipt: string;
    timestamp: number;
    elapsedMs?: number;
    status?: true | Error;
}
export declare const transactionAtom: WritableAtom<Transaction | null, Transaction | ((draft: import("immer/dist/internal").WritableDraft<Transaction> | null) => void) | null, void>;
