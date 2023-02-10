# webpack 基础配置项

## 常用配置项

```js
module.exports = {
    // __dirname值为所在文件的目录，context默认为执行webpack命令所在的目录
    context: path.resolve(__dirname, 'app'),
    // 必填项，编译入口，webpack启动会从配置文件开始解析,如下三种(还有一种动态加载entry的方式就是给entry传入一个函数，这个在项目比较大，页面很多的情况下可以优化编译时间)
    entry: './app/entry', // 只有一个入口，入口只有一个文件
    entry: ['./app/entry1', './app/entry2'], // 只有一个入口，入口有两个文件
       // 两个入口
    entry: {
        entry1: './app/entry1',
        entry2: './app/entry2'
    },
    // 输出文件配置
    output: {
        // 输出文件存放的目录，必须是string类型的绝对路径
        path: path.resolve(__dirname, 'dist'),
        // 输出文件的名称
        filename: 'bundle.js',
        filename: '[name].js', // 配置了多个入口entry是[name]的值会被入口的key值替换，此处输出文件会输出的文件名为entry1.js和entry2.js
        filename: [chunkhash].js, // 根据chunk的内容的Hash值生成文件的名称，其他只还有id，hash，hash和chunkhash后面可以使用:number来取值，默认为20位，比如[name]@[chunkhash:12].js,
        // 文件发布到线上的资源的URL前缀，一般用于描述js和css位置，举个例子，打包项目时会导出一些html,那么html里边注入的script和link的地址就是通过这里配置的
        publicPath: "https://cdn.example.com/assets/", // CDN（总是 HTTPS 协议）
        publicPath: "//cdn.example.com/assets/", // CDN (协议相同)
        publicPath: "/assets/", // 相对于服务(server-relative)
        publicPath: "assets/", // 相对于 HTML 页面
        publicPath: "../assets/", // 相对于 HTML 页面
        publicPath: "", // 相对于 HTML 页面（目录相同）
        // 当需要构建的项目可以被其他模块导入使用，会用到libraryTarget和library
        library: 'xxx', // 配置导出库的名称，但是和libraryTarget有关，如果是commonjs2默认导出这个名字就没啥用
        // 从webpack3.1.0开始，可以为每个target起不同的名称
        library: {
            root: "MyLibrary",
            amd: "my-library",
            commonjs: "my-common-library"
        },
        libraryTarget: 'umd', // 导出库的类型，枚举值: umd、commonjs2、commonjs，amd、this、var(默认)、assign、window、global、jsonp(区别查看补充2)
        // 需要单独导出的子模块，这样可以直接在引用的时候使用子模块，默认的时候是_entry_return_
        libraryExport: 'default', // __entry_return_.default
        libraryExport: 'MyModule', // __entry_return_.MyModule
        libraryExport: ['MyModule', 'MySubModule '], // 使用数组代表到指定模块的取值路径 __entry_return_.MyModule.MySubModule
        // 配置无入口的chunk在输出时的文件名称，但仅用于在运行过程中生成的Chunk在输出时的文件名称，这个应该一般和插件的导出有关，支持和filename一样的内置变量
        chunkFilename: '[id].js',
        // 是否包含文件依赖相关的注释信息，不懂？请看补充3，在mode为development的是默认为true
        pathinfo: true,
        // JSONP异步加载chunk，或者拼接多个初始chunk(CommonsChunkPlugin,AggressiveSplittingPlugin)
        jsonpFunction: 'myWebpackJsonp',
        // 此选项会向应盘写入一个输出文件，只在devtool启动了sourceMap选项时采用，默认为`[file].map`,除了和filename一样外还可以使用[file]
        sourceMapFilename: '[file].map',
        // 浏览器开发者工具里显示的源码模块名称，此选项仅在 「devtool 使用了需要模块名称的选项」时使用，使用source-map调试，关联模块鼠标移动到上面的时候显示的地址(截不到图啊，醉了)，默认这个值是有的，一般不需要关心
        devtoolModuleFilenameTemplate: 'testtest://[resource-path]'
    },
    // 配置模块相关
    module: {
        rules: [ // 配置loaders
            {
                test: /\.jsx?$/, // 匹配规则，匹配文件使用，一般使用正则表达值
                include: [path.resolve(__dirname, 'app')], // 只会命中这个目录文件
                exclude: [path.resolve(__diranme, 'app/demo-files')], // 命中的时候排除的目录
                use: [ // 使用的loader，每一项为一个loader，从该数组的最后一个往前执行
                    'style-loader', // loader的名称,这样则是使用默认配置，可以在后面加!配置属性，也可以用下面方式
                    {
                        loader: 'css-loader', // loader的名称
                        options: {} // loader接受的参数
                    }
                ],
                noParse: [ // 不用解析和处理的模块 RegExp | [RegExp] | function（从 webpack 3.0.0 开始）
                    /jquery|lodash/
                ]
            }
        ]
    },
    // 配置插件，关于和loader区别见补充4
    plugins: [
      // 压缩js的plugin
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: false,
        }
      }),
    ],
    // 解析文件引用的模块的配置
    resolve: {
        // 模块的根目录,默认从node_modules开始找
        modules: [
            'node_modules',
            'browser_modules'
        ],
        // 模块的后缀名，我们引入模块有时候不写扩展名，自动补充扩展名的顺序如下
        extensions: ['.js', '.json', '.jsx', '.css'],
        // 模块解析时候的别名
        alias: {
            // 那么导入模块时则可以写import myComponent from '$component/myComponent';
            $component: './src/component',
            // 末尾加$精确匹配
            xyz$: path.resolve(__dirname, 'path/to/file.js')
        },
        // 此选项决定优先使用package.json配置哪份导出文件，详见补充5
        mainFields: ['jsnext:main', 'browser', 'main'],
        // 是否强制导入语句写明后缀
        enforceExtension: false,
        // 是否将符号链接(symlink)解析到它们的符号链接位置(symlink location)
        symlinks: true,
    },
    // 选择一种 source map 格式来增强调试过程。不同的值会明显影响到构建(build)和重新构建(rebuild)的速度。
    devtool: 'source-map',
    // 配置输出代码的运行环境，可以为async-node，electron-main，electron-renderer，node，node-webkit，web(默认)，webworker
    target: 'web',
    externals: { // 使用来自于js运行环境提供的全局变量
        jquery: 'jQuery'
    },
    // 控制台输出日志控制
    stats: {
        assets: true, // 添加资源信息
        colors: true, // 控制台日志信息是否有颜色
        errors: true, // 添加错误信息
        errorDetails: true, // 添加错误的详细信息（就像解析日志一样）
        hash: true, // 添加 compilation 的哈希值
    },
    devServer: { // 本地开发服务相关配置
        proxy: { // 代理到后端服务接口
            '/api': 'http://localhost:3000'
        },
        contentBase: path.join(__dirname, 'public'), // 配置devserver http服务器文件的根目录
        compress: true, // 是否开启gzip压缩
        hot: true, // 是否开启模块热交换功能
        https: false, // 是否开启https模式
        historyApiFallback: true, // 是否开发HTML5 History API网页，不太理解TODO
    },
    profile: true, // 是否捕捉webpack构建的性能信息，用于分析是什么原因导致的构建性能不佳
    cache: false, // 缓存生成的 webpack 模块和 chunk，来改善构建速度。缓存默认在观察模式(watch mode)启用。
    cache: {
        // 如果传递一个对象，webpack 将使用这个对象进行缓存。保持对此对象的引用，将可以在 compiler 调用之间共享同一缓存：
        cache: SharedCache  // let SharedCache = {}
    },
    watch: true, // 是否启用监听模式
    watchOptions: { // 监听模式选项
        ignored: /node_modules/, // 不监听的文件或文件夹，支持正则匹配，默认为空
        aggregateTimeout: 300, 监听到变化后，300ms再执行动作，节流，防止文件更新频率太快导致重新编译频率太快
        poll: 1000 // 检测文件是否变化，间隔时间
    },
    // 输出文件的性能检查配置
    perfomance: {
        hints: 'warning', // 有性能问题时输出警告
        hints: 'error', // 有性能问题时输出错误
        hints: false, // 关闭性能检查
        maxAssetSize: 200000, // 最大文件大小，单位bytes
        maxEntrypointSize: 400000, // 最大入口文件的大小，单位bytes
        // 此属性允许 webpack 控制用于计算性能提示的文件。
        assetFilter: function(assetFilename) {
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    }
}
```

## loader

> A loader is a node module exporting a function

- 其中 source 参数是这个 loader 要处理的源文件的字符串

- 返回经过"翻译"后的 webpack 能够处理的有效模块

```js
module.exports = function (source) {
    // todo
    return newSource
}

module: {
    rules: [
        {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader']
        }
    ]
}
```

- file-loader 与 url-loader 的区别：

  * file-loader 将文件上的 import / require（）解析为 url，并将该文件发射到输出目录中。

  ```js
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      'file-loader'
    ],
  },
  ```

  * url-loader 可以识别图片的大小，然后把图片转换成base64，从而减少代码的体积，如果图片超过设定的现在，就还是用 file-loader来处理。如果不在乎体积，不想转换成base64，可以不要配这个loader。这里提一句，不要把字体也用url-loader 来处理，把字体文件转成base64是浏览器无法识别的，这是错误的操作。

  ```js
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      'url-loader?limit=1000&name=image/[hash:8].[name].[ext]'
    ],
  },

  {
    test: /\.(png|jpe?g|gif|bmp)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 4096000,
          fallback: {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]'
            }
          }
        }
      },
    ]
  }
  ```

## 常用 plugin

## vue.config.js

```js
const webpack = require('webpack');
const path = require('path');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const pkg = require('./package.json');
pkg.version += process.env.VERSION_AUTHOR;
const isProduction = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const isQatest = process.env.RUN_ENV === 'testing';
const baseUrl = 'https://g.lxstatic.com/dos/merchant/';
const cdnCommon = 'https://g.lxstatic.com/common/';

module.exports = {
  devServer: {
    port: 8000,
    disableHostCheck: true,
    https: true,
  },
  outputDir: 'www',
  runtimeCompiler: true,
  publicPath: (isProduction && !isQatest) ? baseUrl : '/',
  configureWebpack: {
    module: {
      rules: [
        {
          // test是固定写法，不可修改
          test: /placeholder_module_config[\\/](basic|async)\.js$/,
          use: [
            {
              loader: '@lx-frontend/modularize-loader',
              options: {
                // 模块文件夹路径，必须是绝对路径。
                moduleDir: path.resolve(__dirname, './src/modules'),
                // 基础模块名称列表，即在模块目录之下，模块文件夹的名称。
                basicModules: ['login', 'account', 'store'],
                only: [],
                // excludes: [],
                showWarning: true,
              },
            },
          ],
        },
      ],
    },
  },
  // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: (config) => {
    config.plugin('define')
      .use(webpack.DefinePlugin, [{
        'process.env.SENTRY_TEST': JSON.stringify(false), // 控制sentry测试
        'process.env.PROJECT_VERSION': JSON.stringify(pkg.version),
        'process.env.CDN_COMMON': JSON.stringify(cdnCommon),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.RUN_ENV': JSON.stringify(process.env.RUN_ENV), // 将要在gitlab上部署的环境
      }]);

    process.env.ANALYZE === 'TRUE' && config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);

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

      config.plugin('hashed')
        .use(webpack.HashedModuleIdsPlugin);

      config.plugin('inlineManifest')
        .use(InlineManifestWebpackPlugin);

      // 如果是正式环境，添加sentry-plugin
      if (isQatest || !process.env.VERSION_AUTHOR) {
        return;
      }
    }
  },
};
```

## webpack 构建流程

> Webpack 的运行流程是一个串行的过程,从启动到结束会依次执行以下流程 :

  - 初始化参数：从配置文件和 Shell 语句中读取与合并参数,得出最终的参数。
  - 开始编译：用上一步得到的参数初始化 Compiler 对象,加载所有配置的插件,执行对象的 run 方法开始执行编译。
  - 确定入口：根据配置中的 entry 找出所有的入口文件。
  - 编译模块：从入口文件出发,调用所有配置的 Loader 对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
  - 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
  - 输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。
  - 输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。