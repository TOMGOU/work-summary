# charles 的破解和使用

## 破解

> 破解网址：https://www.zzzmode.com/mytools/charles/

## 使用

### tools -> Rewrite 【上面的地址替换为下面的地址】

> 前端代理 url

```js
// https://boss.test.dos.lixinchuxing.cn/((?!(api|auth|store_config)).*)

// http://localhost:8000/$1
```

> 联调代理 url

```js
// http://lxcx.com:5000/(((api|auth|store_config)).*)

// http://localhost:8000/$1
```

> 接口代理 url

```js
// http://style.spacex.lan.cheanjia.net/(((api|static|resource)).*)

// http://localhost:8360/$1
```

> Host 代理

```js
// 192.168.102.23

// lxcx.com
```

### tools -> Map Local Setting

> 可以串改接口返回的数据

### 正则解释

> ((?!(api|auth|store_config)).*) 非

> $1 正则占位符（）

> 正则测试地址：https://regex101.com/ or https://jex.im/regulex/

## 竞品 whistle

> http://wproxy.org/whistle/install.html
