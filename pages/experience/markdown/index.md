# vue 如何解析 markdown

## vue-markdown-loader

```js
const MarkdownItContainer = require('markdown-it-container')

module.exports = {
  parallel: false,
  chainWebpack: config => {

    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .options({
        compilerOptions: {
          preserveWhitespace: false
        }
      })
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      // .options({
      //   raw: true
      // })
      .options({
        raw: true,
        preprocess: (MarkdownIt, source) => {
          MarkdownIt.renderer.rules.table_open = function () {
            return '<table class="table-test">'
          }
          // MarkdownIt.renderer.rules.fence = handleFence(MarkdownIt.renderer.rules.fence)
          const render = MarkdownIt.renderer.rules.fence
          MarkdownIt.renderer.rules.fence = function (...args) {
            // console.log({ html: render(...args) })
            const newSource = render(...args).replace('<pre v-pre>', '<pre class="hljs">')
            return newSource
          }
          return source
        },
        use: [
          [
            MarkdownItContainer, 'demo', {
 
              validate: function(params) {
                // console.log({ params, bool: params.trim().match(/^demo\s+(.*)$/) })
                return params.trim().match(/^demo\s+(.*)$/);
              },
             
              render: function (tokens, idx) {
                var m = tokens[idx].info.trim().match(/^demo\s+(.*)$/);
                console.log({  con: tokens[idx], m })
             
                if (tokens[idx].nesting === 1) {
                  // opening tag
                  return '<details><summary>' + m[1] + '</summary>\n';
             
                } else {
                  // closing tag
                  return '</details>\n';
                }
              }
            }
          ]
        ]
      })
  }
}
```

## 路由配置: 把 md 文件当做 vue 文件即可

```js
import { createRouter, createWebHistory } from 'vue-router';

console.log({ createRouter, createWebHistory })

const router = createRouter({
  history: createWebHistory('/'),
  routes: [{
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "index" */ '../components/index.md'),
  }]
});

// 路由守护
export default router;
```

## markdown 文档解析的本质

> 与 babel 解析 JavaScript 类似，不同的地方是：babel 是先将 JavaScript 转化为 ast，处理完后还要转化为 JavaScript 代码，而 markdown-it 是直接将 md 文件转成 html `文件，例如：# test` 转换成 `<h1>test</h1>`。所以没必要用 ast，而是更加简单的 Tokens，本质是一个数组。

> markdown-it：https://markdown-it.github.io/

> 主要流程：markdown -> Tokens -> html

  - Parse：将 Markdown 文件 Parse 为 Tokens

  - Render：遍历 Tokens 生成 HTML

#### vue-markdown-loader options 说明：

- preprocess: 预处理函数，主要目的是为转换后的 html 标签添加各种属性: class

  * 参数 MarkdownIt, MarkdownIt.renderer.rules 可以访问将 Tokens 生成 HTML 的 Render 函数。可以通过直接改写 MarkdownIt.renderer.rules 函数，或者执行 MarkdownIt.renderer.rules 函数得到结果后再进行处理。
  
  * 参数 source, 源码

- use: 使用各种自定义的插件，目的是新增 html 标签, 比如用自定义的组件包裹代码来实现显示隐藏的功能。

  * markdown-it-container 可以将 md 文件中的 `::: spoiler click me\n*content*\n:::`替换成你想要的任何内容。
    - npm 地址：https://www.npmjs.com/package/markdown-it-container

    - 参数: validate - optional, function to validate tail after opening marker, should return true on success.
    - 参数: render - optional, renderer function for opening/closing tokens.
    - 参数: marker - optional (:), character to use in delimiter.
