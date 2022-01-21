import { Draft } from 'immer';
import { WritableAtom } from 'jotai';
/**
 * Creates a derived atom whose value is the picked object property.
 * By default, the setter acts as a primitive atom's, changing the original atom.
 * A custom setter may also be passed, which uses an Immer Draft so that it may be mutated directly.
 */
export declare function pickAtom<Value, Key extends keyof Value & keyof Draft<Value>, Update>(anAtom: WritableAtom<Value, Value>, key: Key, setter: (draft: Draft<Value>[Key], update: Update) => Draft<Value>[Key]): WritableAtom<Value[Key], Update>;
export declare function pickAtom<Value, Key extends keyof Value & keyof Draft<Value>, Update extends Value[Key]>(anAtom: WritableAtom<Value, Value>, key: Key, setter?: (draft: Draft<Value>[Key], update: Update) => Draft<Value>[Key]): WritableAtom<Value[Key], Update>;
/**
 * Typing for a customizable enum; see setCustomizable.
 * This is not exported because an enum may not extend another interface.
 */
interface CustomizableEnum<T extends number> {
    CUSTOM: -1;
    DEFAULT: T;
}
/**
 * Typing for a customizable enum; see setCustomizable.
 * The first value is used, unless it is CUSTOM, in which case the second is used.
 */
export declare type Customizable<T> = {
    value: T;
    custom?: number;
};
/** Sets a customizable enum, validating the tuple and falling back to the default. */
export declare function setCustomizable<T extends number, Enum extends CustomizableEnum<T>>(customizable: Enum): (draft: Customizable<T>, update: T | Customizable<T>) => Customizable<T>;
/** Sets a togglable atom to invert its state at the next render. */
export declare function setTogglable(draft: boolean): boolean;
export {};
