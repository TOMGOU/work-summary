/**
 * 1. Promise.all() 方法接收一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入。 —— 说明所传参数都具有Iterable,也就是可遍历。
 * 2. 并且只返回一个Promise实例。—— 说明最终返回是一个Promise对象。
 * 3. 那个输入的所有promise的resolve回调的结果是一个数组。—— 说明最终返回的结果是个数组，且数组内数据要与传参数据对应。
 * 4. 这个Promise的resolve回调执行是在所有输入的promise的resolve回调都结束，或者输入的iterable里没有promise了的时候。—— 说明最终返回时，要包含所有的结果的返回。
 * 5. 它的reject回调执行是，只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，并且reject的是第一个抛出的错误信息。—— 说明只要一个报错，立马调用reject返回错误信息。
 */

// const PromiseAll = (iterator) => {
//   const promises = Array.from(iterator)
//   const len = promises.length
//   let index = 0, data = []
//   return new Promise((resolve, reject) => {
//     for (let [i, item] of promises.entries()) {
//       item.then(res => {
//         data[i] = res
//         index ++
//         console.log({ i })
//         if (index === len) resolve(data)
//       }).catch(err => {
//         reject(err)
//       })
//     }
//   })
// }

// const PromiseRace = (iterator) => {
//   const promises = Array.from(iterator)
//   return new Promise((resolve, reject) => {
//     for (let item of promises) {
//       item.then(res => {
//         resolve(res)
//       }).catch(err => {
//         reject(err)
//       })
//     }
//   })
// }

// const PromiseAll = (iterator) => {
//   const promises = Array.from(iterator)
//   const data = []
//   let i = 0
//   return new Promise((resolve, reject) => {
//     for (let [index, item] of promises.entries()) {
//       Promise.resolve(item).then(res => {
//         data[index] = res
//         i ++
//         if (i === promises.length) resolve(data)
//       }).catch(err => reject(err))
//     }
//   })
// }

const PromiseRace = (iterator) => {
  const promises = Array.from(iterator)
  return new Promise((resolve, reject) => {
    for (let item of promises) {
      Promise.resolve(item).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    }
  })
}

const promise1 = Promise.resolve('promise1');
const promise2 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 2000, 'promise2');
});
const promise3 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 3000, 'promise3');
});

// PromiseAll([11, promise1, promise2, promise3]).then(function(values) {
//   console.log(values);
// });

PromiseRace([promise2, promise3]).then(function(values) {
  console.log(values);
});

// const arr = [1, 2, 3, 4]
// Array.prototype.name = 'hello'

// for (let i in arr) {
//   console.log(i, arr[i])
// }

// for (let item of arr) {
//   console.log(item)
// }

// for (let [index, item] of arr.entries()) {
//   console.log(index, item)
// }


// const handler = {
//   apply (target, ctx, args) {
//     console.log({ target, ctx, args })
//     return Reflect.apply(...arguments) * 2;
//     // return target(...args) * 2
//   }
// };

// const sum = (left, right) => {
//   return left + right
// };

// const proxy = new Proxy(sum, handler)

// console.log(proxy(1, 2)) // 6
// console.log(proxy.call(null, 1, 2)) // 6
// console.log(proxy.apply(null, [1, 2])) // 6
// console.log(proxy.bind(null, 1, 2)()) // 6

