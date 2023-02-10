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
