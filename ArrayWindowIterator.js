"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayWindowIterator = exports.WindowSizeError = void 0;
class ArrayWindow extends Array {
    constructor(parentThisArg, sliceIdx, sliceLen) {
        super(...parentThisArg.slice(sliceIdx, sliceIdx + sliceLen));
        this.parentThisArg = parentThisArg;
        this.sliceIdx = sliceIdx;
        this.sliceLen = sliceLen;
    }
    isEmpty() {
        return Object.keys(this.parentThisArg.slice(this.sliceIdx, this.sliceIdx + this.sliceLen)).length === 0;
    }
    first() {
        return this.parentThisArg[this.sliceIdx];
    }
    last() {
        return this.parentThisArg[this.sliceIdx + this.sliceLen];
    }
    swap(iA, iB) {
        if (iA >= this.sliceLen || iB >= this.sliceLen)
            throw new RangeError("Index out of bounds");
        [this.parentThisArg[this.sliceIdx + iA], this.parentThisArg[this.sliceIdx + iB]] = [this.parentThisArg[this.sliceIdx + iB], this.parentThisArg[this.sliceIdx + iA]];
    }
    set(idx, value) {
        return this.parentThisArg[idx + this.sliceIdx] = value;
    }
    get(idx) {
        return this.parentThisArg[idx + this.sliceIdx];
    }
    content() {
        return this.parentThisArg.slice(this.sliceIdx, this.sliceIdx + this.sliceLen);
    }
    get [Symbol.toStringTag]() {
        return `ArrayWindow`;
    }
}
exports.default = ArrayWindow;
class WindowSizeError extends Error {
    constructor(message) {
        super(message);
        this.name = "WindowSizeError";
    }
}
exports.WindowSizeError = WindowSizeError;
class ArrayWindowIterator {
    constructor(thisArg, pSz) {
        this.sz = 0;
        if (thisArg.length < 1)
            throw new RangeError("Cannot call Array.window on array with size less than 1!");
        if (pSz > thisArg.length)
            throw new RangeError("Cannot call Array.window with a window size greater than the array size!");
        if (pSz < 1)
            throw new WindowSizeError("Cannot call Array.window with a window size of less than 1!");
        this.sz = pSz;
        this.thisArg = thisArg;
    }
    *[Symbol.iterator]() {
        let state = 0;
        if (this.thisArg.parentThisArg) {
            let cpy = this.thisArg.parentThisArg;
            ///@ts-expect-error
            this.thisArg = cpy.slice(this.thisArg.sliceIdx, this.thisArg.sliceIdx + this.thisArg.sliceLen);
            ;
        }
        while (state < this.thisArg.length) {
            let slice = this.thisArg.slice(state, (this.sz + state++));
            if (!(slice.length < this.sz)) {
                yield new ArrayWindow(this.thisArg, state - 1, slice.length);
            }
        }
    }
    get [Symbol.toStringTag]() {
        return `ArrayWindowIterator`;
    }
}
exports.ArrayWindowIterator = ArrayWindowIterator;
if (!Array.prototype.windows) {
    Array.prototype.windows = function (size) {
        return new ArrayWindowIterator(this, size);
    };
}
