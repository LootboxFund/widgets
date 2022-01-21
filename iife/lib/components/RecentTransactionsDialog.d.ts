/// <reference types="react" />
import { Token } from 'lib/types';
interface ITokenAmount {
    value: number;
    token: Token;
}
export declare enum TransactionStatus {
    SUCCESS = 0,
    ERROR = 1,
    PENDING = 2
}
interface ITransaction {
    input: ITokenAmount;
    output: ITokenAmount;
    status: TransactionStatus;
}
export declare const mockTxs: ITransaction[];
export default function RecentTransactionsDialog(): JSX.Element;
export {};
