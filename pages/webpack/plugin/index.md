# webpack-plugin

> https://blog.csdn.net/leelxp/article/details/107209190

## plugin 模板

##### Gzip 压缩插件

```js
module.exports = class GzipPlugin {
  constructor(options){
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.emit.tap('zlibPlugin', compilation => {
      const assets = compilation.getAssets();
      for (const file of assets) {
        if (/\.js$/.test(file.name)) {
          const gzipFile = zlib.gzipSync(file.source.children[0]._value, {
            level: this.option.level || 7
          });

          compilation.assets[file.name + '.gz'] = {
            source: function () {
              return gzipFile;
            },
            size: function () {
              return gzipFile.length
            }
          }
        }
      }
    })
  }
};
```

##### 简体字转繁体字插件

```js
const cnchar = require('cnchar')
const trad = require('cnchar-trad')
cnchar.use(trad)

module.exports = class SimpleToTrad {
  // 插件配置的参数
  constructor(option = {}) {
    this.option = option
  }

  // 固定的
  apply(compiler) {
    compiler.hooks.emit.tap('simpleToTrad', compilation => {
      const assets = compilation.getAssets();
      console.log({assets})
      for (const file of assets) {
        if (/\.js$/.test(file.name)) {
          const { source } = compilation.getAsset(file.name)

          const newFile = cnchar.convert.simpleToTrad(source.source())

          compilation.assets[file.name] = {
            source: function () {
              return newFile
            },
            size: function () {
              return newFile.length
            }
          }
        }
      }
    })
  }
}
```

##### 路劲替换为相对路径

```js
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const generate = require("@babel/generator").default
const { RawSource } = require("webpack-sources")
const nodePath = require('path')

class RelativeLibPathWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'RelativeLibPathWebpackPlugin',
      (compilation, callback) => {
        // 这些文件不用修改了
        const excludes = ['runtime.js', 'taro.js', 'custom-wrapper.js', 'comp.js']
        // 获取所有的js文件
        const jsChunks = compilation.getAssets()
          .filter(item => /.js$/.test(item.name))
          .filter(item => !excludes.includes(item.name))
        jsChunks.forEach(chunk => {
          console.log('updating ', chunk.name)
          const ast = parser.parse(compilation.assets[chunk.name].source())
          // 计算npm文件夹的相对路径
          // 在最终的dist目录中，chunk.name是以taro为根目录，npm与taro同级
          const relativePath = chunk.name.split('/').map(() => '..').join('/')
          traverse(ast, {
            CallExpression(path) {
              const calleePath = path.get('callee')
              if (calleePath.node.name === 'require') {
                const argName = path.get('arguments.0').node.value
                if (/^__REPLACE__(.+)/.test(argName)) {
                  const newPath = nodePath.join(relativePath, argName.replace('__REPLACE__', ''))
                  console.log('find __REPLACE__', { argName, newPath })
                  path.get('arguments.0').node.value = newPath
                }
              }
            },
          })

          const { code: jsCode } = generate(ast, { sourceMaps: false })

          compilation.updateAsset(chunk.name, new RawSource(jsCode))
        })

        callback()
      }
    );
  }
}

module.exports = RelativeLibPathWebpackPlugin
```

## compiler.hooks

> compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

源码路径: /node_modules/webpack/lib/Compiler.js

```js
const {
	Tapable,
	SyncHook,
	SyncBailHook,
	AsyncParallelHook,
	AsyncSeriesHook
} = require("tapable");

class Compiler extends Tapable {
  constructor() {
    this.hooks = {
      /** 在输出 asset 之前调用。返回一个布尔值，告知是否输出。 */
      shouldEmit: new SyncBailHook(["compilation"]),
      /** 在 compilation 完成时执行。 */
      done: new AsyncSeriesHook(["stats"]),
      /** 这个钩子允许你多做一次构建。 */
      additionalPass: new AsyncSeriesHook([]),
      /** 在开始执行一次构建之前调用，compiler.run 方法开始执行后立刻进行调用。 */
      beforeRun: new AsyncSeriesHook(["compiler"]),
      /** 在开始读取 records 之前调用。 */
      run: new AsyncSeriesHook(["compiler"]),
      /** 生成资源到 output 目录之前。输出 asset 到 output 目录之前执行。 */
      emit: new AsyncSeriesHook(["compilation"]),
      /** 在 asset 被输出时执行。此钩子可以访问被输出的 asset 的相关信息，例如它的输出路径和字节内容。 */
      assetEmitted: new AsyncSeriesHook(["file", "content"]),
      /** 输出 asset 到 output 目录之后执行。 */
      afterEmit: new AsyncSeriesHook(["compilation"]),

      /** 初始化 compilation 时调用，在触发 compilation 事件之前调用。 */
      thisCompilation: new SyncHook(["compilation", "params"]),
      /** compilation 创建之后执行。 */
      compilation: new SyncHook(["compilation", "params"]),
      /** NormalModuleFactory 创建之后调用。 */
      normalModuleFactory: new SyncHook(["normalModuleFactory"]),
      /** ContextModuleFactory 创建之后调用。  */
      contextModuleFactory: new SyncHook(["contextModulefactory"]),

      /** 在创建 compilation parameter 之后执行。 */
      beforeCompile: new AsyncSeriesHook(["params"]),
      /** beforeCompile 之后立即调用，但在一个新的 compilation 创建之前。 */
      compile: new SyncHook(["params"]),
      /** compilation 结束之前执行。 */
      make: new AsyncParallelHook(["compilation"]),
      /** compilation 结束和封印之后执行。 */
      afterCompile: new AsyncSeriesHook(["compilation"]),

      /** 在监听模式下，一个新的 compilation 触发之后，但在 compilation 实际开始之前执行。 */
      watchRun: new AsyncSeriesHook(["compiler"]),
      /** 在 compilation 失败时调用。 */
      failed: new SyncHook(["error"]),
      /** 在一个观察中的 compilation 无效时执行。 */
      invalid: new SyncHook(["filename", "changeTime"]),
      /** 在一个观察中的 compilation 停止时执行。 */
      watchClose: new SyncHook([]),

      /** 在配置中启用 infrastructureLogging 选项后，允许使用 infrastructure log(基础日志)。 */
      infrastructureLog: new SyncBailHook(["origin", "type", "args"]),

      /** 在编译器准备环境时调用，时机就在配置文件中初始化插件之后 */
      environment: new SyncHook([]),
      /** 当编译器环境设置完成后，在 environment hook 后直接调用。 */
      afterEnvironment: new SyncHook([]),
      /** 在初始化内部插件集合完成设置之后调用。 */
      afterPlugins: new SyncHook(["compiler"]),
      /** resolver 设置完成之后触发。 */
      afterResolvers: new SyncHook(["compiler"]),
      /** 在 webpack 选项中的 entry 配置项 处理过之后，执行插件。 */
      entryOption: new SyncBailHook(["context", "entry"])
    };
  }
}
```

- tapable 示例

```js
const { SyncHook, AsyncSeriesHook } = require('tapable');
const hook1 = new SyncHook(['name']);
hook1.tap('hello', (name) => {
    console.log(`hello ${name}`);
});
hook1.tap('hello again', (name) => {
    console.log(`hello ${name}, again`);
});

hook1.call('tommy');

const hook = new AsyncSeriesHook(['name']);

console.time('cost');

hook.tapAsync('hello', (name, cb) => {
  setTimeout(() => {
    console.log(`hello ${name}`);
    cb();
  }, 2000);
});
hook.tapPromise('hello again', (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`hello ${name}, again`);
      resolve();
    }, 2000);
  });
});

hook.callAsync('tommy', () => {
  console.log('done');
  console.timeEnd('cost');
});
```

### webpack的打包总体来说其实是分为三个阶段：初始化阶段、编译阶段、输出文件阶段

##### 初始化阶段：

- 初始化参数: 从配置文件和 Shell 语句中读取与合并参数，得出最终的参数。这个过程中还会执行配置文件中的插件实例化语句 new Plugin()。

- 初始化默认参数配置: new WebpackOptionsDefaulter().process(options)

- 实例化Compiler对象:用上一步得到的参数初始化Compiler实例，Compiler负责文件监听和启动编译。Compiler实例中包含了完整的Webpack配置，全局只有一个Compiler实例。

- 加载插件: 依次调用插件的apply方法，让插件可以监听后续的所有事件节点。同时给插件传入compiler实例的引用，以方便插件通过compiler调用Webpack提供的API。

- 处理入口: 读取配置的Entrys，为每个Entry实例化一个对应的EntryPlugin，为后面该Entry的递归解析工作做准备。

##### 编译阶段：

- run阶段：启动一次新的编译。this.hooks.run.callAsync。

- compile: 该事件是为了告诉插件一次新的编译将要启动，同时会给插件带上compiler对象。

- compilation: 当Webpack以开发模式运行时，每当检测到文件变化，一次新的Compilation将被创建。一个Compilation对象包含了当前的模块资源、编译生成资源、变化的文件等。Compilation对象也提供了很多事件回调供插件做扩展。

- make:一个新的 Compilation 创建完毕主开始编译  完毕主开始编译this.hooks.make.callAsync。

- addEntry: 即将从 Entry 开始读取文件。

- _addModuleChain: 根据依赖查找对应的工厂函数，并调用工厂函数的create来生成一个空的MultModule对象，并且把MultModule对象存入compilation的modules中后执行MultModule.build。

- buildModules: 使用对应的Loader去转换一个模块。开始编译模块,this.buildModule(module)  buildModule(module, optional, origin,dependencies, thisCallback)。

- build: 开始真正编译模块。

- doBuild: 开始真正编译入口模块。

- normal-module-loader: 在用Loader对一个模块转换完后，使用acorn解析转换后的内容，输出对应的抽象语法树（AST），以方便Webpack后面对代码的分析。

- program: 从配置的入口模块开始，分析其AST，当遇到require等导入其它模块语句时，便将其加入到依赖的模块列表，同时对新找出的依赖模块递归分析，最终搞清所有模块的依赖关系。

##### 文件输出阶段：

- seal: 封装 compilation.seal seal(callback)。

- addChunk: 生成资源 addChunk(name)。

- createChunkAssets: 创建资源 this.createChunkAssets()。

- getRenderManifest: 获得要渲染的描述文件 getRenderManifest(options)。

- render: 渲染源码 source = fileManifest.render()。

- afterCompile: 编译结束   this.hooks.afterCompile。

- shouldEmit: 所有需要输出的文件已经生成好，询问插件哪些文件需要输出，哪些不需要。this.hooks.shouldEmit。

- emit: 确定好要输出哪些文件后，执行文件输出，可以在这里获取和修改输出内容。

- done: 全部完成     this.hooks.done.callAsync。

## compiler.hooks 钩子函数可以同步也可以异步的方式处理 [来自于 tapable]

```js
// .tap 以同步方式触发钩子
// .tapAsync 以异步方式触发钩子
// .tapPromise 以异步方式触发钩子，返回 promise

module.exports = class SyncPlugin {
    apply(compiler){
        // tap 同步
        compiler.hooks.emit.tap("tap", (compilation) => {
          console.log("***** tap *****")
        })
        // tapAsync 参数cb未调用之前进程会暂停
        compiler.hooks.emit.tapAsync("tapAsync", (compilation,cb) => {
          start(0);
          function start(index){
              console.log(index);
              if(index<=3){
                  setTimeout(() => {
                      start(++index);
                  }, 1000);
              }else{
                  cb()
              }
          }
        })
        // tapPromise 通过promise的方式调用
        compiler.hooks.emit.tapPromise("tapPromise", (compilation)=>{
            return new Promise((resolve,reject)=>{
                console.log("start tap-promise");
                setTimeout(()=>{
                    resolve()
                },2000)
            })
        })
    }
}
```

## compilation

> compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用

源码路径: /node_modules/webpack/lib/compilation.js

```js
class Compilation extends Tapable {
  constructor(compiler) {
    this.hooks = {
			/** 在模块构建开始之前触发，可以用来修改模块。 */
			buildModule: new SyncHook(["module"]),
			/** 在重新构建一个模块之前触发。 */
			rebuildModule: new SyncHook(["module"]),
			/** 模块构建失败时执行。 */
			failedModule: new SyncHook(["module", "error"]),
			/** 模块构建成功时执行。 */
			succeedModule: new SyncHook(["module"]),

			/** 所有模块都完成构建并且没有错误时执行。 */
			finishModules: new AsyncSeriesHook(["modules"]),
			/** 一个模块完成重新构建时执行，在都成功或有错误的情况下。 */
			finishRebuildingModule: new SyncHook(["module"]),
			/** compilation 对象开始接收新模块时触发。 */
			unseal: new SyncHook([]),
			/** compilation 对象停止接收新的模块时触发 */
			seal: new SyncHook([]),

			/** 依赖优化开始时触发。 */
			optimizeDependencies: new SyncBailHook(["modules"]),
			/** 依赖优化之后触发。 */
			afterOptimizeDependencies: new SyncHook(["modules"]),

			/** 优化阶段开始时触发。 */
			optimize: new SyncHook([]),
			/** 在模块优化阶段开始时调用。插件可以 tap 此钩子对模块进行优化。 */
			optimizeModules: new SyncBailHook(["modules"]),
			/** 在模块优化完成之后调用。 */
			afterOptimizeModules: new SyncHook(["modules"]),

			/** 在 chunk 优化阶段开始时调用。插件可以 tap 此钩子对 chunk 执行优化。 */
			optimizeChunks: new SyncBailHook(["chunks", "chunkGroups"]),
			/** chunk 优化完成之后触发。 */
			afterOptimizeChunks: new SyncHook(["chunks", "chunkGroups"]),

			/** 在优化依赖树之前调用。插件可以 tap 此钩子执行依赖树优化。 */
			optimizeTree: new AsyncSeriesHook(["chunks", "modules"]),
			/** 在依赖树优化成功完成之后调用。 */
			afterOptimizeTree: new SyncHook(["chunks", "modules"]),

			/** 在树优化之后，chunk 模块优化开始时调用。插件可以 tap 此钩子来执行 chunk 模块的优化。 */
			optimizeChunkModules: new SyncBailHook(["chunks", "modules"]),

			/** 在 chunk 模块优化成功完成之后调用。 */
			afterOptimizeChunkModules: new SyncHook(["chunks", "modules"]),
			/** 调用来决定是否存储 record。返回任何内容 !== false 将阻止执行所有其他 "record" 钩子 */
			shouldRecord: new SyncBailHook([]),

			/** 从 record 中恢复模块信息 */
			reviveModules: new SyncHook(["modules", "records"]),
			/** 在为每个模块分配 id 之前执行。 */
			beforeModuleIds: new SyncHook(["modules"]),
			/** 调用来每个模块分配一个 id。 */
			moduleIds: new SyncHook(["modules"]),
			/** 在模块 id 优化开始时调用。 */
			optimizeModuleIds: new SyncHook(["modules"]),
			/** 在模块 id 优化完成时调用。 */
			afterOptimizeModuleIds: new SyncHook(["modules"]),

			/** 从 record 中恢复 chunk 信息。 */
			reviveChunks: new SyncHook(["chunks", "records"]),
			/** 在为每个 chunk 分配 id 之前执行。 */
			beforeChunkIds: new SyncHook(["chunks"]),
			/** 在 chunk id 优化阶段开始时调用。 */
			optimizeChunkIds: new SyncHook(["chunks"]),
			/** chunk id 优化结束之后触发。 */
			afterOptimizeChunkIds: new SyncHook(["chunks"]),

			/** 将模块信息存储到 record 中。shouldRecord 返回 truthy 值时触发。 */
			recordModules: new SyncHook(["modules", "records"]),
			/** 将 chunk 存储到 record 中。shouldRecord 返回 truthy 值时触发。 */
			recordChunks: new SyncHook(["chunks", "records"]),

			/** 在 compilation 添加哈希（hash）之前。 */
			beforeHash: new SyncHook([]),
			/** 在 compilation 添加哈希（hash）之后。 */
			afterHash: new SyncHook([]),
			/** 将有关 record 的信息存储到 records 中。仅在 shouldRecord 返回 truthy 值时触发。 */
			recordHash: new SyncHook(["records"]),
			/** 将 compilation 相关信息存储到 record 中。仅在 shouldRecord 返回 truthy 值时触发 */
			record: new SyncHook(["compilation", "records"]),

			/** 在创建模块 asset 之前执行。 */
			beforeModuleAssets: new SyncHook([]),
			/** 调用以确定是否生成 chunk asset。返回任何 !== false 将允许生成 chunk asset。 */
			shouldGenerateChunkAssets: new SyncBailHook([]),
			/** 在创建 chunk asset 之前。 */
			beforeChunkAssets: new SyncHook([]),

			/** 为 compilation 创建额外 asset。 这个钩子可以用来下载图像。 */
			additionalAssets: new AsyncSeriesHook([]),
			/** 已弃用，可使用 Compilation.hook.processAssets 来代替。 */
			optimizeChunkAssets: new AsyncSeriesHook(["chunks"]),
			/** 已弃用，可使用 Compilation.hook.processAssets 来代替。 */
			afterOptimizeChunkAssets: new SyncHook(["chunks"]),
			/** 优化存储在 compilation.assets 中的所有 asset。 */
			optimizeAssets: new AsyncSeriesHook(["assets"]),
			/** asset 已经优化。 */
			afterOptimizeAssets: new SyncHook(["assets"]),

			/** 调用来决定 compilation 是否需要解除 seal 以引入其他文件。 */
			needAdditionalSeal: new SyncBailHook([]),
			/** 在 needAdditionalSeal 之后立即执行。 */
			afterSeal: new AsyncSeriesHook([]),

			/** 触发来为每个 chunk 生成 hash。 */
			chunkHash: new SyncHook(["chunk", "chunkHash"]),
			/** 一个模块中的一个 asset 被添加到 compilation 时调用。 */
			moduleAsset: new SyncHook(["module", "filename"]),
			/** 一个 chunk 中的一个 asset 被添加到 compilation 时调用。 */
			chunkAsset: new SyncHook(["chunk", "filename"]),

			/** 调用以决定 asset 的路径。 */
			assetPath: new SyncWaterfallHook(["filename", "data"]), // TODO MainTemplate

			/** 调用以决定 asset 在输出后是否需要进一步处理。 */
			needAdditionalPass: new SyncBailHook([]),

			/** 子 compiler 设置之后执行。 */
			childCompiler: new SyncHook([
				"childCompiler",
				"compilerName",
				"compilerIndex"
			]),

			/** 从 webpack v5 开始，normalModuleLoader 钩子已经删除。现在要访问 loader 请改用 NormalModule.getCompilationHooks(compilation).loader。 */
			normalModuleLoader: new SyncHook(["loaderContext", "module"])
		};

    this.compiler = compiler
  }
}
```
