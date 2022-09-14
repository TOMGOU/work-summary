// const deepClone = target => {
//   let result, targetType = Object.prototype.toString.call(target)
//   if (targetType === '[object Object]') {
//     result = {}
//   } else if (targetType === '[object Array]') {
//     result = []
//   } else {
//     return target
//   }
//   for (let [key, value] of Object.entries(target)) {
//     result[key] = deepClone(value)
//   }
//   return result
// } 

const deepClone = (obj, hash = new WeakSet()) => {
  // 特殊类型判断
  if (obj === null) {
    return null
  }

  // todo: Date RegExp ...
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
    return undefined
  }

  const newObj = Array.isArray(obj) ? [] : {}

  hash.add(obj)

  Reflect.ownKeys(obj).forEach(key => {
    newObj[key] = deepClone(obj[key])
  })

  return newObj
}

var obj = {a: objects}

var objects = {test: [{ 'a': 1 }, { 'b': [1, 2, 3], c: obj }]};

const newObj = deepClone(objects);

console.log(newObj.test[1])