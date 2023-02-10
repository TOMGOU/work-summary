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
