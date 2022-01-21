import { ReactNode } from 'react';
export declare const colorAtom: import("jotai").Atom<string | undefined> & {
    write: (get: {
        <Value>(atom: import("jotai").Atom<Value | Promise<Value>>): Value;
        <Value_1>(atom: import("jotai").Atom<Promise<Value_1>>): Value_1;
        <Value_2>(atom: import("jotai").Atom<Value_2>): Value_2 extends Promise<infer V> ? V : Value_2;
    } & {
        <Value_3>(atom: import("jotai").Atom<Value_3 | Promise<Value_3>>, options: {
            unstable_promise: true;
        }): Value_3 | Promise<Value_3>;
        <Value_4>(atom: import("jotai").Atom<Promise<Value_4>>, options: {
            unstable_promise: true;
        }): Value_4 | Promise<Value_4>;
        <Value_5>(atom: import("jotai").Atom<Value_5>, options: {
            unstable_promise: true;
        }): (Value_5 extends Promise<infer V> ? V : Value_5) | Promise<Value_5 extends Promise<infer V> ? V : Value_5>;
    }, set: {
        <Value_6, Result extends void | Promise<void>>(atom: import("jotai").WritableAtom<Value_6, undefined, Result>): Result;
        <Value_7, Update, Result_1 extends void | Promise<void>>(atom: import("jotai").WritableAtom<Value_7, Update, Result_1>, update: Update): Result_1;
    }, update: string | ((prev: string | undefined) => string | undefined) | undefined) => void;
    onMount?: (<S extends (update?: string | ((prev: string | undefined) => string | undefined) | undefined) => void>(setAtom: S) => void | (() => void)) | undefined;
} & {
    init: string | undefined;
};
interface OutputProps {
    disabled?: boolean;
    children: ReactNode;
}
export default function Output({ disabled, children }: OutputProps): JSX.Element;
export {};
