const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

console.log(arrayMethods)

// Object.defineProperty(arrayMethods, 'push', {
//   value: function (...args) {
//     // 通过apply，实现数组方法原有的功能
//     return arrayProto['push'].apply(this, args)
//   },
//   configurable: true,
//   writable: true,
//   enumerable: true
// })

// arrayMethods.push = function () {
//   arrayProto.push.call(this, ...arguments)
//   console.log('push', arguments)
// }

['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'].forEach((item) => {
  console.log({ item })
  arrayMethods[item] = function () {
    arrayProto[item].call(this, ...arguments)
    console.log(item, arguments)
  }
})

function protoArguments(arr) {
  // 覆盖数组原有的原型对象
  arr.__proto__ = arrayMethods
}

Array.__proto__ = arrayMethods

const arr = [1, 2, 3]
protoArguments(arr)
arr.push(4)
