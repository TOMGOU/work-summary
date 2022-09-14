# call bind 和 bind 方法的区别和深入理解

## 用法的区别
```js
const me = {
  name: 'xiuyan',
  age: 18
}

function showName(a, b) {
  console.log(`${this[a]}:${this[b]}岁`)
}

// call
showName.call(me, 'name', 'age')

// apply
showName.apply(me, ['name', 'age'])

// bind
showName.bind(me, 'name', 'age')()
```

## call的模拟
```js
Function.prototype.myCall = function(context, ...args) {
    // step1: 把函数挂到目标对象上（这里的 this 就是我们要改造的的那个函数）
    context.func = this
    // step2: 执行函数
    context.func(...args)
    // step3: 删除 step1 中挂到目标对象上的函数，把目标对象”完璧归赵”
    delete context.func
}
```

## apply的模拟
```js
Function.prototype.myApply = function(context, args) {
    // step1: 把函数挂到目标对象上（这里的 this 就是我们要改造的的那个函数）
    context.func = this
    // step2: 执行函数
    context.func(...args)
    // step3: 删除 step1 中挂到目标对象上的函数，把目标对象”完璧归赵”
    delete context.func
}
```

## bind的模拟
```js
Function.prototype.myBind = function(context, ...args) {
  // step1: 把函数挂到目标对象上（这里的 this 就是我们要改造的的那个函数）
  context.func = this
  // step2: 返回函数
  return () => {
    context.func(...args)
    // step3: 执行函数的时候，删除 step1 中挂到目标对象上的函数，把目标对象”完璧归赵”
    delete context.func
  }
}
```
