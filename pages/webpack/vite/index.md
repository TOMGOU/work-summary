# vite

## vite 简介

> `Vite`，一个基于浏览器原生 `ES imports` 的开发服务器。利用浏览器去解析 `imports`，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。同时不仅有 `Vue` 文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。针对生产环境则可以把同一份代码用 `Rollup` 打包。虽然现在还比较粗糙，但这个方向我觉得是有潜力的，做得好可以彻底解决改一行代码等半天热更新的问题。

> `Vite` 这个单词是一个法语单词，意思就是轻快的意思。它和我们以前使用 `Vue-cli` 的作用基本相同，都是项目初始化构建工具，相当于 `Vue` 项目构建的第二代产品，当然它也包含了项目的编译功能。需要注意一下 `Vite` 的生产环境下打包是通过 `Rollup` 来完成的，也就是说 `Vite` 提供的是开发环境中的编译，打包工作是依靠的 `Rollup`。

## vite 特性

- `Vite` 主打特点就是轻快冷服务启动。冷服务的意思是，在开发预览中，它是不进行打包的。

- 开发中可以实现热更新，也就是说在你开发的时候，只要一保存，结果就会更新。

- 按需进行更新编译，不会刷新全部 `DOM` 节点。这功能会加快我们的开发流程度。

## 基本使用

- step-1: node 版本切换到 `>=14.18.0`

- step-2: 创建项目

```js
npm init vite@latest my-project

or

yarn create vite my-project
```

## vite 原理

- 当浏览器解析 `import HelloWorld from './components/HelloWorld.vue'` 时，会向当前域名发送一个请求获取对应的资源（ESM支持解析相对路径）。

- `Vite` 的基本实现原理，就是启动一个 `koa` 服务器拦截由浏览器请求 `ESM` 的请求。通过请求的路径找到目录下对应的文件做一定的处理最终以 `ESM` 的格式返回给客户端。

- `es-module-lexer` 是一个可以对 `ES Module` 语句进行词法分析的工具包。其底层通过内联 `WebAssembly` 的方式来实现对 ES Module 语句的`快速词法分析`。

- 客户端注入本质上是创建一个 `script` 标签（type='module'），然后将其插入到 `head` 中，这样客户端在解析 `html` 是就可以执行代码了。

- `import { debounce } from 'lodash'` 导入一个命名函数时候，并不是只下载包含这个函数的文件，而是有一个依赖图，一共发送了651个请求。`Vite` 为了优化这个情况，利用 `esbuild` 在启动的时候预先把 `debounce` 用到的所有内部模块全部打包成一个`bundle`，这样就浏览器在请求 `debounce` 时，便只需要发送一次请求了

- 当 `Vite` 遇到一个 .vue 后缀的文件时。由于 .vue 模板文件的特殊性，它被拆分成 `template`, `css`, `script` 模块三个模块进行分别处理。最后会对 `script`, `template`, `css` 发送多个请求获取。`App.vue?type=template` 获取 template, `App.vue?type=style` 获取 style。
