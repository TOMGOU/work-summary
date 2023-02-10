const clone = source => {
  
  if (Object.prototype.toString.call(source)=== '[object Object]') {
    const newObj = {}
    for (let i in source) {
      if (source.hasOwnProperty(i)) {
        newObj[i] = source[i]
      }
    }
    return newObj
  }

  if (Object.prototype.toString.call(source)=== '[object Array]') {
    const newArr = []
    for (let [i, item] of source.entries()) {
      newArr[i] = item
    }
    return newArr
  }
  
}

// const objects = {test: [{ 'a': 1 }, { 'b': 2 }]};

// const newObj = clone(objects);

// console.log({ objects, newObj }, newObj.test === objects.test);

const arr = [{ 'a': 1 }, { 'b': 2 }];

// const newArr = clone(arr);
const newArr = [...arr]

console.log({ arr, newArr }, newArr[0] === arr[0]);

// const arr = [1, 2, 3, 4]

// const obj = { a: 1 }

// console.log(arr instanceof Array)
// console.log(obj instanceof Object)

// console.log(arr.__proto__ === Array.prototype)
// console.log(obj.__proto__ === Object.prototype)

// console.log(arr.constructor === Array)
// console.log(obj.constructor === Object)

// console.log(Object.prototype.toString.call(arr) === '[object Array]')
// console.log(Object.prototype.toString.call(obj)=== '[object Object]')

// console.log(Array.isArray(arr))
// console.log(Array.isArray(obj))

// console.log(typeof arr && !isNaN(arr.length))
// console.log(typeof obj && !isNaN(obj.length))