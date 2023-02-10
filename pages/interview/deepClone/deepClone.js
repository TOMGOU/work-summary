const deepClone = (obj, hash = new WeakMap()) => {
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

  if (hash.has(obj)) {
    console.log({ value: hash.get(obj) })
    return undefined
  }

  const resObj = Array.isArray(obj) ? [] : {}
  hash.set(obj, resObj)

  Reflect.ownKeys(obj).forEach(key => {
      resObj[key] = deepClone(obj[key], hash)
  })

  // for (let [key, value] of Object.entries(obj)) {
  //     resObj[key] = deepClone(value, hash)
  // }

  return resObj
}

var arr = [1, 2, {test: obj}]
let s1 = Symbol('foo');
let s2 = Symbol('foo');
var obj = {
  [s1]: 'test',
  [s2]: arr
}

const newObj = deepClone(obj)

console.log({ newObj: newObj })

console.log(JSON.parse(JSON.stringify(obj)))
