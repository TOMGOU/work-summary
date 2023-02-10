# bit operation

## 位运算基础

```js
console.log((10).toString(2)) // 1010
console.log((8).toString(2)) // 1000

// 与 &， 两个位都是 1 时，结果才为 1，否则为 0
console.log((10 & 8).toString(2)) // 1000

// 或 |，两个位都是 0 时，结果才为 0，否则为 1
console.log((10 | 8).toString(2)) // 1010

// 异或 ^， 两个位相同则为 0，不同则为 1
console.log((10 ^ 8).toString(2)) // 0010

// 非 ~，取反运算，0 则变为 1，1 则变为 0
console.log((~10 + 1).toString(2)) // -1010
console.log((~8 + 1).toString(2)) // -1000

// 左移 <<
10 << 8

// 右移 >>
10 >> 1

```