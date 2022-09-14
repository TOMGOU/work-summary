# webpack 5 新特性

## 1.构建速度优化

> `webpack5`，可以通过 `cache` 特性来将 `webpack` 工作缓存到硬盘中。存放的路径为 `node_modules/.cache/webpack`

```js
// webpack.config.js
module.exports = { 
  cache: {
    // 1. 将缓存类型设置为文件系统
    type: 'filesystem', // 默认是memory
    // 2. 将缓存文件夹命名为 .temp_cache,
    // 默认路径是 node_modules/.cache/webpack
    cacheDirectory: path.resolve(__dirname, '.temp_cache')
  }
}
```

## 2.包代码体积的优化

- 1.代码分割 `splitchunk`

> 为了让我们的打出来的包体积更加小，颗粒度更加明确。我们经常会用到 `webpack` 的代码分割 `splitChunks` 以及 `tree shaking`。在 `webpack5` 中，这两者也得到了优化与加强

```js
splitChunks: {
  chunks: 'all',
  minSize: {
     javascript: 30000,
     style: 50000,
   }
},
// 默认配置
module.exports = {
  //...
  // https://github.com/webpack/changelog-v5#changes-to-the-configuration
  // https://webpack.js.org/plugins/split-chunks-plugin/
  optimization: {
    splitChunks: {
      chunks: 'async',  // 只对异步加载的模块进行处理
      minSize: {
        javascript: 30000, // 模块要大于30kb才会进行提取
        style: 50000, // 模块要大于50kb才会进行提取
      },
      minRemainingSize: 0, // 代码分割后，文件size必须大于该值    （v5 新增）
      maxSize: 0,
      minChunks: 1,  // 被提取的模块必须被引用1次
      maxAsyncRequests: 6, // 异步加载代码时同时进行的最大请求数不得超过6个
      maxInitialRequests: 4, // 入口文件加载时最大同时请求数不得超过4个
      automaticNameDelimiter: '~', // 模块文件名称前缀
      cacheGroups: {
     // 分组，可继承或覆盖外层配置
        // 将来自node_modules的模块提取到一个公共文件中 （又v4的vendors改名而来）
        defaultVendors: {                                                                      
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
       // 其他不是node_modules中的模块，如果有被引用不少于2次，那么也提取出来
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

- 2.Tree Shaking

> `Webpack` 不能百分百安全地进行 `tree-shaking`，`webpack4` 有些场景是不能将无用代码剔除的。有些模块导入，只要被引入，就会对应用程序产生重要的影响。一个很好的例子就是全局样式表，或者设置全局配置的 `JavaScript` 文件。值得注意的是这些副作用 `webpack5` 默认会进行 `tree-shaking`。

- 3.剔除 `npm` 包里面针对 `Node.js` 模块自动引用的 `Polyfills`

> v4 编译引入 `npm` 包，有些 `npm` 包里面包含针对 `nodejs` 的 `polyfills`，实际前端浏览器是不需要的

```js
// index.js
import CryptoJS from 'crypto-js';
const md5Password = CryptoJS.MD5('123123');
console.log(md5Password);

```

> v5 编译中，会出现 `polyfill` 添加提示，如果不需要 `node polyfille` , 按照提示 `alias` 设置为 `false` 即可

```js
// webpack.config.js
  resolve: {
    // 1.不需要node polyfilss
    alias: {
      crypto: false
    },
    // 2.手动添加polyfills
    // fallback: {
    //   "crypto": require.resolve('crypto-browserify')
    // }
  }

```

## 3.持久化缓存的优化

> webpack5 在 production 模式下 `optimization.chunkIds` 和 `optimization.moduleIds` 默认会设为 `deterministic`，`webpack` 会采用新的算法来计算确定性的 `chunkID` 和 `moduleId`。

## 4.模板联邦

```js
// app_two的webpack 配置
export default {
  plugins: [
    new ModuleFederationPlugin({
      name: "app_two",
      library: { type: "var", name: "app_two" },
      filename: "remoteEntry.js",
      exposes: {
        Search: "./src/Search"
      },
      shared: ["react", "react-dom"]
    })
  ]
};
```
