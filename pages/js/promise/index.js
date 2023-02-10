// 请求出错重复请求

// const retryRequests = []
// new Promise((resolve, reject) => {
//   retryRequests.push(() => resolve(console.log(123)))
// })
// setTimeout(() => {
//   console.log({retryRequests})
//   retryRequests.forEach((fn) => fn())
// }, 3000)

// promisify 函数

const promisify = (fn) => {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (data) => {
        resolve(data)
      }, (err) => {
        if(err) {
          reject(err)
          return
        }
      })
    })
  }
}

let add = (a, b, resolve, reject) => {
  let result = a + b
  if (typeof result === 'number') {
    resolve(result)
  } else {
    reject("请输入正确数字")
  }
}

add(
  2,
  6,
  (res) => {
    console.log({ res })
  },
  (err) => {
    console.log({ err })
  }
)

const addCall = promisify(add)

addCall(2,6).then((res) => {
  console.log({ res });
})

