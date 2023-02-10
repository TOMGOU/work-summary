# Ajax 基础

## 网页http请求： XMLHttpRequest

```js
const post = (url, form) => {
  const ajax = new XMLHttpRequest();
  const sendContent = [];
  for (let key in form) {
    sendContent.push(key + '=' + form[key])
  }
  // 使用post请求
  ajax.open('post', url);
  ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  ajax.setRequestHeader("x-csrf-token", '1571731401##a761cfba9d85274e5c7016b677009d95e25a1408');
  ajax.send(sendContent.join('&'));
  // 注册事件
  ajax.onreadystatechange = () => {
    if (ajax.readyState === 4 && ajax.status === 200) {
      console.log(ajax.responseText)
    }
    if (ajax.readyState===4 && ajax.status!==200) {
      console.log(ajax.responseText)
    }
  }
}

post('https://boss.test.dos.cheanjia.net/api/v1/auction_mock/create_auction',{
  store_id: 199,
  number: 2,
  started_at: '2019-10-22 15:10:20',
  tmpl_id: 32,
})
```

## wx请求： wx.request()

## node请求

### native

```js
var http = require("http");

var options = {
  "method": "POST",
  "hostname": [
    "127",
    "0",
    "0",
    "1"
  ],
  "port": "8360",
  "path": [
    "api",
    "v1",
    "permission",
    "update"
  ],
  "headers": {
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "Postman-Token": "db3d26a1-b1fa-4956-9a82-09652ce8d048"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({ roleid: 3, perid: [ 2, 3 ] }));
req.end();
```
### request

```js
var request = require("request");

var options = { method: 'POST',
  url: 'http://127.0.0.1:8360/api/v1/permission/update',
  headers: 
   { 'Postman-Token': 'bb2ad141-a8ba-4b35-a8f2-084651f877a4',
     'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: { roleid: 3, perid: [ 2, 3 ] },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```
### unirest

```js
var unirest = require("unirest");

var req = unirest("POST", "http://127.0.0.1:8360/api/v1/permission/update");

req.headers({
  "Postman-Token": "6dc4bab2-ca60-435f-8c71-f2eb6092ed7c",
  "cache-control": "no-cache",
  "Content-Type": "application/json"
});

req.type("json");
req.send({
  "roleid": 3,
  "perid": [
    2,
    3
  ]
});

req.end(function (res) {
  if (res.error) throw new Error(res.error);

  console.log(res.body);
});

```
### axios

```js
const axios  = require('axios')
axios.post('https://boss.test.dos.cheanjia.net/api/v1/auction_mock/create_auction', {
  store_id: 199,
  number: 2,
  started_at: '2019-10-22 15:50:20',
  tmpl_id: 32
}, {
  'x-csrf-token': '1571731401##a761cfba9d85274e5c7016b677009d95e25a1408'
})
.then(function (response) {
  console.log(response);
})
.catch(function (error) {
  console.log(error);
});

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});
```

### flyio

```js
const fly = require("flyio")

fly.post('/user', {
    name: 'Doris',
    age: 24
    phone:"18513222525"
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

//添加请求拦截器
fly.interceptors.request.use((request)=>{
    //给所有请求添加自定义header
    request.headers["X-Tag"]="flyio";
  	//打印出请求体
  	console.log(request.body)
  	//终止请求
  	//var err=new Error("xxx")
  	//err.request=request
  	//return Promise.reject(new Error(""))
  
    //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
    return request;
})
 
//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response) => {
        //只将请求结果的data字段返回
        return response.data
    },
    (err) => {
        //发生网络错误后会走到这里
        return Promise.resolve("ssss")
    }
)
```

## 网页 `http` 请求：`ajax` 与 `fetch` 的区别

- `ajax` 的本质就是使用 `XMLHttpRequest` 对象来请求数据

- `fetch` 是基于 `Promise` 来实现的 `es6` 新语法 API，是 `XMLHttpRequest` 的一种替代方案，它的主要特点有：

  - 1、第一个参数是URL.

  - 2、第二个参数是可选参数，可以控制不同的配置的init对象。

  - 3、使用了JavaScript Promises来处理结果/回调。

```js
<script>
  fetch('http://123.207.32.32:8000/home/multidata').then(function(response) {
    console.log(response)
    return response.json()
  }).then(function(returnedValue) {
    console.log(returnedValue)
  }).catch(function(err) {
    console.log(err)
  })
</script>

```

- fetch 与 ajax 的两个明显的区别

  * 从 fetch() 返回的 `Promise` 将不会拒绝 `http` 错误状态，即使相应是一个相应是400或者500，需要自行封装。

  ```js
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

  function parseJSON(response) {
    return response.json()
  }

  fetch('/users')
    .then(checkStatus)
    .then(parseJSON)
    .then(function(data) {
      console.log('request succeeded with JSON response', data)
    }).catch(function(error) {
      console.log('request failed', error)
    })
  ```

  * 默认情况下，`fetch` 不会接受和发送 `cookie`，如果需要发送 `cookie` 的话，此时需要对其单独进行配置。

  ```js
  fetch(url, {
    credentials: 'same-origin'
  })
  ```
  
  * 对于 `cors` 请求，使用 `include` 值允许将凭证发送到其他域。

  ```js
  fetch(url, {
    credentials: 'include'
  })
  ```

## flyio 与 axios 的两个明显的区别

> Angular、React、Vue 这些框架通常都只专注于View层，而对于http请求，开发者一般都会单独引入一个http 请求库，如axios。随着项目的使用，觉得 axios 不尽完美，在一些场景用起来并不舒服，所以才有了Fly。

> 相同点

1. 都支持Promise API,

2. 都同时支持Node和Browser环境

3. 都支持请求／响应拦截器

4. 都支持自动转换 JSON

> 不同点

- 浏览器环境下两者功能不分伯仲，最大的不同是大小，fly.min.js只有4K左右，而axios.min.js 12K左右。Fly更轻量，集成成本更低

- 请求转发: Fly最大的特点就是在混合APP中支持请求转发，而axios不支持，关于请求转发的详细内容请参照请求重定向。值得注意的是，在web app中，webview无法拦截ajax请求，而当时现有的js http请求库没有一个提供请求转发的功能。

- Http Engine: Fly中提出了Http Engine的概念，Fly可以通过更换Http Engine的方式实现很多有趣的功能，比如全局Ajax拦截，详情请参考全局ajax拦截。

- 在浏览器端，fly和axios实现的功能差不多，fly以轻巧取胜；在node端，fly占有明显的优势；而在于web app中，fly 的请求转发功能是独有的。而在设计思想上，fly更是技高一筹，这使得fly能够轻松的在不同的环境下运行并可以方便的对其进行定制化。
