# webpack 优化必杀技

## 动态链接库

```js
var path = require('path');
let webpack = require("webpack");

module.exports = {
  mode: 'development',
  entry: {
    react: ['react', 'react-dom']
  },
  output:{
    filename: '_dll_[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: '_dll_[name]',
    //  "var" | "assign" | "this" | "window" | "self" | "global" | "commonjs" | "commonjs2" | "commonjs-module" | "amd" | "amd-require" | "umd" | "umd2" | "jsonp" | "system"
    // libraryTarget: 'commonjs2'//默认 var
  },
  plugins: [
    new webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'dist', 'manifest.json')
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ]
};

```

## 抽离公共代码块

```js
chainWebpack: (config) => {
  // 当处于开发环境时，删除prefetch特性：prefetch会使macbook中的clarles无法正常工作。
  if (isDev) {
    config.plugins.delete('prefetch');
  }

  if (isProduction) {
    config.optimization
      .runtimeChunk({
        name: 'runtime',
      })
      .splitChunks({
        cacheGroups: {
        // TODO: app.js中包含很多库文件，可将这些文件抽离出来，利于缓存
          vue: {
            test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
            priority: -8,
            name: 'vue',
            chunks: 'all',
          },
          ele: {
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            priority: -9,
            name: 'ele',
            chunks: 'all',
          },
          echarts: {
            test: /[\\/]node_modules[\\/](vue-echarts|zrender|echarts)[\\/]/,
            priority: -10,
            name: 'echarts',
            chunks: 'all',
          },
          citydata: {
            test: /[\\/]node_modules[\\/]city-data[\\/]/,
            priority: -11,
            name: 'citydata',
            chunks: 'all',
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      });
  }
}
```
