# 闭包

## 什么是闭包？

闭包是指那些能够访问自由变量的函数。

自由变量是指在函数中使用的，既不是函数参数也不是函数局部变量的变量。

## 应用场景

- 柯里化函数

```js
const getArea = (width, height) => width * height

const area1 = getArea(10, 20)
const area2 = getArea(10, 30)
const area3 = getArea(10, 40)
const area4 = getArea(10, 50)

const getAreaCurry = width => height => width * height

const getTenArea = getAreaCurry(10)

const area5 = getTenArea(20)
const area6 = getTenArea(30)
const area7 = getTenArea(40)
const area8 = getTenArea(50)
```

- 使用闭包实现私有方法或者变量

```js
(function() {
  let lives = 30
  window.add = () => {
    live += 1
  }
  window.min = () => {
    live -= 1
  }
})()
```

- 缓存一些结果

```js
const cache = () => {
  const arr = []

  return (i) => {
    arr.push(i)
    console.log({ arr })
  }
}

const cacheNum = cache()
cacheNum(1)
cacheNum(2)
```


## 实现 compose 函数

```js
const compose = (...args) => num => args.reverse().reduce((pre, cur) => cur(pre), num)

const fun1 = x => x * 2
const fun2 = x => x * 3
const fun3 = x => x * 4

const res = compose(fun1, fun2, fun3)(1)

console.log({ res })
```

