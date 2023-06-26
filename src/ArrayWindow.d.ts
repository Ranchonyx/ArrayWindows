declare module ArrayWindows {
    export interface IArrayWindow<T> extends Array<T> {
        /**
         * Checks wheter the slice is empty
         */
        isEmpty(): boolean;

        /**
         * Retrieves the first element of the slice
         */
        first(): T;

        /**
         * Retrieves the last element of the slice
         */
        last(): T;

        /**
         * Swaps to elements in the slice based on their indices
         * @param iA The first element's index
         * @param iB The second element's index
         */
        swap(iA: number, iB: number): void;

        /**
         * Insert element at index
         * @param idx The index to insert the element at
         * @param value The element to be inserted at index
         * @returns The inserted element
         */
        set(idx: number, value: T): T;

        /**
         * Retrieve the element stored at index
         * @param idx The index to retrieve the element from
         * @returns The element
         */
        get(idx: number): T;

        /**
         * Retrieve the stored contents of this slice
         * @returns The contents of this slice
         */
        content(): T[];
    }

    export class WindowSizeError extends Error {

    }

    export class ArrayWindow<T> extends Array<T> implements IArrayWindow<T> {
        isEmpty(): boolean;
        first(): T;
        last(): T;
        swap(iA: number, iB: number): void;
        set(idx: number, value: T): T;
        get(idx: number): T;
        content(): T[];
    }

    export class ArrayWindowIterator<T> implements Iterable<IArrayWindow<T>> {
        [Symbol.iterator](): IterableIterator<ArrayWindow<T>>;
        [Symbol.toStringTag](): string;
    }

    interface Array<T> {
        /**
         * @param {number}  size - The window size
         * @returns An iterable over the windows
         */
        windows(size: number): ArrayWindows.ArrayWindowIterator<T>
    }
}

export = ArrayWindows;

declare global {
    interface Array<T> {
        /**
         * @param {number}  size - The window size
         * @returns An iterable over the windows
         */
        windows(size: number): ArrayWindows.ArrayWindowIterator<T>
    }
}