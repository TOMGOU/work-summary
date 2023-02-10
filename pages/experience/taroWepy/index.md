# WEPY&TARO混合小程序

## 知识点

- lerna ✅
- wepy 打包机制
- taro 打包机制
- child_process
- promise
- babel

```js
const babel = require("@babel/core")
const template = require("@babel/template").default
const generate = require("@babel/generator").default
const traverse = require("@babel/traverse").default
```

### wepy 打包机制

```js
const path = require('path')
const globalInject = require('./src/config/globalVarInject.js')

const { NODE_ENV } = process.env
const isProd = NODE_ENV === 'production'
const isTest = NODE_ENV === 'test'
const uglifyjsFilterRegExp = /^((?!\/npm\/).)*\.js$/
module.exports = {
  target: 'dist/lixin', // 占位符，将被替换成target: 'dist/lixin' or target: 'dist/lexus'
  wpyExt: '.wpy',
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    },
    modules: ['node_modules']
  },
  eslint: true,
  compilers: {
    // 压缩less
    less: {
      compress: true,
      paths: [
        // path.resolve(__dirname, 'src/assets/base')
      ]
    },
    // babel
    babel: {
      sourceMap: false,
      presets: [
        'env'
      ],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        'transform-export-extensions',
        'transform-node-env-inline',
        ['global-define', globalInject]
      ]
    }
  },
  appConfig: {
    noPromiseAPI: ['createSelectorQuery']
  },
  plugins: {
    // 压缩js
    uglifyjs: {
      filter: uglifyjsFilterRegExp, // uglifyjs 对第三方包可能会出现压缩出错不兼容情况，针对第三方包不在压缩
      config: {}
    }
  }
}
```

### taro 打包机制

```js
const path = require('path')

const wepyProjectRoot = path.posix.resolve(__dirname, '../../wepy-project')
const wepyConfigPath = path.posix.join(wepyProjectRoot, 'wepy.config.js')
const taroProjectRoot = path.posix.resolve(__dirname, '../')
const target = require(wepyConfigPath).target
// const wxappDistDir = path.posix.join(wepyProjectRoot, target)
// const nameInDir = 'taro'
const globalInject = require(path.posix.join(wepyProjectRoot, 'src/config/globalVarInject.js'))
const injects = {}
Object.keys(globalInject).forEach(key => {
  injects[key] = JSON.stringify(globalInject[key])
})
const config = {
  projectName: 'taro-project',
  date: '2021-7-7',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-platform-weapp',
    '@tarojs/plugin-indie',
    path.posix.join(process.cwd(), 'plugins/taro-plugin-patch-addChunkPages/index.js'),
    // 将打包好的文件复制一份到wepy打包目录下
    path.posix.join(process.cwd(), 'plugins/taro-plugin-mv/index.js')
  ],
  alias: {
    'src': path.posix.join(taroProjectRoot, '/src'),
    // 这个要引用原项目文件，因为less文件中定义了一些变量，在taro中需要使用
    '@@/style': path.posix.resolve(__dirname, '../../wepy-project/src/assets')
  },
  env: {
    // DIST_WXAPP_DIR: JSON.stringify(wxappDistDir),
    TEMP_TYPE: JSON.stringify(target.split('/')[1])
  },
  defineConstants: {
    ...injects
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
    addChunkPages (pages) {
      // taro对这里的处理由bug，所以利用taro-plugin-patch-addChunkPages插件打了补丁
      pages.set('pages/auction/cardetail', ['pages/auction/auction-components']),
      pages.set('pages/auction/finishCarDetail', ['pages/auction/auction-components'])
    },
    webpackChain (chain) {
      chain.merge({
        externals: [
          (context, request, callback) => {
            if (request.startsWith('@dist')) {
              const res = replaceRoute(request.replace('@dist', ''))
              return callback(null, res)
            }
            callback()
          },
          {
            // 将taro包中的npm脚本指向wepy已经构建好的npm包，请确保wepy构建已经将npm包放在npm目录下
            // __REPLACE__是提供给relative-lib-path-webpack-plugin插件识别的关键字
            'dayjs': replaceRoute('/npm/dayjs/dayjs.min.js'),
            '@lx-frontend/report': replaceRoute('/npm/@lx-frontend/report/lib/index.js'),
            'big.js': replaceRoute('/npm/big.js/big.js'),
            'redux': replaceRoute('/npm/redux/lib/redux.js'),
            'redux-thunk': replaceRoute('/npm/redux-thunk/lib/index.js'),
            'cnchar-trad': replaceRoute('/npm/cnchar-trad/cnchar.trad.min.js'),
            'cnchar': replaceRoute('/npm/cnchar/cnchar.min.js')
          },
          (context, request, callback) => {
            // 处理lodash，lodash代码从venders.js中剔除，改从npm直接引用
            // 依然需要借助relative-lib-path-webpack-plugin插件完成路径转化
            // 如果直接引用的lodash而不是某一个明确的lodash函数，则不处理
            const isLodash = /^lodash.+/.test(request)
            const extName = path.posix.extname(request)
            if (isLodash) {
              const fullRequestName = extName === '' ? `${request}.js` : request
              return callback(null, replaceRoute(`/npm/${fullRequestName}`))
            }

            callback()
          },
        ],
        plugin: {
          relativeLib: {
            plugin: require('../plugins/relative-lib-path-webpack-plugin')
          }
        },
        optimization: {
          splitChunks: {
            cacheGroups: {
              auctionComps: {
                name: 'pages/auction/auction-components',
                minChunks: 1,
                test: (module) => {
                  return /pages\/auction\/components/.test(module.resource) || /pages\/auction\/scripts/.test(module.resource)
                },
                priority: 200
              }
            }
          }
        }
      })
    },
    postcss: {
      pxtransform: {
        enable: false,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    miniCssExtractPluginOption: {
      //忽略css文件引入顺序
      ignoreOrder: true
    }
  }
}
```

### wepy 与 taro 混合使用

> 打包后的小程序本质是，把一系列资源按照特定的规则进行整合，而这个规则的描述文件就是 app.json

> 所以只要满足小程序的规则，就可以将 wepy 与 taro 打包后的文件进行组合使用。

- 混合使用需要做的三件事：

  * 在wepy 打包后的文件中，找到 app.js 引入 `const taroApp = require('./taro/app.js').taroApp`

  ```js
  Promise.resolve().then(function() {
    var taroApp = require("./taro/app.js");
  })
  ```

  * 在wepy 打包后的文件中，找到 app.wxss 引入 `@import './taro/app.wxss';`

  * 在wepy 打包后的文件中，找到 app.json 加入新页面路径，比如：

  ```js
  newTaroSubPackages: [
    { root: 'taro/pages/auction', pages: [Array] },
    { root: 'taro/pages/my', pages: [Array] },
    { root: 'taro/pages/sources', pages: [Array] },
    { root: 'taro/pages/follow', pages: [Array] },
    { root: 'taro/pages/reviewManage', pages: [Array] }
  ]
  ```

### lerna 的好处

- 依赖安装：`npm install && lerna bootstrap`，不用切换项目目录。

- 版本控制：`lerna` 提供了检查自上一发行版以来已更改了哪些软件包的功能。

- 同时运行命令：`npm run dev:lixin` 先打包 wepy, 再打包 taro, 最后打补丁。

### 主包体积优化

- taro 共享 wepy 的 npm 脚本

- i18N -> translate

- taro 分包: taro 的 page 用空页面占位，把所有页面都写入分包

### 资源的共享方式

- 配置 alias

```js
alias: {
  'src': path.posix.join(taroProjectRoot, '/src'),
  // 这个要引用原项目文件，因为less文件中定义了一些变量，在taro中需要使用
  '@@/style': path.posix.resolve(__dirname, '../../wepy-project/src/assets')
}
```

- 配置 externals

The 'commonjs ' + request defines the type of module that needs to be externalized: https://www.webpackjs.com/configuration/externals/

```js
const replaceRoute = (rt) => `commonjs __REPLACE__${rt}`

webpackChain (chain) {
  chain.merge({
    externals: [
      // taro 直接使用 wepy 的资源文件，__REPLACE__ 是占位符，会被替换成相对路径，借助relative-lib-path-webpack-plugin插件完成路径转化。
      (context, request, callback) => {
        if (request.startsWith('@dist')) {
          const res = replaceRoute(request.replace('@dist', ''))
          // console.log({ request, res })
          return callback(null, res)
        }
        callback()
      },
      // 第三方资源文件也直接使用 wepy 打包好的，都放在 npm 目录下。
      {
        // 将taro包中的npm脚本指向wepy已经构建好的npm包，请确保wepy构建已经将npm包放在npm目录下
        // __REPLACE__是提供给relative-lib-path-webpack-plugin插件识别的关键字
        'dayjs': replaceRoute('/npm/dayjs/dayjs.min.js'),
        '@lx-frontend/report': replaceRoute('/npm/@lx-frontend/report/lib/index.js'),
        'big.js': replaceRoute('/npm/big.js/big.js'),
        'redux': replaceRoute('/npm/redux/lib/redux.js'),
        'redux-thunk': replaceRoute('/npm/redux-thunk/lib/index.js'),
        'cnchar-trad': replaceRoute('/npm/cnchar-trad/cnchar.trad.min.js'),
        'cnchar': replaceRoute('/npm/cnchar/cnchar.min.js')
      },
      (context, request, callback) => {
        // 处理lodash，lodash代码从venders.js中剔除，改从npm直接引用
        // 依然需要借助relative-lib-path-webpack-plugin插件完成路径转化
        // 如果直接引用的lodash而不是某一个明确的lodash函数，则不处理
        const isLodash = /^lodash.+/.test(request)
        const extName = path.posix.extname(request)
        if (isLodash) {
          const fullRequestName = extName === '' ? `${request}.js` : request
          return callback(null, replaceRoute(`/npm/${fullRequestName}`))
        }

        callback()
      },
    ]
  })
}
```

### 打包及热更新

- 借助于node 的 child_process.spawn 监听输出: .standout.on()

### 灰度策略

- 后端开关

- 前端配置：

```js
export default [
  // 已经稳定运行的页面
  {
    '/pages/my/setting': '/taro/pages/my/setting/index',
    '/pages/my/personaldata': '/taro/pages/my/personaldata/index',
    '/pages/auction/cardetail': '/taro/pages/auction/cardetail/index'
  },
  // 刚重构的不稳定页面
  {
    '/pages/reviewManage/reviewList': '/taro/pages/reviewManage/reviewList/index',
    '/pages/reviewManage/reviewSubmit': '/taro/pages/reviewManage/reviewSubmit/index'
  }
]
```

### 路由跳转代理

```js
function proxyWxRouterFunction(stableMap, unStableMap, isUseNew) {
  function generateProxyFunction(wx, funName) {
    return function(options) {
      const { url } = options
      const urlWithNoParams = url.split('?')[0]
      const urlParams = url.split('?')[1]

      if (
        // 1. 如果不属于任何映射表，直接跳转
        (!stableMap[urlWithNoParams] && !unStableMap[urlWithNoParams]) ||
        // 2. 如果属于不稳定映射表，且灰度关闭，直接跳
        (unStableMap[urlWithNoParams] && !isUseNew)
      ) {
        wx[funName](options)
        return
      }

      if (
        // 3. 如果属于稳定映射表，跳新页面，忽略灰度策略开关，跳新页面
        stableMap[urlWithNoParams] ||
        // 4. 如果属于不稳定表，且灰度开启，尝试跳转新页面，失败后则跳转旧页面
        (unStableMap[urlWithNoParams] && isUseNew)
      ) {
        const newUrl = `${stableMap[urlWithNoParams] || unStableMap[urlWithNoParams]}?${urlParams}`
        const newFail = function(err) {
          // 跳转失败，则再尝试跳回wepy页面，并上报
          const extra = {
            wepyUrl: url,
            taroUrl: newUrl,
            errMsg: err
          }
          console.log('跳转失败，跳回wepy页面：', extra)
          reportBusinessException('跳转Taro页面失败，跳回Wepy页面', extra)

          wx[funName](options)
        }
        wx[funName]({ ...options, url: newUrl, fail: newFail })
      }
    }
  }

  const wxProxy = new Proxy(wx, {
    get(target, property) {
      console.log('wx property:', property)
      if (['reLaunch', 'redirectTo', 'navigateTo'].includes(property)) {
        return generateProxyFunction(target, property)
      }
      if (property === 'isProxyOpen') {
        return isUseNew
      }
      return target[property]
    }
  })

  return wxProxy
}
```

### react hooks 问题

- 问题：useState 设置 state 后，无法立即获取最新值，导致流程原来的无法保持一致。

- 解决方案：1. 传参；2. redux.

- 官方解决方案：useEvent: https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
