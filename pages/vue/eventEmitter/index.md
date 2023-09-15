# EventEmitter 发布订阅模式

> Vue里面用过eventBus作为通信，方式，实现方式是用Vue函数的$on/$emit方法。

> 类似 node 中的 events 模块下面的 EventEmitter 类

> 这种方式可以叫做发布订阅模式

```js
class MyEventEmitter {
  constructor() {
    this.events = {}
  }

  on (event, cbFn) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(cbFn)
    return this
  }

  off (event, cbFn) {
    if (!cbFn) {
      this.events[event] = []
      return this
    }
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(item => item !== cbFn)
    }
    return this
  }

  once (event, cbFn) {
    const onceFn = () => {
      cbFn.apply(this, arguments)
      this.off(event, onceFn)
    }
    this.on(event, onceFn)
    return this
  }

  emit (event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(item => item.call(this, ...args))
    }
  }
}

// test
const myEvent = new MyEventEmitter()

myEvent.on('test1', () => {
  console.log('test-11')
}).once('test2', () => {
  console.log('test-22')
})

myEvent.emit('test1')
myEvent.emit('test2')
myEvent.emit('test2')
```

```js
class EventBus {
  constructor () {
    this.events = new Map()
  }

  on(event, cbFn) {
    if (!this.events.has(event)) this.events.set(event, new Set())
    this.events.get(event).add(cbFn)
    return this
  }

  off(event, cbFn) {
    if (!cbFn) {
      this.events.delete(event)
      return this
    }
    if (this.events.has(event)) {
      this.events.get(event).delete(cbFn)
    }
    return this
  }

  once(event, cbFn) {
    const onceFn = () => {
      cbFn.call(this)
      this.off(event, onceFn)
    }
    this.on(event, onceFn)
    return this
  }

  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(item => {
        item.apply(this, args)
      });
    }
  }
}

const bus = new EventBus()
const fn = (...args) => console.log('t1', ...args)
const fn2 = (...args) => console.log('t2', ...args)
bus.on('t1', fn).once('t2', fn2)
bus.off('t1', fn)
bus.emit('t1', 1, 2)
bus.emit('t2')
bus.emit('t2') 
```

## 细节注意点

- 返回 this 是为了链式调用

- on 方法需要考虑首次添加事件 this.events[event] 不存在，直接复制空数组

- off 方法中的 filter 方法不会改变原数组的值，所以需要重新赋值：this.events[event] = this.events[event].filter(item => item !== cbFn)

- off 方法分两种情况：1. this.off(event), 直接清空数组; 2. this.off(event, cbFn), 只删除对应的事件

- once 方法的实现思路：对 cbFn 事件进行包裹，内部执行 cbFn 函数后，立即接触事件绑定（off 方法），然后对包裹后函数进行事件绑定，即调用 on 方法

- emit 方法要考虑两种特殊情况：

  * event 不存在，从未绑定过，所以需要先判断 this.events[event] 是否存在，否者报错。

  * 调用 emit 的时候，也可能要传递参数，比如：我们调用 on 方法的时候，cbFn 是带参数的。
  