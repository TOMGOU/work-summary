# 网络安全

## xss 和 csrf 的区别

> XSS（Cross Site Scripting）：跨域脚本攻击

> CSRF（Cross-site request forgery）：跨站请求伪造

- 区别一：

CSRF：需要用户先登录网站A，获取 cookie。XSS：不需要登录。

- 区别二：（原理的区别）

CSRF：是利用网站A本身的漏洞，去请求网站A的api。XSS：是向网站 A 注入 JS代码，然后执行 JS 里的代码，篡改网站A的内容。

## 攻击原理

> XSS攻击的核心原理是：不需要你做任何的登录认证，它会通过合法的操作（比如在url中输入、在评论框中输入），向你的页面注入脚本（可能是js、hmtl代码块等）。

> XSS的攻击方式

- 1、反射型

发出请求时，XSS代码出现在url中，作为输入提交到服务器端，服务器端解析后响应，XSS代码随响应内容一起传回给浏览器，最后浏览器解析执行XSS代码。这个过程像一次反射，所以叫反射型XSS。

- 2、存储型存

储型XSS和反射型XSS的差别在于，提交的代码会存储在服务器端（数据库、内存、文件系统等），下次请求时目标页面时不用再提交XSS代码。

## 防范方式

> CSRF如何防御

- 方法一、Token 验证：（用的最多）

（1）服务器发送给客户端一个token；

（2）客户端提交的表单中带着这个token。

（3）如果这个 token 不合法，那么服务器拒绝这个请求。

- 方法二：隐藏令牌：

把 token 隐藏在 http 的 head头中。

方法二和方法一有点像，本质上没有太大区别，只是使用方式上有区别。

- 方法三、Referer 验证：

Referer 指的是页面请求来源。意思是，只接受本站的请求，服务器才做响应；如果不是，就拦截。

> XSS的防范措施主要有三个：

- 1、编码：

对用户输入的数据进行

HTML Entity 编码。

- 2、过滤：

移除用户输入的和事件相关的属性。如onerror可以自动触发攻击，还有onclick等。（总而言是，过滤掉一些不安全的内容）移除用户输入的Style节点、Script节点、Iframe节点。（尤其是Script节点，它可是支持跨域的呀，一定要移除）。

- 3、校正

避免直接对HTML Entity进行解码。使用DOM Parse转换，校正不配对的DOM标签

- 4. CSP

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP
https://juejin.cn/post/6844903780228530183

https://www.cnblogs.com/itsuibi/p/10752868.html


## 实际项目做法

- pc 端：

```js
csrf-token=1632470165##4090b1b6900c78d6136537e4af4a41337a241f2a;

扫码前：session=cc40ca33-4bef-4425-976b-d6cedbe3f33f;

扫码后：session=cc40ca33-4bef-4425-976b-d6cedbe3f33f;
```

  * CSRF (Cross-site request forgery) Token：通常是植入到页面中的一串随机字符串，每次请求都会变，提交表单的时候带上。服务器可以通过一定的规则来校验是否是自己发出的，。因为只有己方的网页有合法的 CSRF-Token，己方网页上的表单提交可以正常通过。这一操作是为了避免表单提交被第三方网站伪造，进而给用户造成损失。

  * session 本身是用户跟服务器建立会话之后，服务器生成的一串随机字符串，相当于用户会话ID，请求中有这个session，则表示请求是这个用户的这次会话中发出的，相当于临时身份证。

  * 客户端用企业微信扫码登录前后 session 是一样的，因为登陆后，服务器把该会话与该用户绑定，在服务端完成，用户从 session 看不出来。

- 小程序：

```js
access-token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzIzOTYxNDgsInd1aWQiOjg4ODUsInVzZXJfaWQiOjExNzYsImFwcGlkIjoid3g0NjJlZWMzNGY4ZDExZDU2In0.42K3lvTqDlJAcx2jCDvs_meS_nDFF10gPXAgLI_hM5o
```

> https://jwt.io/#debugger-io

采用 JWT 加密， 由三部分构成，header（头部）、payload（载荷）和 signature（签名）。

  * 头部

  ```json
  {
    "typ": "JWT",
    "alg": "HS256"
  }
  ```

    - typ 属性表示令牌的类型，JWT令牌统一写为 JWT。

    - alg 属性表示签名使用的算法，默认为HMAC SHA256（写为HS256);

    ![alg](../../../imgs/alg.png)


  * 有效载荷

  JWT 的主体内容部分，也是一个JSON对象，包含需要传递的数据。

  ```json
  {
    "exp": 1632396148, // expired_at 过期时间
    "wuid": 8885, // weixin_user_id 微信用户 id
    "user_id": 1176, // 我们自己的用户 id
    "appid": "wx462eec34f8d11d56"
  }
  ```

  * 签名

  签名哈希部分是对上面两部分数据签名，通过指定的算法生成哈希，以确保数据不会被篡改。

  首先，需要指定一个密码（secret），该密码仅仅为保存在服务器中，并且不能向用户公开。然后，使用标头中指定的签名算法（默认情况下为 HMAC SHA256）根据以下公式生成签名。

  ```
  HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload),secret)
  ```

  jwt-simple 例子：

  ```js
  const jwt = require('jwt-simple');
  const payload = { appid: 'wx462eec34f8d11d56' };
  const secret = '033Yo2000puDtM1Ipd300FpWau4Yo20S';
  
  // HS256 secrets are typically 128-bit random strings, for example hex-encoded:
  // var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')
  
  // encode
  const token = jwt.encode(payload, secret);
  console.log(token);

  // decode
  const decoded = jwt.decode(token, secret);
  console.log(decoded);
  ```
