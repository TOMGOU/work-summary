# vue-router

## 1.Hash 和 History 的区别

* hash 有 #, history 没有
* hash 的#部分内容不会给服务端， history 的所有内容都会给服务端
* hash 通过 hashchange 监听变化，history 通过 popstate 监听变化

## 2. Hash

### a. 特性

* url 中带有一个#符号，但是#只是浏览器端/客户端的状态，不会传递给服务端。

* hash 值的更改，不会导致页面的刷新

* hash 值的更改，会在浏览器的访问历史中添加一条记录。所以我们才可以通过浏览器的返回、前进按钮来控制 hash 的切换

* hash 值的更改，会触发 hashchange 事件

```js
window.addEventLisenter('hashchange', () => {})
```
   
### b. 如何更改 hash

* location.hash

```js
location.hash = '#user';
```

* html 标签的方式

```html
<a href="#user"> 点击跳转到 user </a>
```

## 3.History

hash 有个#符号，不美观，服务端无法接受到 hash 路径和参数

html5 history

```js
window.history.back(); // 后退
window.history.forward(); // 前进
window.history.go(-3); // 接收number参数，后退三个页面
window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
```

### pushState/replaceState 的参数

1. state, 是一个对象，是一个与指定网址相关的对象，当 popstate 事件触发的时候，该对象会传入回调函数
2. title, 新页面的标题，浏览器支持不一，null
3. url, 页面的新地址

pushState, 页面的浏览记录里添加一个历史记录
replaceState, 替换当前历史记录

### History 的特性

1. pushState/replaceState 并不会触发 popstate 事件，这时我们需要手动触发页面的重新渲染。
2. 我们可以使用 popstate 来监听 url 的变化
3. popstate 到底什么时候才能触发。
   * 点击浏览器后退按钮
   * 点击浏览器前进按钮
   * js 调用 back 方法
   * js 调用 forward 方法
   * js 调用 go 方法

`pushState 和 replaceState 只是改变url地址，页面的重新渲染需要手动触发: window.location.reload()`

## `vue history`模式配置
> [vue history模式]( https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)主要有3个注意点：
 
1. 在vue-router中将`mode` 设为history
```javascript
 const router = new VueRouter({
  mode: 'history', // 开启history模式
  routes: [...]
})
```
2. web服务器端配置
```
 // nginx
 location / {
  try_files $uri $uri/ /index.html;
}
```
3. `history`引起的副作用的处理
> 在`history`模式下web 服务器在出现未知地址时不再重定向到`404`页面;需要在`vueRouter`中添加配置处理

```
const router = new VueRouter({
  mode: 'history',
  routes: [
    // 未能匹配的路径使用一个统一的组件来处理
    { path: '*', component: NotFoundComponent }
  ]
})
```
## 项目中具体改造
> 其中1和3没有什么特别的地方，按部就班。第二项通过dockerfile 来配置部署后的nginx服务器。具体可参考[星睿数据上报项目](https://gitlab.lixinio.com/starelite/dealer-report-frontend)，此项目已实现`history`模式

1. 在项目跟目录中新建`nginx/default.conf`文件，内容一般如下

```
server {
    listen       80;
    server_name  localhost;

    root /usr/share/nginx/html/;
    index index.html index.htm;
    location / {
        try_files $uri $uri/ /index.html;
    }

    location = /health {
        default_type  text/plain;
        access_log  off;
        error_log  off;
        return 200 'ok\n';
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

- nginx 配置解释：try_files $uri $uri/ /index.html;

  * root 根目录

  * location / 配置请求的路由，以及各种页面的处理情况。

  * try_files 尝试找文件，固定写法

  * $uri 根目录文件

  * $uri/ 根目录文件夹

  * /index.html 入口 HTML 文件：ip/index.html

  * 整体意思：访问 $uri 或者 $uri/ 都尝试寻找 root/index.html 这个文件

2. 接着在`Dockerfile`中添加指令将项目中的配置在部署时拷贝到镜像的nginx配置里`COPY nginx/default.conf /etc/nginx/conf.d`

## 4.Vue-Router简版hash(不完善)

```ts
import { VueConstructor } from 'vue/types'

interface RouteConfig {
  path: string,
  name: string,
  component: VueConstructor<Vue>
}

type Routes = Array<RouteConfig>

class Hash {
  listen(cb: Function) {
    window.addEventListener('hashchange', path => {
      cb && cb(window.location.hash)
    })
  }
}

export default class VueRouter {
  static install: (Vue: any) => void
  routes: Routes
  hash: any
  vm: any
  path: string
  constructor({ routes }: any) {
    this.routes = routes
    this.hash = new Hash()
    this.path = '/'
    this.hash.listen((path: string) => {
      this.path = path.slice(1)
      this.vm.$forceUpdate()
    })
  }

  init(vm: any) {
    this.vm = vm
  }
}

VueRouter.install = function(Vue: any) {
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        this.$options.router.init(this)
        Vue.util.defineReactive(this, '_route', this.$options.router)
      }
    }
  })
  Vue.component('router-view', {
    functional: true,
    render(createElement: any, { props, children, parent, data }: any) {
      const router =  parent.$parent._route
      const routes = router.routes
      const path = router.path
      let comp
      routes.forEach((item: any)=> {
        Object.keys(item).forEach((key: any) => {
          if (item[key] === path) {
            comp = item.component
          }
        })
      })
      return createElement(comp)
    }
  })
}
```

`hash模式实现关键点：`
1. hashchange 监听需要 this.vm.$forceUpdate() 强制更新
2. Vue.util.defineReactive(this, '_route', this.$options.router) 将 router 进行双向绑定

# 路由导航守卫

## 全局守卫

- beforeEach

```js
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

- beforeResolve

> 每次导航时都会触发，但是确保在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被正确调用。

```js
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error
      }
    }
  }
})
```

- afterEach

> 你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身。

```js
router.afterEach((to, from, failure) => {
  if (!failure) sendToAnalytics(to.fullPath)
})
```

## 路由独享守卫

- beforeEnter

> `beforeEnter` 守卫 只在进入路由时触发，不会在 `params`、`query` 或 `hash` 改变时触发。例如，从 `/users/2` 进入到 `/users/3` 或者从 `/users/2#info` 进入到 `/users/2#projects`。它们只有在从一个不同的路由导航时，才会被触发。

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

## 组件内部守卫

- beforeRouteEnter

- beforeRouteUpdate

- beforeRouteLeave

```js
const UserDetails = {
  template: `...`,
  beforeRouteEnter(to, from) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this` ！
    // 因为当守卫执行时，组件实例还没被创建！
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
    // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
  },
}
```

## 完整的导航解析流程

- 导航被触发。
- 在失活的组件里调用 beforeRouteLeave 守卫。
- 调用全局的 beforeEach 守卫。
- 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
- 在路由配置里调用 beforeEnter。
- 解析异步路由组件。
- 在被激活的组件里调用 beforeRouteEnter。
- 调用全局的 beforeResolve 守卫(2.5+)。
- 导航被确认。
- 调用全局的 afterEach 钩子。
- 触发 DOM 更新。
- 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

