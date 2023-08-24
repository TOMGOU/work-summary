let handler = {
  get: (target, propKey, receiver) => {
    if (propKey in target) {
      console.log({target, propKey})
      return target[propKey];
    } else {
      throw new ReferenceError("Prop name \"" + propKey + "\" does not exist.");
    }
  }
};

let person = new Proxy({
  add: ({x, y, success, fail}) => {
    let result = x + y
    if (typeof result === 'number') {
      success(result)
    } else {
      fail("请输入正确数字")
    }
  },
  min: ({x, y, success, fail}) => {
    let result = x - y
    if (typeof result === 'number') {
      success(result)
    } else {
      fail("请输入正确数字")
    }
  }
}, handler);

console.log({
  add: person.add({
    x: 1,
    y: 2,
    success: (res) => {
      console.log({ res })
    },
    fail: (err) => {
      console.log({ err })
    }
  }),
  min: person.min({
    x: 10,
    y: 2,
    success: (res) => {
      console.log({ res })
    },
    fail: (err) => {
      console.log({ err })
    }
  })
})

const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject)=> {
      return fn({
        ...args,
        success: resolve,
        fail: reject
      })
    })
  }
}

const promisifyAll = (obj) => {
  Object.keys(obj).forEach(key => {
    obj[key] = promisify(obj[key])
  })
  return obj
}

const obj = promisifyAll(person)

console.log({ obj })

obj.add({x: 1, y: 2}).then(res => {
  console.log({res})
})
