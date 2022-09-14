# 浅拷贝与深拷贝

## js 数据类型

- 基本数据类型：string, number, boolean, null, undefine, symbol

- 引用数据类型：object, array, function

- 区别：

  * 基本数据类型存储在栈内存中。

  * 引用数据类型在栈内存中存储的的是应用地址，这个应用地址指向堆内存对象。

## 赋值，浅拷贝和深拷贝

- 赋值：基本数据类型没问题，引用数据类型会指向同一个堆内存地址。

- 浅拷贝：引用数据类型的浅拷贝，只会拷贝第一层。

  * Array.concat()

  * Object.assign()

  * es6 解构

```js
const clone = source => {
  
  if (Object.prototype.toString.call(source)=== '[object Object]') {
    const newObj = {}
    for (let i in source) {
      if (source.hasOwnProperty(i)) {
        newObj[i] = source[i]
      }
    }
    return newObj
  }

  if (Object.prototype.toString.call(source)=== '[object Array]') {
    const newArr = []
    for (let [i, item] of source.entries()) {
      newArr[i] = item
    }
    return newArr
  }
  
}

const objects = {test: [{ 'a': 1 }, { 'b': 2 }]};

const newObj = clone(objects);

console.log({ objects, newObj }, newObj.test === objects.test);

const arr = [{ 'a': 1 }, { 'b': 2 }];

const newArr = clone(arr);

console.log({ arr, newArr }, newArr[0] === arr[0]);
```

- 深拷贝：引用数据类型的深拷贝，不仅会拷贝第一层，还会递归深层次拷贝。

  * JSON.parse()和JSON.stringify() 无法识别 Symbol 类型, 无法识别循环引用的问题。

  * 递归

    - 特别注意：arr.entries() 是数组特有的方法，Object.entries(target) 适合数组和对象。

    - Object.prototype.toString.call: 判断数据类型
      * Object.prototype.toString.call(Symbol()) === '[object Symbol]'
      * Object.prototype.toString.call(new Date()) === '[object Date]'
      * Object.prototype.toString.call(new RegExp()) === '[object RegExp]'
      * Object.prototype.toString.call(null) === '[object Null]'

  ```js
  const deepClone = target => {
    let result, targetType = Object.prototype.toString.call(target)
    if (targetType === '[object Object]') {
      result = {}
    } else if (targetType === '[object Array]') {
      result = []
    } else {
      return target
    }
    for (let [key, value] of Object.entries(target)) {
      result[key] = deepClone(value)
    }
    return result
  } 

  const objects = {test: [{ 'a': 1 }, { 'b': 2 }]};

  const newObj = deepClone(objects);
  console.log(newObj.test[0])
  ```

  * 上面的深拷贝代码，未考虑各种特殊类型的数据，例如：Date、RegExp、Symbol，最重要的是未考虑循环引用的问题。

    - for (let [key, value] of Object.entries(obj)) 无法识别 Symbol 作为 key 的情形

    - WeakMap 的特性：弱引用，游离于垃圾回收机制以外; hash.add() hash.has()

    - Object.keys() 与 Reflect.ownKeys() 的区别：Reflect.ownKeys() 可以遍历对象和数组

    - typeof: 判断数据类型
      * typeof null === 'object'
      * typeof new Date() === 'object'
      * typeof new RegExp() === 'object'
      * typeof Symbol() === 'symbol'
      * typeof function() {} === 'function'

  ```js
  const deepClone = (obj, hash = new WeakSet()) => {
    if (obj === null) {
        return null
    }

    if (obj instanceof Date) {
        return new Date(obj)
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj)
    }

    if (typeof obj !== 'object') {
        return obj
    }

    console.log({ hash, obj })
    if (hash.has(obj)) {
      return undefined
    }

    const resObj = Array.isArray(obj) ? [] : {}
    hash.add(obj)

    Reflect.ownKeys(obj).forEach(key => {
        resObj[key] = deepClone(obj[key], hash)
    })

    return resObj
  }
  ```

## 深浅拷贝函数参数判断：对象和数组的判断方法

- instanceof

```js
const arr = [1, 2, 3, 4]
const obj = { a: 1 }

console.log(arr instanceof Array)
console.log(obj instanceof Object)

console.log(arr.__proto__ === Array.prototype)
console.log(obj.__proto__ === Object.prototype)
```

- constructor

```js
const arr = [1, 2, 3, 4]
const obj = { a: 1 }

console.log(arr.constructor === Array)
console.log(obj.constructor === Object)
```

- toString

```js
const arr = [1, 2, 3, 4]
const obj = { a: 1 }

console.log(Object.prototype.toString.call(arr) === '[object Array]')
console.log(Object.prototype.toString.call(obj)=== '[object Object]')
```

- Array.isArray()

```js
const arr = [1, 2, 3, 4]
const obj = { a: 1 }

console.log(Array.isArray(arr))
console.log(Array.isArray(obj))
```

- length

```js
const arr = [1, 2, 3, 4]
const obj = { a: 1 }

console.log(typeof arr && !isNaN(arr.length))
console.log(typeof obj && !isNaN(obj.length))
```