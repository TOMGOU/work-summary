const obj = {
  count: 0,
  [Symbol.iterator]: () => {
    return {
      next: () => {
        if (obj.count < 10) {
          obj.count++
          return {
            value: obj.count,
            done: false
          }
        } else {
          return {
            value: undefined,
            done: true
          }
        }
      }
    }
  }
}

// for (let item of obj) {
//   console.log({ item })
// }

function * generator () {
  const arr = [1, 2, 3, 4]
  for (item of arr) {
    yield console.log(item)
  }
}

const g = generator()
