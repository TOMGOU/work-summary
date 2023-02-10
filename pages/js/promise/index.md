### promise的由来
js异步问题发展历程：
- 函数回调
- promise
- generator
- async/await

### Promise的理解
Promise 对象是一个代理对象。它接受你传入的 executor（执行器）作为入参，允许你把异步任务的成功和失败分别绑定到对应的处理方法上去。一个 Promise 实例有三种状态：
- pending 状态，表示进行中。这是 Promise 实例创建后的一个初始态；
- fulfilled 状态，表示成功完成。这是我们在执行器中调用 resolve 后，达成的状态；
- rejected 状态，表示操作失败、被拒绝。这是我们在执行器中调用 reject后，达成的状态

### Promise 常见方法
##### Promise.all(iterable)

- 参数是一个 promise 的 iterable 类型，如果参数中的元素不是 promise 对象，则需要通过 Promise.resolve 转换成 promise 对象。

- 返回的结果是个数组，且数组内数据要与传参数据对应。

- 只要一个报错，立马调用 reject 返回错误信息。

- 参数调用 then 方法得到需要返回的结果：item.then(res => ...)

```js
const PromiseAll = (iterator) => {
  const promises = Array.from(iterator)
  const data = []
  let i = 0
  return new Promise((resolve, reject) => {
    for (let [index, item] of promises.entries()) {
      Promise.resolve(item).then(res => {
        data[index] = res
        i ++
        if (i === promises.length) resolve(data)
      }).catch(err => reject(err))
    }
  })
}

const promise1 = Promise.resolve('promise1');
const promise2 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 2000, 'promise2');
});
const promise3 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 3000, 'promise3');
});

PromiseAll([11, promise1, promise2, promise3]).then(function(values) {
  console.log(values);
});
```

##### Promise.race(iterable)

```js
const PromiseRace = (iterator) => {
  const promises = Array.from(iterator)
  return new Promise((resolve, reject) => {
    for (let item of promises) {
      Promise.resolve(item).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    }
  })
}

const promise1 = Promise.resolve('promise1');
const promise2 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 2000, 'promise2');
});
const promise3 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 3000, 'promise3');
});

PromiseRace([promise2, promise3]).then(function(values) {
  console.log(values);
});
```

##### Promise.allSettled(iterable)

```js
const PromiseSettled = () => {
  
}
```

##### Promise.any(iterable)

```js
const PromiseAny = () => {
  
}
```

##### Promise.reject(reason)

```js
Promise.then(result => {···}).catch(error => {···})
```

##### Promise.resolve().resolve(value)
##### Promise.then(result => {···}).catch(error => {···}).finally(() => {···})

### Promise.race 实现并发控制

```js
const urls = [
  {
    info: 'img-1',
    time: 1000
  },
  {
    info: 'img-2',
    time: 2000
  },
  {
    info: 'img-3',
    time: 4000
  },
  {
    info: 'img-4',
    time: 5000
  },
  {
    info: 'img-5',
    time: 4000
  },
  {
    info: 'img-6',
    time: 3000
  },
  {
    info: 'img-7',
    time: 2000
  },
  {
    info: 'img-8',
    time: 3000
  },
  {
    info: 'img-9',
    time: 2000
  },
  {
    info: 'img-10',
    time: 4000
  },
  {
    info: 'img-11',
    time: 2000
  },
  {
    info: 'img-12',
    time: 3000
  },
]

const limitLoad = (urls, handler, limit) => {
  const sequence = [].concat(urls)
  let promises = []

  promises = sequence.splice(0, limit).map((url, index) => handler(url).then(() => index))

  let p = Promise.race(promises)
  for (let i = 0; i < sequence.length; i++) {
    p = p.then(res => {
      promises[res] = handler(sequence[i]).then(() => res)
      return Promise.race(promises)
    }).then()
  }
}


const loadImg = url => {
  return new Promise((resolve) => {
    console.log(`${url.info} start`)
    setTimeout(() => {
      console.log(`${url.info} end`)
      resolve()
    }, url.time)
  })
}

limitLoad(urls, loadImg, 3)

```

```js
var urls = [
  'https://www.kkkk1000.com/images/getImgData/getImgDatadata.jpg', 
  'https://www.kkkk1000.com/images/getImgData/gray.gif', 
  'https://www.kkkk1000.com/images/getImgData/Particle.gif', 
  'https://www.kkkk1000.com/images/getImgData/arithmetic.png', 
  'https://www.kkkk1000.com/images/getImgData/arithmetic2.gif', 
  'https://www.kkkk1000.com/images/getImgData/getImgDataError.jpg', 
  'https://www.kkkk1000.com/images/getImgData/arithmetic.gif', 
  'https://www.kkkk1000.com/images/wxQrCode2.png'
];

function loadImg(url) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = function () {
            console.log('一张图片加载完成:', url);
            resolve();
        }
        img.onerror = reject
        console.log('一张图片开始加载:', url);
        img.src = url
    })
};

function limitLoad(urls, handler, limit) {
    // 对数组做一个拷贝
    const sequence = [].concat(urls)
    let promises = [];

    //并发请求到最大数
    promises = sequence.splice(0, limit).map((url, index) => {
        // 这里返回的 index 是任务在 promises 的脚标，
        //用于在 Promise.race 之后找到完成的任务脚标
        return handler(url).then(() => {
            return index
        });
    });

    (async function loop() {
        let p = Promise.race(promises);
        for (let i = 0; i < sequence.length; i++) {
            p = p.then((res) => {
                promises[res] = handler(sequence[i]).then(() => {
                    return res
                });
                return Promise.race(promises)
            })
        }
    })()
}
limitLoad(urls, loadImg, 3)

```

### promisify

```js
const promisify = (fn) => {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(data);
      })
    })
  }
}
```

### 实际项目：登录流程改造
1. 获取微信 code
2. 请求登录拿到登录态
3. 切换⻔店完成登录

### promise链式调用

##### 1. 获取微信 code

```
/**
 * 获取微信 code （企业微信平台）
 * 
 */
function getWxworkCode() {
  return new Promise((resolve, reject) => {
    wx.qy.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
        } else {
          // 标准化返回 err
          reject({ message: '获取微信 code 失败' })
        }
      },
      fail() {
        // 标准化返回 err
        reject({ message: '获取微信 code 失败' })
      }
    })
  })
}
```

##### 2. 请求登录(未使用async await)

```
/**
 * 登录（企业微信平台）
 * @param {string} code 企业微信code
 */
function login(code) {
  return rest.auth.loginWithWxwork(code).then((res) => {
    const { code, data } = res
    // success：缓存 token，返回⻔店 id
    if ([0, 101].includes(code)) {
      commit('UPDATE_ACCESS_TOKEN', data['access-token'])
      return data.store_config.stores_config[0].store_id
    }
    // fail
    throw res
  })
}
```

##### 3. 切换⻔店(未使用async await)

```
/**
 * 切换⻔店
 * @param {number} storeId ⻔店id
 * @param {number} storeId ⻔店id
 */
function selectStore(storeId) {
  return rest.auth.selectStore(storeId).then((res) => {
    const { code, data } = res
    // success：更新 token，维护⽤户状态
    if (code === 0) {
      commit('UPDATE_ACCESS_TOKEN', data['access-token'])
      commit('UPDATE_COMMON_DATA', {
        userInfo: data.current_user_info,
        groupInfo: data.store_config.group_config,
        storeList: data.store_config.stores_config,
        storeInfo: data.store_config.store_config
      })
      return true
    }
    // fail
    throw res
  })
}
```

##### 4. 对外授权接⼝（企业微信）

```
/**
 * 登录授权
 * /
export function auth() {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  return getWxworkCode()
    .then((code) => login(code))
    .then((storeId) => selectStore(storeId))
    .catch((err) => {
      /**
      * err 标准化
      * { message: '' }
      */
      wx.showModal({
        title: '登录失败',
        confirmColor: '#1890FF',
        content: `${err.message || '⽹络异常'}，您可点击确定重新登录`,
        mask: true,
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            resolve(auth())
          }
        }
      })
    })
    .finally(wx.hideLoading)
  })
}
```

##### 5. 对外授权接口（async await）

```
/**
 * 登录授权
 */
export async function auth() {
  try {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const code = await getWxworkCode()
    const storeId = await login(code)
    await selectStore(storeId)
    wx.hideLoading()
  } catch (e) {
    wx.hideLoading()
    return new Promise((resolve) => {
      wx.showModal({
        title: '登录失败',
        confirmColor: '#1890FF',
        content: `${err.message || '⽹络异常'}，您可点击确定重新登录`,
        mask: true,
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            resolve(auth())
          }
        }
      })
    })
  }
}
```

### 异常处理：
1. 标准化返回 promise 异常信息
2. 若调⽤处需要得到 promise 结果状态，则 promise 内部应该往外抛出异常
3. 若调⽤处⽆需得到 promise 结果状态，则 promise 内部⾃⾏处理异常，⽆需往
外抛出异常