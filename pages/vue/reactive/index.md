# vue-reactive

> Observer 劫持 data 中的数据，get 的时候，向 Dep 中订阅 Watcher，set 的时候，让 Dep 调用notify 事件发布消息触发 Watcher 中的 update 方法 ，更新绑定了对应 data 数据的 dom。Compiler 主要负责解析 vue 特有的一些指令，比如： v-model、@click，Watcher 就是在 Compiler 的构造函数中实例化的。

> Observer 主要目的是劫持 data 中的数据。

> Dep 负责依赖的搜集。

> Compile 是编译模板中的信息，比如指令。

> Watcher 是 data 数据与 dom 元素连接的桥梁。

## vue2.0

> Object.defineProperty

```js
export class Vue {
  constructor(options = {}) {
    this.$options = options
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    this.$data = options.data
    this.$methods = options.methods

    this.proxy(this.$data)

    // observer 拦截 this.$data
    new Observer(this.$data)

    new Compiler(this)
  }

  // 代理一下，this.$data.xxx -> this.xxx
  proxy(data) {
    Object.keys(data).forEach(key => {
      // this
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          // NaN !== NaN
          if (data[key] === newValue || __isNaN(data[key], newValue)) return
          data[key] = newValue
        }
      })
    })
  }
}

function __isNaN(a, b) {
  return Number.isNaN(a) && Number.isNaN(b)
}

class Dep {
  constructor() {
    this.deps = new Set()
  }
  add(dep) {
    if (dep && dep.update) this.deps.add(dep)
  }
  notify() {
    this.deps.forEach(dep => dep.update())
  } 
}

// html -> <h1>{{ count }}</h1> -> compiler 发现有 {{ count }}
// -> new Watcher(vm, 'count', () => renderToView(count)) -> count getter 被触发
// -> dep.add(watcher实例) -> this.count++ -> count setter -> dep.notify
// -> () => renderToView(count) -> 页面就变了

class Watcher {
  // vm - Vue 实例
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb // 在我们今天的列子里面，就是绘制数据到页面

    // window.watcher = this
    Dep.target = this
    this.__old = vm[key] // 存下了初始值，触发 getter
    Dep.target = null
  }
  update() {
    let newValue = this.vm[this.key]
    if (this.__old === newValue || __isNaN(newValue, this.__old)) return
    this.cb(newValue)
  }
}

class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    if (!data || typeof data !== 'object') return
    Object.keys(data).forEach(key => this.defineReactive(data, key, data[key]))
  }
  defineReactive(obj, key, value) {
    let that = this
    this.walk(value)
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        // Watcher 实例
        Dep.target && dep.add(Dep.target)
        return value
      },
      set(newValue) {
        if (value === newValue || __isNaN(value, newValue)) return
        value = newValue
        that.walk(newValue)
        dep.notify()
      }
    })
  }
}

class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.methods = vm.$methods

    this.compile(vm.$el)
  }
  compile(el) {
    let childNodes = el.childNodes
    // 类数组
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compileText(node)
      }
      else if (this.isElementNode(node)) {
        this.compileElement(node)
      }

      if (node.childNodes && node.childNodes.length) this.compile(node)
      // ...
    })
  }
  // <input v-model="msg"/>
  compileElement(node) {
    if (node.attributes.length) {
      Array.from(node.attributes).forEach(attr => {
        let attrName = attr.name
        if (this.isDirective(attrName)) {
          // v-on:click  v-model
          attrName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2)
          let key = attr.value
          this.update(node, key, attrName, this.vm[key])
        }
        // ...
      })
    }
  }
  update(node, key, attrName, value) {
    if (attrName === 'text') {
      node.textContent = value
      new Watcher(this.vm, key, val => node.textContent = val)
    }
    else if (attrName === 'model') {
      node.value = value
      new Watcher(this.vm, key, val => node.value = val)
      node.addEventListener('input', () => {
        this.vm[key] = node.value
      })
    }
    else if (attrName === 'click') {
      node.addEventListener(attrName, this.methods[key].bind(this.vm))
    }
    // ....
  }
  // 'this is {{ count }}'
  compileText(node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      new Watcher(this.vm, key, val => {
        node.textContent = val
      })
    }
  }
  isDirective(str) {
    return str.startsWith('v-')
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script type='module'>
    import { Vue } from './index.js'
    let vm = new Vue({
      el: '#app',
      data: {
        msg: 'Hello Vue2.x',
        count: 666
      },
      methods: {
        increase() {
          this.count++
        }
      }
    })
  </script>
</head>
<body>
  <div id="app">
    <h3>{{ msg }}</h3>
    <h3>{{ count }}</h3>
    <h1>v-text</h1>
    <div v-text="msg"></div>
    <h1>v-model</h1>
    <input type="text" v-model="msg" >
    <input type="text" v-model="count">
    <button v-on:click="increase">按钮</button>
  </div>
</body>
</html>
```

### Object.defineProperty(obj, key, handler)

- 对象遍历方法：Reflect.ownKeys(obj) / Object.keys()

- 递归模板：首先是终止条件

```js
const render = (key, val) => {
  console.log(`SET key=${key} val=${val}`)
}

const reactive = (obj) => {
  // 递归终止条件
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return
  }
  Reflect.ownKeys(obj).forEach(key => {
    let val = obj[key]
    // 下探到下一层
    reactive(val)
    // 当前层逻辑处理
    Object.defineProperty(obj, key, {
      get() {
        return val
      },
      set(newVal) {
        if (val !== newVal) {
          val = newVal
          render(key, val)
        }
      }
    })
  })
}


const data = {
  a: 1,
  b: 2,
  c: {
    c1: {
      d: 99
    },
    c2: 3
  }
}

reactive(data1)

data.a = 5
data.c.c2 = 6
data.c.c1.d = 7
```

### 数组的处理

- 改写数组原型方法：arr.__proto__ === Array.prototype

- 数组原型方法不能使用箭头函数

- 数组的判断方法：Object.prototype.toString.call(arr) === '[object Array]'

```js
const render = (method, ...val) => {
  console.log(`method:${method}-val:${val}`)
}

const reactive = (arr) => {
  // 原来的数组原型方法
  const arrPrototype = Array.prototype

  // 创建新的数组原型方法
  const newArrPrototype = Object.create(arrPrototype)

  const methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse']

  // 改写新的数组原型方法
  methods.forEach(method => {
    newArrPrototype[method] = function() {
      arrPrototype[method].call(this, ...arguments)
      render(method, ...arguments)
    }
  })
  if (Object.prototype.toString.call(arr) !== '[object Array]') return
  // 用新的数组原型方法替换实例旧的原型方法 arr.__proto__ === Array.prototype
  arr.__proto__ = newArrPrototype
}

data = [1, 2, 3, 4]

reactive(data)

data.push(5)
data.splice(0, 2)
data.reverse()
data.sort((a, b) => a - b)
```

## vue3.0

> proxy + composition-api

> vue3.0 的数据双向绑定，从 reactive 说起，触发 get 的时候，订阅依赖，触发 set 和 delete 的时候，发布依赖，依赖的收集本质还是发布订阅模式。

```js
const reactive = (data) => {
  return new Proxy(data, {
    get(target, key, receiver) {
      const ret = Reflect.get(target, key, receiver)
      console.log('get', key)
      // 此处订阅依赖，调用 track(target, key)
      return ret
    },
    set(target, key, val, receiver) {
      Reflect.set(target, key, val, receiver)
      console.log('set', key, val)
      // 此处发布依赖，调用 trigger(target, key)
      return true
    },
    deleteProperty(target, key, receiver) {
      const ret = Reflect.deleteProperty(target, key, receiver)
      console.log('delete', key)
      // 此处也是发布依赖，调用 trigger(target, key)，相当于 dep.notify()
      return ret 
    }
  })
}
```

## new Proxy(obj, handler)

- handler 个方法对应的参数：target、key、value、receiver

- Reflect.get(target, key, receiver)

- Reflect.set(target, key, val, receiver)

- Reflect.deleteProperty(target, key)

```js
const observableStore = new Map()

const makeObservable = (target) => {
  let handleName = Symbol('handle')
  observableStore.set(handleName, [])
  target.observe = function(handler) {
    observableStore.get(handleName).push(handler)
  }

  const proxyHandler = {
    get(target, key, receiver) {
      observableStore.get(handleName).forEach(handler => handler('GET', key, target[key]))
      // 懒监听，去获取的时候才监听对象里面的对象，而不是直接递归循环监听
      if (typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], proxyHandler)
      }
    
      return Reflect.get(target, key, receiver)
    },
    set(target, key, val, receiver) {
      observableStore.get(handleName).forEach(handler => handler('SET', key, val))
      Reflect.set(target, key, val, receiver)
    },
    deleteProperty(target, key) {
      observableStore.get(handleName).forEach(handler => handler('DELETE', key, target[key]))
      Reflect.deleteProperty(target, key)
    }
  }

  return new Proxy(target, proxyHandler)
}

let user = {
  a: {
    b: 1
  }
}

user = makeObservable(user)

user.observe((action, key, value) => {
  console.log(`${action} key=${key} value=${value}`)
})

user.name = 'Tommy'
console.log(user.name)
delete user.name
console.log(user.a.b)
console.log(user.a)
user.a.b = 2
```
