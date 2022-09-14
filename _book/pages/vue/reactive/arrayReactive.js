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
