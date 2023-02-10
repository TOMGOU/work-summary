# 依赖相关细节

## --save与--save-dev的区别

- -S是--save的缩写，依赖会被安装到dependencies，生产环境所需依赖，例：antd, element, react

- -D是--save-dev的缩写，依赖会被安装到devDependencies，开发所需的依赖，例：xxx-cli, less-loader, babel-loader

### 举例说明

- 我们写的ES6代码，需要 babel 转换成 es5 ，转换完成后，我们只需要转换后的代码，上线的时候，直接把转换后的代码部署到生产环境，不需要 bebal 了，生产环境不需要。这就可以安装到 devDependencies ，再比如说代码提示工具，也可以安装到 devDependencies。

- 我们使用的 Element-UI，由于发布到生产后还是依赖 Element-UI，这就可以安装到 dependencies。

## `peerDependencies` 的作用

> peerDependencies 的目的是提示宿主环境去安装满足插件 peerDependencies 所指定依赖的包，然后在插件 import 或者require 所依赖的包的时候，永远都是引用宿主环境统一安装的 npm 包，最终解决插件与所依赖包不一致的问题。

- 举个例子，就拿目前基于react的ui组件库ant-design@3.x来说，因该ui组件库只是提供一套react组件库，它要求宿主环境需要安装指定的react版本。具体可以看它package.json中的配置：

```json
  "peerDependencies": {
    "react": ">=16.0.0",
    "react-dom": ">=16.0.0"
  }
```

它要求宿主环境安装react@>=16.0.0和react-dom@>=16.0.0的版本，而在每个antd组件的定义文件顶部：

```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';
```

组件中引入的 react 和 react-dom 包其实都是宿主环境提供的依赖包。

- 项目中的实际应用: 在 element-ui 的中间层 npm 包 `@lx-frontend/wrap-element-ui` 中申明

```json
  "peerDependencies": {
    "element-ui": ">=2.11.1"
  }
```

## package.json 中版本号的控制符号

> 主版本号.次版本号.修订版本号.日期版本号_希腊字母版本号

- `^` 符号: 锁定主版本号，次版本号和修订版本号下载最新版本

```json
{
  "vue": "^3.2.13"
}
```

- `~` 符号: 锁定主版本号和次版本号，修订版本号下载最新版本

```json
{
  "vue": "~3.2.13"
}
```

- `*` 符号: 直接下载这个包的最新版本

```json
{
  "vue": "*"
}
```

- `x` 符号：占位版本号的位置, 全部下载最新版本

```json
{
  "vue": "^3.2.x"
}
```

- `>`、`<`、`>=`、`<=` 符号：占位版本号的位置, 全部下载最新版本

```json
{
  "peerDependencies": {
    "packageA": ">3.0.0",
    "packageB": ">=2.6.0",
    "packageC": "<3.0.0",
    "packageD": "<=2.7.6",
    "packageE": ">=1.0.2 <2.1.2"
  }
}
```

- 希腊字母版本号共有五种，分别为：base、alpha、beta、RC、release

  * Base
  此版本表示该软件仅仅是一个假页面链接，通常包括所有的功能和页面布局，但是 页面中的功能都没有做完整的实现，只是做为整体网站的一个基础架构。

  * Alpha
  软件的初级版本，表示该软件在此阶段以实现软件功能为主，通常只在软件开发者 内部交流，一般而言，该版本软件的Bug较多，需要继续修改，是测试版本。测试 人员提交Bug经开发人员修改确认之后，发布到测试网址让测试人员测试，此时可 将软件版本标注为alpha版。

  * Beta
  该版本相对于Alpha 版已经有了很大的进步，消除了严重错误，但还需要经过多次 测试来进一步消除，此版本主要的修改对象是软件的UI。修改的的Bug 经测试人 员测试确认后可发布到外网上，此时可将软件版本标注为 beta版。

  * RC
  该版本已经相当成熟，基本上不存在导致错误的Bug，与即将发行的正式版本相差无几。

  * Release
  该版本意味“最终版本”，在前面版本的一系列测试版之后，终归会有一个正式的版本，是最终交付用户使用的一个版本。该版本有时也称标准版。


## package-lock.json 的作用

> 锁定安装时的包的版本号及包的依赖的版本号, 以保证其他所有人人在使用 ​​npm install​​ 时下载的依赖包都是一致的。

- 举例说明，现在有程序员A、程序员B两个开发者

  * 程序员A：接手项目时Vue的版本是2.6.14，此版本被锁在了package-lock.json

  * 程序员B：一个月后加入这个项目，这时Vue已经升级到2.9.14，npm install的时候，按理说会自动升级，但是由于package-lock.json中锁着2.6.14这个版本，所以阻止了自动升级，保证版本还是2.6.14

