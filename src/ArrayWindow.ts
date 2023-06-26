declare global {
    interface Array<T> {
        /**
         * @param {number}  size - The window size
         * @returns An iterable over the windows
         */
        windows(size: number): ArrayWindowIterator<T>
    }

    interface IArrayWindow<T> extends Array<T> {
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
}

export class ArrayWindow<T> extends Array<T> implements IArrayWindow<T> {
    private parentThisArg: any[];
    private sliceIdx: number;
    private sliceLen: number;

    constructor(parentThisArg: any[], sliceIdx: number, sliceLen: number) {
        super(...parentThisArg.slice(sliceIdx, sliceIdx + sliceLen));

        this.parentThisArg = parentThisArg;
        this.sliceIdx = sliceIdx;
        this.sliceLen = sliceLen;
    }

    public isEmpty(): boolean {
        return Object.keys(this.parentThisArg.slice(this.sliceIdx, this.sliceIdx + this.sliceLen)).length === 0;
    }

    public first(): T {
        return this.parentThisArg[this.sliceIdx];
    }

    public last(): T {
        return this.parentThisArg[this.sliceIdx + this.sliceLen];
    }

    public swap(iA: number, iB: number): void {
        if (iA >= this.sliceLen || iB >= this.sliceLen) throw new RangeError("Index out of bounds");
        [this.parentThisArg[this.sliceIdx + iA], this.parentThisArg[this.sliceIdx + iB]] = [this.parentThisArg[this.sliceIdx + iB], this.parentThisArg[this.sliceIdx + iA]];
    }

    public set(idx: number, value: T): T {
        return this.parentThisArg[idx + this.sliceIdx] = value;
    }

    public get(idx: number): T {
        return this.parentThisArg[idx + this.sliceIdx];
    }

    public content(): T[] {
        return this.parentThisArg.slice(this.sliceIdx, this.sliceIdx + this.sliceLen);
    }

    get [Symbol.toStringTag](): string {
        return `ArrayWindow`;
    }
}

export class WindowSizeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "WindowSizeError";
    }
}

export class ArrayWindowIterator<T> implements Iterable<IArrayWindow<T>> {
    private sz: number = 0;
    private thisArg: Array<T>;

    constructor(thisArg: Array<T>, pSz: number) {
        if (thisArg.length < 1) throw new RangeError("Cannot call Array.windows on array with size less than 1!");
        if (pSz > thisArg.length) throw new RangeError("Cannot call Array.windows with a window size greater than the array size!")
        if (pSz < 1) throw new WindowSizeError("Cannot call Array.windows with a window size of less than 1!");
        this.sz = pSz;
        this.thisArg = thisArg;
    }

    *[Symbol.iterator](): IterableIterator<ArrayWindow<T>> {
        let state = 0;
        if ((this.thisArg as any).parentThisArg) {
            let cpy = (this.thisArg as any).parentThisArg;
            ///@ts-expect-error
            this.thisArg = cpy.slice(this.thisArg.sliceIdx, this.thisArg.sliceIdx + this.thisArg.sliceLen);;
        }
        while (state < this.thisArg.length) {
            let slice = this.thisArg.slice(state, (this.sz + state++));

            if (!(slice.length < this.sz)) {
                yield new ArrayWindow<T>(this.thisArg, state - 1, slice.length);
            }
        }
    }

    get [Symbol.toStringTag](): string {
        return `ArrayWindowIterator`;
    }
}


declare global {
    interface Array<T> {
        /**
         * @param {number}  size - The window size
         * @returns An iterable over the windows
         */
        windows(size: number): ArrayWindowIterator<T>
    }
}

if (!Array.prototype.windows) {
    Array.prototype.windows = function <T>(windowSize: number): ArrayWindowIterator<T> {
        return new ArrayWindowIterator<any>(this, windowSize);
    }
}