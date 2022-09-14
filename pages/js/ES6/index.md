# ES6及以后新增的常用API解析

## 1. let 和 const 与 var 的区别

1. let 和 const 引入了块级作用域，var是全局作用域
2. let 和 const 不存在变量提升，var会变量提升
3. const 声明的是常量，声明后不可更改，引用类型的数据可以修改属性值。let和var声明的变量，声明之后可以更改
4. const 声明的时候必须赋值, let 和 var 声明时可以不赋值
5. var允许重复声明变量，后一个变量会覆盖前一个变量。let 和 const 在同一作用域不允许重复声明变量，会报错。

## 2. 箭头函数

###### 1. 箭头函数与普通函数的最大区别：箭头函数里的this是定义的时候决定的, 普通函数里的this是使用的时候决定的。

###### 2. 简写箭头函数

```js
// 单行不需要写return，单个参数可以不加括号
const square = a => a * a
// 可以用（）包裹代替return
const func = () => ({})
```

###### 3. 箭头函数不能被用作构造函数

构造函数会干嘛? 改变this指向到新实例出来的对象. 
箭头函数会干嘛？this指向是定义的时候决定的. 

- new 关键字干了啥？(const whitePlayer = new Player())
  1. 一个继承自 Player.prototype 的新对象 whitePlayer 被创建
  2. whitePlayer.`__proto__` 指向 Player.prototype，即 whitePlayer.`__proto__` = Player.prototype
  3. 将 this 指向新创建的对象 whitePlayer
  4. 返回新对象
    * 4.1 如果构造函数没有显式返回值，则返回 this
    * 4.2 如果构造函数有显式返回值，是基本类型，比如 number,string,boolean, 那么还是返回 this
    * 4.3 如果构造函数有显式返回值，是对象类型，比如{ a: 1 }, 则返回这个对象{ a: 1 }

## 3. class
```js
class Test {
  _name = ''
  constructor () {
    this.name = 'tommy'
  }

  static getName() {
    return `${this.name}-mark`
  }

  get name() {
    return this._name
  }

  set name(name) {
    this._name = name
  }
}
```

## 4. 模板字符串

###### 1. 换行方便
```js
console.log(`first
second
third`)
```

###### 2. 变量拼接方便
```js
const a = 'test'
console.log(`${a}`123)
```

###### 3. js函数模拟模板字符串

```js
const year = '2021'; 
const month = '10'; 
const day = '01'; 

let template = '${year}-${month}-${day}';
let context = { year, month, day };

const render = tem => {
  return (obj) => {
    // ?的意思是非贪婪模式（https://regex101.com/）
    return tem.replace(/\$\{(.+?)\}/g, (args, key) => {
      return context[key]
    })
  }
}

const str = render(template)({year,month,day});

console.log(str) // 2021-10-01
```

## 5. 解构

###### 1. 解构默认值和重命名
```js
let { f1 = 'test1', f2: rename = 'test2' } = { f1: 'current1', f2: 'current2'}
console.log(f1, rename) // current1, current2
```

###### 2. 解构的原理
针对可迭代对象的Iterator接口，通过遍历器按顺序获取对应的值进行赋值.

###### 3. 那么 Iterator 是什么?
Iterator是一种接口，为各种不一样的数据解构提供统一的访问机制。任何数据解构只要有Iterator接口，就能通过遍历操作，依次按顺序处理数据结构内所有成员。ES6中的for of的语法相当于遍历器，会在遍历数据结构时，自动寻找Iterator接口。

###### 4. Iterator有什么用?
  * 为各种数据解构提供统一的访问接口
  * 使得数据解构能按次序排列处理
  * 可以使用ES6最新命令 for of进行遍历

```js
function generateIterator(array) {
    let nextIndex = 0
    return {
        next: () => nextIndex < array.length ? {
            value: array[nextIndex++],
            done: false
        } : {
            value: undefined,
            done: true
        }
    };
}

const iterator = generateIterator([0, 1, 2])

console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
```

###### 5. 可迭代对象是什么?
可迭代对象是Iterator接口的实现。这是ECMAScript 2015的补充，它不是内置或语法，而仅仅是协议。任何遵循该协议点对象都能成为可迭代对象。可迭代对象得有两个协议：可迭代协议和迭代器协议。

  * 可迭代协议：对象必须实现iterator方法。即对象或其原型链上必须有一个名叫Symbol.iterator的属性。该属性的值为无参函数，函数返回迭代器协议。

  * 迭代器协议：定义了标准的方式来产生一个有限或无限序列值。其要求必须实现一个next()方法，该方法返回对象有done(boolean)和value属性。

###### 6. 我们自己来实现一个可以for of遍历的对象?
通过以上可知，自定义数据结构，只要拥有Iterator接口，并将其部署到自己的Symbol.iterator属性上，就可以成为可迭代对象，能被for of循环遍历。

```js
const obj = {
    count: 0,
    [Symbol.iterator]: () => {
        return {
            next: () => {
                obj.count++;
                if (obj.count <= 10) {
                    return {
                        value: obj.count,
                        done: false
                    }
                } else {
                    return {
                        value: undefined,
                        done: true
                    }
                }
            }
        }
    }
}

for (const item of obj) {
    console.log(item)
}
 
```

或者

```js
const iterable = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: Array.prototype[Symbol.iterator],
};

for (const item of iterable) {
    console.log(item);
}
```

## 6. 遍历

> for in 遍历 键名, for of 遍历 键值。

> for of 仅遍历当前对象, 不遍历原型链上的可枚举属性。

> for of 获取键名的方法：for (let [key, value] of obj.entries()) { }。

### 1. for in

遍历数组时，key为数组下标字符串；遍历对象，key为对象字段名。

```js
let obj = {a: 'test1', b: 'test2'}
for (let key in obj) {
    console.log(key, obj[key])
}
```

缺点：
  * for in 不仅会遍历当前对象，还包括原型链上的可枚举属性
  * for in 不适合遍历数组，主要应用为对象

### 2. for of 

可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments对象，NodeList对象）上创建一个迭代循环,调用自定义迭代钩子，并为每个不同属性的值执行语句。

```js
let arr = [{age: 1}, {age: 5}, {age: 100}, {age: 34}]
for(let {age} of arr) {
    if (age > 10) {
        break // for of 允许中断
    }
    console.log(age)
}
```

优点：
* for of 仅遍历当前对象

## 7. Object

###### 1. Object.keys

###### 2. Object.values

###### 3. Object.entries

###### 4. Object.getOwnPropertyNames

###### 5. Object.getOwnPropertyDescriptor

###### 6. Object.create()

```js
// 创建空对象
const obj1 = {};
const obj2 = Object.create(null);
const obj3 = new Object();
```

###### 7. Object.assign

###### 8. Object.defineProperty

## 8. Array

###### 1. Array.flat

```js
const arr = [1, 2, [3, 4, [5, 6]], 7]
arr.flat()
arr.flat(2)
arr.flat(Infinity)

// 数组扁平化
const newArr = [[1, 2], [3, 4], [5, 6]].reduce((prev, next, index, arr) => {
  console.log({prev, next})
  return prev.concat(next)
}, [])
console.log(newArr)

// reduce
const flatter = (arr) => {
  const res = []
  return arr.reduce((prev, next) => {
    if (Object.prototype.toString.call(next) === '[object Array]') {
      return prev.concat(flatter(next))
    } else {
      return prev.concat(next)
    }
  }, [])
}

console.log(flatter([[1, 2], [3, 4], [5, 6]]))

// forEach
const flatten = (arr) => {
  let res = []
  arr.forEach(item => {
    if (Object.prototype.toString.call(item) === '[object Array]') {
      res = [...res, ...flatter(item)]
    } else {
      res.push(item)
    }
  })
  return res
}

console.log(flatten([1, 2, [3, 4], [5, 6]]))
```

###### 2. Array.includes

###### 3. Array.find && Array.findIndex

###### 4. Array.from

```js
Array.from([1, 2, 3, 4], x => x * x)

// 类数组转成真数组
[...arguments]
Array.from(arguments)
Array.prototype.slice.call(arguments)

// 数组去重
Array.from(new Set(arr))
arr.filter((item, index, array) => array.indexOf(item) === index)
```

###### 5. Array.of

## 9. Promise

- then()异步请求成功后

- catch()异步请求错误的回调方法

- finally()请求之后无论是什么状态都会执行

- resolve()将现有对象转换为Promise对象

- all()此方法用于将多个Promise实例包装成一个新的promise实例

- race()也是将多个Promise实例包装成一个新的promise实例

- reject()返回一个状态为Rejected的新Promise实例

```js
/**
 * 1. Promise.all() 方法接收一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入。 —— 说明所传参数都具有Iterable,也就是可遍历。
 * 2. 并且只返回一个Promise实例。—— 说明最终返回是一个Promise对象。
 * 3. 那个输入的所有promise的resolve回调的结果是一个数组。—— 说明最终返回的结果是个数组，且数组内数据要与传参数据对应。
 * 4. 这个Promise的resolve回调执行是在所有输入的promise的resolve回调都结束，或者输入的iterable里没有promise了的时候。—— 说明最终返回时，要包含所有的结果的返回。
 * 5. 它的reject回调执行是，只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，并且reject的是第一个抛出的错误信息。—— 说明只要一个报错，立马调用reject返回错误信息。
 */

const PromiseAll = (iterator) => {
  const promises = Array.from(iterator)
  const len = promises.length
  let index = 0, data = []
  return new Promise((resolve, reject) => {
    for (let [i, item] of promises.entries()) {
      item.then(res => {
        data[i] = res
        index ++
        console.log({ i })
        if (index === len) resolve(data)
      }).catch(err => {
        reject(err)
      })
    }
  })
}

const PromiseRace = (iterator) => {
  const promises = Array.from(iterator)
  return new Promise((resolve, reject) => {
    for (let item of promises) {
      item.then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
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

PromiseAll([promise1, promise2, promise3]).then(function(values) {
  console.log(values);
});

PromiseRace([promise2, promise3]).then(function(values) {
  console.log(values);
});

```

## 10. async await yeild

```js
function longTimeFn(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(time);
        }, time)
    })
}

function * generator() {
    const list = [1000, 2000, 3000];
    for (let i of list) {
        yield longTimeFn(i);
    }
}

const kick = () => {
    let g = generator();
    const next = () => {
        const { value, done } = g.next()
        if (done) return
        value.then(res => {
            console.log(res)
            next()
        })
    }
    next()
}

kick()
```

> async 就相当于 generator 函数中的 *，await 相当于 yield。

> `async await` 就是结合 promise 和 generator 的高级语法糖。

```js
function longTimeFn(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(time);
        }, time);
    })
};

function asyncFunc(generator) {
    const iterator = generator(); // 接下来要执行next
    // data为第一次执行之后的返回结果，用于传给第二次执行
    const next = (data) => {
        const {
            value,
            done
        } = iterator.next(data); // 第二次执行，并接收第一次的请求结果 value 和 done

        if (done) return; // 执行完毕, 直接返回
        // 第一次执行next时，yield返回的 promise实例 赋值给了 value
        value.then(data => {
            next(data); // 当第一次value 执行完毕且成功时，执行下一步(并把第一次的结果传递下一步)
        });
    }
    next();
};

asyncFunc(function* () {
    let data = yield longTimeFn(1000);
    console.log(data);
    data = yield longTimeFn(2000);
    console.log(data);
    return data;
})
```

## 11. proxy

#### 对象的代理

- get(target, propKey, receiver) => person.age

- set(obj, prop, value, receiver) => person.age = 100

- has(target, key) => '_age' in person 拦截 HasProperty 操作

```js
let handler = {
  get: (target, propKey, receiver) => {
    if (propKey in target) {
      console.log({target, propKey, receiver})
      return target[propKey];
    } else {
      throw new ReferenceError("Prop name \"" + propKey + "\" does not exist.");
    }
  },
  set: (obj, prop, value, receiver) => {
    console.log({obj, prop, value, receiver})
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    obj[prop] = value;
    return true;
  },
  has: (target, key) => {
    if (key.startsWith('_')) {
      return false;
    }
    return key in target
  }
};

let person = new Proxy({}, handler);

person.age = 100;

console.log(person.age)

person._age = 100;

console.log('_age' in person) // false
```

#### 函数的代理
- apply(target, ctx, args) 参数说明：目标对象、目标对象的上下文对象（this）和目标对象的参数数组。

```js
const handler = {
  apply (target, ctx, args) {
    // return Reflect.apply(...arguments) * 2;
    return target(...args) * 2
  }
};

const sum = (left, right) => {
  return left + right
};

const proxy = new Proxy(sum, handler)

console.log(proxy(1, 2)) // 6

proxy.call(null, 5, 6) // 22

proxy.apply(null, [7, 8]) // 30

proxy.bind(null, 50, 60)() // 220
```

#### 其他(用得少，用的时候再学，知道有就行)

- construct (target, args, newTarget) => 拦截 new 命令

- deleteProperty (target, key) => 拦截 delete 操作

- defineProperty (target, key, descriptor) => 拦截 Object.defineProperty() 操作

- getOwnPropertyDescriptor (target, key) => 拦截 Object.getOwnPropertyDescriptor() 操作

- getPrototypeOf(target) => 拦截获取对象原型，有点多：😁
  * Object.prototype.__proto__
  * Object.prototype.isPrototypeOf()
  * Object.getPrototypeOf()
  * Reflect.getPrototypeOf()
  * instanceof

- isExtensible(target) => 拦截 Object.isExtensible() 操作

- ownKeys(target) => 拦截对象自身属性的读取操作, 也有点多：😁
  * Object.getOwnPropertyNames()
  * Object.getOwnPropertySymbols()
  * Object.keys()
  * for...in循环

- preventExtensions(target) => 拦截 Object.preventExtensions() 操作

- setPrototypeOf (target, proto) => 拦截 Object.setPrototypeOf() 方法

## 12. Reflect

Reflect是个什么东西?

* 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法
* 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
* Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。

```js
name in obj => Reflect.has(obj, name)
delete obj[name] => Reflect.deleteProperty(obj, name)
```

## 13 Set && WeakSet

#### A、Set类似于数组，但是成员的值都是唯一的，没有重复的值。[...new Set(array)]

```js
const set = new Set([1, 2, 3, 4])
/** Set 基础属性和方法 */
set.add(5) // 添加某个值，返回 Set 结构本身
set.delete(5) // 删除某个值，返回一个布尔值，表示删除是否成功
set.has(5) // 返回一个布尔值，表示该值是否为Set的成员
set.size // 返回Set实例的成员总数
set.clear() // 清除所有成员，没有返回值

/** Set 遍历操作 */
set.keys()：返回键名的遍历器
set.values()：返回键值的遍历器
set.entries()：返回键值对的遍历器
set.forEach()：使用回调函数遍历每个成员
for (item of set) {
  console.log(item)
} // 类似于...set
```
#### B、WeakSet 与 Set 区别

* WeakSet 的成员只能是对象，而不能是其他类型的值
* WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
* WeakSet 不可遍历
* WeakSet 没有size属性
* WeakSet 没有clear、forEach方法

## 14 Map && WeakMap

#### A、Map类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
const key = {'sex': 'male'}
/** Map 基础属性和方法 */
map.set(key, 'female').set(key, 'male') // 设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。set方法返回的是当前的Map对象，因此可以采用链式写法
map.delete(key) // 删除某个键，返回true。如果删除失败，返回false
map.get(key) // 读取key对应的键值，如果找不到key，返回undefined
map.has(key) // 返回一个布尔值，表示某个键是否在当前 Map 对象之中
map.size // 返回 Map 结构的成员总数
map.clear() // 清除所有成员，没有返回值

/** Map 遍历操作 */
map.keys()：返回键名的遍历器
map.values()：返回键值的遍历器
map.entries()：返回键值对的遍历器
map.forEach()：使用回调函数遍历每个成员
for (item of map) {
  console.log(item)
} // 类似于...set
```

#### B、Map 与 数组、对象、json 的相互转换

* Map 与 数组
* Map 与 对象
* Map 与 json

#### C、WeakMap 与 Map 区别

* WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
* WeakMap的键名所指向的对象，不计入垃圾回收机制。注意：WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用
* WeakMap 不可遍历
* WeakMap 没有size属性
* WeakMap 没有clear、forEach方法

## 15 Symbol

* Symbol('foo') 与 Symbol.for('foo')

* let s3 = Symbol.for('foo') 对应 Symbol.keyFor(s3）=== 'foo'

* s.description 比 s.toString() 好用直接返回描述信息 'foo'

* Symbol 在对象中的表示 key 需要加上 []

* Object.getOwnPropertySymbols 只便宜以 Symbol 作为 key 的属性

* Reflect.ownKeys 返回所有的键名，包括 Symbol 属性

```js
let s1 = Symbol('foo');
let s2 = Symbol('foo');

let s3 = Symbol.for('foo');
let s4 = Symbol.for('foo');

console.log(s3 === s4);

console.log(Symbol.keyFor(s3), Symbol.keyFor(s1))

console.log(s1.toString() === s2.toString());

console.log(s1.description, s2.description);

let a = {
  [s1]: 'Hello!',
  [s2]: 'World!'
};

console.log(a[s1], a[s2]);

Object.getOwnPropertySymbols(a).forEach(s => {
  console.log(s, a[s]);
})

Reflect.ownKeys(a).forEach(s => {
  console.log(s, a[s])
})
```

# es7 新语法

## 1.Array.prototype.includes()方法

## 2.求幂运算符**

```js
//在ES7中引入了指数运算符，具有与Math.pow()等效的计算结果
console.log(2**10); // 输出 1024
console.log(Math.pow(2, 10)) // 输出1 024
```

# es8 新语法

## 1.Async/Await

## 2.Object.values()，Object.entries()

## 3.String padding 字符串填充

```js
'x'.padStart(4, 'ab') // 'abax'
'x'.padEnd(5, 'ab') // 'xabab'

'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```

## 4.Object.getOwnPropertyDescriptors()

> ES5 的 `Object.getOwnPropertyDescriptor()` 方法会返回某个对象属性的描述对象（descriptor）。ES8 引入了 `Object.getOwnPropertyDescriptors()` 方法，返回指定对象所有自身属性（非继承属性）的描述对象。

> 该方法的引入目的，主要是为了解决 `Object.assign()` 无法正确拷贝 `get` 属性和 `set` 属性的问题。我们来看个例子：

```js
const source = {
  set foo (value) {
    console.log(value)
  },
  get bar () {
    return '浪里行舟'
  }
}
const target1 = {}
Object.assign(target1, source)
console.log(Object.getOwnPropertyDescriptor(target1, 'foo'))

```

# es9 新特性

## 1.for await of

```js
function Gen (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(time)
    }, time)
  })
}
async function test () {
  let arr = [Gen(2000), Gen(100), Gen(3000)]
  for await (let item of arr) {
    console.log(Date.now(), item)
  }
}
test()
// 1575536194608 2000
// 1575536194608 100
// 1575536195608 3000

```

## 2.Object Rest Spread

```js
const input = {
  a: 1,
  b: 2,
  c: 3
}
let { a, ...rest } = input
console.log(a, rest) // 1 {b: 2, c: 3}

```

## 3.Promise.prototype.finally()

```js
fetch('https://www.google.com')
  .then((response) => {
    console.log(response.status);
  })
  .catch((error) => { 
    console.log(error);
  })
  .finally(() => { 
    document.querySelector('#spinner').style.display = 'none';
  });
```

## 4.新的正则表达式特性

- s (dotAll) 标志

> 点（.）是一个特殊字符，代表任意的单个字符，但是有两个例外。一个是四个字节的 UTF-16 字符，这个可以用u修饰符解决；另一个是行终止符, 如换行符(\n)或回车符(\r):

```js
console.log(/foo.bar/.test('foo\nbar')) // false
console.log(/foo.bar/s.test('foo\nbar')) // true
```

- 命名捕获组

```js
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = re.exec('2019-01-01');
console.log(match.groups);          // → {year: "2019", month: "01", day: "01"}
console.log(match.groups.year);     // → 2019
console.log(match.groups.month);    // → 01
console.log(match.groups.day);      // → 01

```

- Lookbehind 后行断言

```js
let test = 'world hello'
console.log(test.match(/(?<=world\s)hello/))
// ["hello", index: 6, input: "world hello", groups: undefined]
```

- Unicode属性转义

```js
const str = '㉛';
console.log(/\d/u.test(str));    // → false
console.log(/\p{Number}/u.test(str));     // → true

console.log(/\P{Number}/u.test('㉛'));    // → false
console.log(/\P{Number}/u.test('ض'));    // → true
console.log(/\P{Alphabetic}/u.test('㉛'));    // → true
console.log(/\P{Alphabetic}/u.test('ض'));    // → false

```

# es10新特性

## 1.Array.prototype.flat()

## 2.Array.prototype.flatMap()

## 3.Object.fromEntries()

## 4.String.trimStart 和 String.trimEnd

## 5.String.prototype.matchAll

## 6.try…catch

> try-catch 语句中的参数变为了一个可选项

## 7.BigInt

## 8.Symbol.prototype.description

## 9.Function.prototype.toString()

## 10.空值合并运算符（??）

> 空值合并运算符（??）是一个逻辑运算符。当左侧操作数为 null 或 undefined 时，其返回右侧的操作数。否则返回左侧的操作数。

```js
const foo = null ?? 'default string';
console.log(foo);
// expected output: "default string"

const baz = 0 ?? 42;
console.log(baz);
// expected output: 0

```

## 11.可选链式操作符（?.）

```js
let person = {};
// 如果person对象不包含profile会报错
console.log(person.profile.name ?? "Anonymous"); // person.profile is undefined
// 下面的路径是可选的，如果person对象不包含profile属性直接返回"Anonymous"
console.log(person?.profile?.name ?? "Anonymous");
console.log(person?.profile?.age ?? 18);
```
