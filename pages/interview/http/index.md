# http1.0, http1.1, http2.0, https 的区别

> https://www.cnblogs.com/heluan/p/8620312.html

## HTTP 1.0/1.1/2.0在并发请求上主要区别是什么?

- HTTP/1.0：每次TCP连接只能发送一个请求，当服务器响应后就会关闭这次连接，下一个请求需要再次建立TCP连接.

- HTTP/1.1：默认采用持续连接(TCP连接默认不关闭，可以被多个请求复用，不用声明 Connection: keep-alive).增加了管道机制，在同一个TCP连接里，允许多个请求同时发送，但响应还是要按顺序返回，存在`队头阻塞`的问题。

- HTTP/2.0：加了双工模式，即不仅客户端能够同时发送多个请求，服务端也能同时处理多个请求。
使用多路复用的技术，每个二进制帧的头部帧都有一个 ID 来标识属于哪个流。成功解决`队头阻塞`问题。

## HTTP1.0 和 HTTP1.1 的缓存策略区别？

- HTTP/1.0：在 HTTP1.0 中主要使用 header 里的 If-Modified-Since, Expires 来做为缓存判断的标准。

- HTTP/1.1：HTTP1.1 引入了更多的缓存控制策略例如：Entity tag，If-Unmodified-Since, If-Match, If-None-Match 等更多可供选择的缓存头来控制缓存策略。

## HTTP2.0 对性能进行了哪些改进？

- 二进制分帧：
在 HTTP1.x 中，数据以文本的格式进行传输，解析起来比较低效。
HTTP2.0 在传输消息时，首先会将消息划分为更小的消息和帧，然后再对其采取二进制格式的编码，确保高效的解析。

> https://blog.csdn.net/weixin_34122604/article/details/91443727

- 头部压缩:
HTTP2.0 中，客户端和服务器分别会维护一份相同的静态字典，这个字典用来存储常见的头部名称，以及常见的头部名称和值的组合。同时还会维护一份相同的动态字典，这个字典可以实时被更新。
如此一来，第一次相互通信过后，后面的请求只需要发送与前面请求之间头部不同的地方，其它的头部信息都可以从字典中获取。相对于 HTTP1.x 中每次都要携带整个头部跑来跑去的笨重操作来说，大大节省了网络开销。

- 多路复用:
请求与请求间完全不阻塞，A 请求的响应就算没回来，也不影响 B 请求收到自己的响应。请求与请求间做到了高度的独立，真正实现了并行请求。由此，彻底规避了队头阻塞问题。

- 服务端推送:
允许服务器主动向客户端 push 资源。

## 浏览器缓存策略是怎么样的？强缓存和协商缓存的区别有哪些？

```html
<meta http-equiv="Cache-Control" content="max-age=7200" />
<meta http-equiv="Expires" content="Mon, 20 Jul 2013 23:00:00 GMT" />
```

- 强缓存：直接从缓存中获取资源，不会再与服务端发生通信

  * `expires `

    ```js
    expires: Wed, 11 Sep 2019 16:12:18 GMT
    ```

    - expires 是一个时间戳，对比本地时间与 expires 设定的过期时间来判断是否直接去缓存中取资源。问题：服务器与客户端可能存在时差。
  
  * `cache-control`

    ```js
    cache-control: max-age=31536000
    ```

    -  Cache-Control 中，我们通过 max-age 来控制资源的有效期。max-age 不是一个时间戳，而是一个时间长度，单位是：秒。
    注意: max-age 是一个相对时间，这就意味着它有能力规避掉 expires 可能会带来的时差问题：max-age 机制下，资源的过期判定不再受服务器时间戳的限制。客户端会记录请求到资源的时间点，以此作为相对时间的起点，从而确保参与计算的两个时间节点（起始时间和当前时间）都来源于客户端，由此便能够实现更加精准的判断。

    - Cache-Control 的 max-age 配置项相对于 expires 的优先级更高。当 Cache-Control 与 expires 同时出现时，我们以 Cache-Control 为准。

    ```js
    cache-control: max-age=3600, s-maxage=31536000
    ```

    - s-maxage 优先级高于 max-age，两者同时出现时，优先考虑 s-maxage。s-maxage仅在代理服务器中生效，客户端中我们只考虑max-age。

    ```js
    cache-control: public max-age=3600, s-maxage=31536000
    ```

    - public & private 如果我们为资源设置了 public，那么它既可以被浏览器缓存，也可以被代理服务器缓存；如果我们设置了 private，则该资源只能被浏览器缓存。

    ```js
    cache-control: no-cache
    ```

    - no-cache 绕开了浏览器：我们为资源设置了 no-cache 后，每一次发起请求都不会再去询问浏览器的缓存情况，走协商缓存的路线。

    ```js
    cache-control: no-store
    ```

    - no-store 比较绝情，顾名思义就是不使用任何缓存策略。在 no-cache 的基础上，它连服务端的缓存确认也绕开了，只允许你直接向服务端发送请求、并下载完整的响应。


- 协商缓存：浏览器需要向服务器去询问缓存的相关信息，进而判断是否重新发起请求

  ```js
  Last-Modified: Fri, 27 Oct 2017 06:35:57 GMT

  If-Modified-Since: Fri, 27 Oct 2017 06:35:57 GMT
  ```

  * Last-Modified & If-Modified-Since

    - Last-Modified 是一个时间戳，如果我们启用了协商缓存，它会在首次请求时随着 Response Headers 返回。

    - If-Modified-Since 每次请求时，会带上一个叫 If-Modified-Since 的时间戳字段，它的值正是上一次 response 返回给它的 last-modified 值。

    - 使用 Last-Modified 存在一些弊端，这其中最常见的就是这样两个场景：

      * 我们编辑了文件，但文件的内容没有改变。服务端并不清楚我们是否真正改变了文件，它仍然通过最后编辑时间进行判断。因此这个资源在再次被请求时，会被当做新资源，进而引发一次完整的响应——不该重新请求的时候，也会重新请求。

      * 当我们修改文件的速度过快时（比如花了 100ms 完成了改动），由于 If-Modified-Since 只能检查到以秒为最小计量单位的时间差，所以它是感知不到这个改动的——该重新请求的时候，反而没有重新请求了。

  ```js
  ETag: W/"2a3b-1602480f459"

  If-None-Match: W/"2a3b-1602480f459"
  ```

  * Etag & If-None-Match

    - Etag 是由服务器为每个资源生成的唯一的标识字符串，这个标识字符串是基于文件内容编码的，只要文件内容不同，它们对应的 Etag 就是不同的，反之亦然。因此 Etag 能够精准地感知文件的变化。当首次请求时，我们会在响应头里获取到一个最初的标识符字符串。

    - If-None-Match 下一次请求时，请求头里就会带上一个值相同的、名为 if-None-Match 的字符串供服务端比对，它的值正是上一次 response 返回给它的 Etag 值。

    - Etag 的生成过程需要服务器额外付出开销，会影响服务端的性能，这是它的弊端。因此启用 Etag 需要我们审时度势。正如我们刚刚所提到的——Etag 并不能替代 Last-Modified，它只能作为 Last-Modified 的补充和强化存在。 Etag 在感知文件变化上比 Last-Modified 更加准确，优先级也更高。当 Etag 和 Last-Modified 同时存在时，以 Etag 为准。

## 说下对 https 的理解，以及与 http 的区别有哪些？

- HTTPS协议需要到CA申请证书，一般免费证书很少，需要交费。

- HTTP协议运行在TCP之上，所有传输的内容都是明文，HTTPS运行在SSL/TLS之上，SSL/TLS运行在TCP之上，所有传输的内容都经过加密的。

- HTTP和HTTPS使用的是完全不同的连接方式，用的端口也不一样，前者是80，后者是443。

- HTTPS可以有效的防止运营商劫持，主要解决了防劫持的一个大问题。

  * 明文传输：刚开始的 http 就是明文传输，客户端发送请求，服务端发送响应，双方都不对自己的请求/响应内容做加密的情况。这种情况下，请求/响应一旦被中间人（比如邱小冬）拦截，就可以对其中的内容一览无余、为所欲为。

  * 对称加密：客户端和服务器约定一个共同的“公钥”，加密和解密都依赖这一个公钥这种情况。这种情况下，一旦公钥失窃了，那么双方传输的密文信息就会再次进入裸奔状态，仍然无法规避中间人的攻击。

  * 非对称加密：公钥+私钥配合加密。公钥和私钥是多对一的关系，公钥加密的内容，只有私钥可以解开，私钥加密的内容，所有的公钥都可以解开。这样一来，就算中间人截获了公钥，但由于手里没有私钥，仍然没法正确地对数据进行解密。即便如此，仍然没办法完全规避中间人伪造公钥的这种场景，所以我们还需要第三方认证。

  * 第三方认证：CA（Catificate Authority）。它的作用就是提供证书，证书中包含的主要信息有：域名、公司信息、序列号、签名信息。客户端获取到证书里的机构信息之后，就会取出对应机构的公钥来解析证书里的签名和服务器发来的公钥信息。用签名来校验对方的身份，若校验通过，就可以顺利地使用当前解读出的公钥进行通信了。这个过程，就是“第三方认证”。

  ![证书细节](../../../imgs/ca.png)

### https 流程

- step-1: 客户端访问一个 https 协议的网站

- step-2: 服务器用自己的私钥加密网页以后，连同本身的数字证书，一起发送给客户端。

- step-3: 客户端的"证书管理器"，有"受信任的根证书颁发机构"列表。客户端会根据这张列表，查看解开数字证书的公钥是否在列表之内。受信任证书验证：

  * 如果数字证书记载的网址，与你正在浏览的网址不一致，就说明这张证书可能被冒用，浏览器会发出警告。

  * 如果这张数字证书不是由受信任的机构颁发的，浏览器会发出警告。

- step-4: 如果数字证书是可靠的，客户端就可以使用证书中的服务器公钥，对信息进行加密，然后与服务器交换加密信息。

## 如何解决跨域的问题？

- 同源策略：同源指的是在url中协议、域名、端口号均相同。同源策略是浏览器的一个安全功能，不同源的脚本在没有明确授权的情况下，不能读写对方资源。主要限制了以下三个方面：
  * Cookie、LocalStorage 和 IndexDB 无法读取
  * DOM 和 JS 对象无法获取
  * Ajax请求发送不出去

- 跨域解决方案：
  * JSONP

  * CORS：全称是"跨域资源共享"（Cross-origin resource sharing）

  ```js
  Access-Control-Allow-Origin: *
  ```

  * CORS 和 JSONP 的对比: CORS 的优势，往往是相对于 JSONP 来说的：JSONP只支持GET请求，而CORS支持所有类型的HTTP请求。但相应地，JSONP在低版本 IE 上也可以畅通无阻，CORS 就没有这么好的兼容性了。

  * postMessage 跨域

  * iframe 跨域

  * cookie 跨域

  * 反向代理跨域

## http 与 cookie 的关系？

- HTTP 是⼀种⽆状态协议, 在单纯HTTP这个层⾯，协议对于发送过的请求或响应都不做持久化
处理

- 使⽤Cookie做状态管理: 服务端返回的头信息上有可能会携带Set-Cookie, 那么当客户端接收到响应后, 就会在本地种上
cookie. 在下⼀次给服务端发送请求的时候, 就会携带上这些cookie。

## 常用的加密算法有哪些？请按安全等级排序。

> https://blog.csdn.net/baidu_22254181/article/details/82594072

>https://www.cnblogs.com/wjrblogs/p/13730128.html

- MD5 算法

- SHA1 算法

- HMAC 算法

- AES 算法

- DES 算法

- 3DES 算法

- RSA 算法

- ECC 算法

## http 与 ws 的区别

> 先看看一个最简单的 websocket 的例子：

- 客户端

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script>
    const ws = new WebSocket('ws://localhost:8181');
    ws.onmessage = function (e) {
      console.log('message', e.data)
    }
  </script>
</body>
</html>
```

- 服务端

```js
const WebSocketServer = require('ws').Server

wss = new WebSocketServer({ port: 8181 });
wss.on('connection', (ws) => {
  setInterval(() => {
    ws.send('reload')
  }, 1000)
})
```

#### 区别

- 单向与双向：

  * HTTP是单向的，客户端发送请求，服务器发送响应。
  
  * WebSocket是双向的，与HTTP不同，它以ws://或wss://开头。

- 协议状态：

  * HTTP是在TCP之上运行的无状态协议，TCP是一种面向连接的协议，它使用三向握手方法保证数据包传输的传递并重新传输丢失的数据包。
  
  * WebSocket在客户端-服务器通信的场景中使用的全双工协议，它是一个有状态协议，这意味着客户端和服务器之间的连接将保持活动状态，直到被任何一方终止。

#### 实际应用例子

- 拍卖小程序：https://github.com/weapp-socketio/weapp.socket.io

- 实际例子：拍卖大厅

```js
const io = require('./weapp.socket.io.js')

const socketIoUrl = 'https://lxcx.com/auction_car'

const socketEvents = [
  {
    name: 'connect',  // 连接成功，包括重连成功都会触发.
    handle: this.socketOnConnect
  },
  {
    name: 'disconnect',
    handle: this.socketOnDisconnect
  },
  {
    name: 'reconnect_attempt',
    handle: this.socketOnReconnectAttempt
  },
  {
    name: 'connect_error',
    handle: this.socketOnConnectError
  },
  {
    name: 'reconnecting',
    handle: this.socketOnReconnecting
  },
  {
    name: 'error',  // 发生错误时触发。比如 后端return false时触发。error (Object) error object
    handle: this.socketOnError
  },
  {
    name: 'pong', // 心跳包
    handle: this.socketOnPong
  },
  {
    name: 'bidding', // 有人出价广播
    handle: this.socketOnBidding
  },
  {
    name: 'bid_latest_info_resp', // 拉取最新的拍卖信息
    handle: this.socketOnLatestInfo
  },
  {
    name: 'unsold', // 流拍广播
    handle: this.socketBiddingOnCompleted
  },
  {
    name: 'sold', // 拍卖结束广播
    handle: this.socketBiddingOnCompleted
  },
  {
    name: 'sync_resp_info', // emit发送后的回应
    handle: this.socketOnResp
  }
]

// 判断避免重复创建socket实例。
if (this.socketIsExist) {
  this.joinAuctionRoom()
  return
}
const accessToken = wx.getStorageSync('access_token')
// 创建连接
const socket = io(this.socketIoUrl, {
  transports: ['websocket'],
  timeout: 10000, // 连接超时上线
  query: {
    access_token: accessToken,
    user_id: this.userId,
    name: this.userName
  }
})
// 绑定事件
this.socketEvents.forEach((element) => {
  socket.on(element.name, element.handle.bind(this))
})

```

- 官方例子：聊天室

```js
const io = require('./yout_path/weapp.socket.io.js')

const socketIoUrl = 'https://socket-io-chat.now.sh'

// const socket = io(socketIoUrl, {
//   transports: ['websocket'],
//   timeout: 10000, // 连接超时上线
//   query: {
//     access_token: '...',
//     user_id: 1,
//     name: 'Jack'
//   }
// })

const socket = io(socketIoUrl)

socket.on('connect', () => {
  console.log('connection created.')
});

socket.on('new message', d => {
  const {
    username,
    message
  } = d;
  console.log('received: ', username, message)
});

/**
 * Aboud connection
 */
socket.on('connect', () => {
  this.popMessage()
  this.pushMessage(createSystemMessage('连接成功'))
})

socket.on('connect_error', d => {
  this.pushMessage(createSystemMessage(`connect_error: ${d}`))
})

socket.on('connect_timeout', d => {
  this.pushMessage(createSystemMessage(`connect_timeout: ${d}`))
})

socket.on('disconnect', reason => {
  this.pushMessage(createSystemMessage(`disconnect: ${reason}`))
})

socket.on('reconnect', attemptNumber => {
  this.pushMessage(
    createSystemMessage(`reconnect success: ${attemptNumber}`)
  )
})

socket.on('reconnect_failed', () => {
  this.pushMessage(createSystemMessage('reconnect_failed'))
})

socket.on('reconnect_attempt', () => {
  this.pushMessage(createSystemMessage('正在尝试重连'))
})

socket.on('error', err => {
  this.pushMessage(createSystemMessage(`error: ${err}`))
})

/**
 * About chat
 */
socket.on('login', d => {
  this.pushMessage(
    createSystemMessage(`您已加入聊天室，当前共有 ${d.numUsers} 人`)
  )
})

socket.on('new message', d => {
  const { username, message } = d
  this.pushMessage(createUserMessage(message, username))
})

socket.on('user joined', d => {
  this.pushMessage(
    createSystemMessage(`${d.username} 来了，当前共有 ${d.numUsers} 人`)
  )
})

socket.on('user left', d => {
  this.pushMessage(
    createSystemMessage(`${d.username} 离开了，当前共有 ${d.numUsers} 人`)
  )
})

socket.on('typing', d => {})

socket.on('stop typing', d => {})

socket.emit('add user', this.me.nickName)

```

## 不同域名(多域名)下共享登录状态

> 登录的关键点：https://zhuanlan.zhihu.com/p/459448211

  - 响应头 response headers: Set-Cookie 可以将 cookie 种植到浏览器

  - 请求头 request headers: X-CSRF-Token 可以将 cookie 带给后台

> 方案一：在cookie里面的 `domain` 属性设置需要跨域的域名，这样就可以在多个站点实现共享cookie，也就是可以通过这种方式共享登录状态。这种方式比较简单快捷，但是有一个缺陷就是，共享cookie的站点需要是同一个顶级域名

> 方案二：在一个域名下登录后，跳转到另一个需要共享登录状态的域名时，可以将token一起携带过去，这样，目标站点获取到携带的token后存储下来，这样就算是实现共享登录状态了。但是这样也有一个缺陷，那就是假如在xx1站点下登录了，有token，如果不通过xx1站点的链接跳转到xx2站点，而是直接访问xx2站点，这样就无法把token携带过去了。

> 单点登录：https://developer.aliyun.com/article/636281