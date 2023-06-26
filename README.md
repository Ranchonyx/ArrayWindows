# ArrayWindows

# Background
ArrayWindows is directly inspired by Rust's `std::slice::Windows`, for it provides similar functionality for Arrays in JavaScript and/or TypeScript.

# Warning
ArrayWindows adds a new method to the `Array.prototype`, namely `Array.prototype.windows`.

# Functionality
## Signature
`Array.prototype.windows<T>(winSz: number): ArrayWindowIterator<T>`

## Sample usage
```typescript
import "./dist/ArrayWindow";
const textArrayExample = "Hello, I am bored at work!".split("");

for(let window of textArrayExample.windows(2)) {
    console.log(window.content());
}
```
```
C:\Users\Bla\test> node test.js
[ 'H', 'e', 'l' ]
[ 'e', 'l', 'l' ]
[ 'l', 'l', 'o' ]
[ 'l', 'o', ' ' ]
[ 'o', ' ', 't' ]
[ ' ', 't', 'h' ]
[ 't', 'h', 'e' ]
[ 'h', 'e', 'r' ]
[ 'e', 'r', 'e' ]
[ 'r', 'e', '!' ]
```

# Reference
Each `ArrayWindow<T>` yielded by the `ArrayWindowIterator<T>` returned by `Array.prototype.windows()` exposes the following methods:

```typescript
isEmpty(): boolean;

first(): T;

last(): T;

swap(): void;

set(index: number, element: T): T;

get(index: number): T;
```

# Honest FYI
Since JavaScript doesn't pass arrays by reference, I had to cut some insane corners to emulate this behaviour, such as passing the topmost array's `this` object down to all slice objects and doing indexing magic.

It's messy, but it does work, you can edit the original array from inside a slice using the `get(index: number)` & `set(index: number, element: T)` Methods