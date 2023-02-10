# 国际化方案

## 方案一： i18N + cnchar

#### i18N 配置

> vue3.0 + vue-i18n@next

###### step-1: 下载最新vue-i18n@next【vue-il8n下载的il8n版本是无法支持vue3.0】

```js
npm install vue-i18n@next -D
```

###### step-2: 国际化语言配置

```js
import { createI18n } from 'vue-i18n'
const i18n = createI18n({
  locale: 'ch',		//默认显示的语言 
  messages: {
    ch: require('./ch.js'),	//引入语言文件
    en: require('./en.js')
  }
})
export default i18n;
```

###### step-3: 修改main.js

```js
import { createApp } from 'vue'
import App from './App.vue'
import VueI18n from './language'

createApp(App).use(VueI18n).mount('#app')
```

###### step-4: i18n 的基本使用

```html
<template>
  <div>
    <HelloWorld :msg="$t('header_menu.logout')"/>
  </div>
</template>
```

###### step-5: i18n 语言切换

```js
import { getCurrentInstance } from "vue";

export default {
  name: "App",
  setup() {
    const { proxy } = getCurrentInstance();
    function change(type) {
      proxy.$i18n.locale = type;
    }
    return { change };
  }
};
```

#### cnchar: 接口数据翻译

```js
const cnchar = require('cnchar')
const trad = require('cnchar-trad')

cnchar.use(trad)

const simpleText = '汉字'
const tradText = 'english'

// 简体转繁体
console.log(cnchar.convert.simpleToTrad(simpleText))
console.log(simpleText.convertSimpleToTrad())

// ajax 请求拦截器
function interceptSuccess(res) {
  const { statusCode, config, data } = res

  // 200 至 300 或 304：请求成功
  if (validateStatus(statusCode)) {
    if (__LNG_TYPE__ === 'hk') {
      return JSON.parse(cnchar.convert.simpleToTrad(JSON.stringify(data)))
    }
    return data
  }

  // 401：登录态无效
  if (statusCode === 401) {
    return handle401(config, data)
  }

  // 其他：非 4xx 状态码重试请求
  if (!/^4\d{2}/.test(statusCode)) {
    const [needRetry, request] = retry(config)
    if (needRetry) {
      return request
    }
  }

  // 异常提示信息
  let message = '网络异常'
  if (statusCode === 400) message = '客户端异常'
  if (statusCode === 404) message = '请求链接未找到'
  if (/^5\d{2}/.test(statusCode)) message = '服务器繁忙'

  return { code: -1, message }
}
```

## 方案二：Translate【plugin / loader】

> webpack plugin 

```js
const cnchar = require('cnchar')
const trad = require('cnchar-trad')
cnchar.use(trad)

module.exports = class SimpleToTrad {

  // 插件配置的参数
  constructor(option = {}) {
    this.option = option;
  }

  // 固定的
  apply(compiler) {
    compiler.hooks.emit.tap('simpleToTrad', compilation => {
      const assets = compilation.getAssets();
      for (const file of assets) {
        if (/\.js$/.test(file.name)) {
          const { source } = compilation.getAsset(file.name)
          
          let newSource = ''
          newSource = cnchar.convert.simpleToTrad(source.source())
          const optionKeys = Object.keys(this.option)
          optionKeys.length && optionKeys.forEach(key => {
            newSource = newSource.replace(new RegExp(key, 'g'), this.option[key])
          })

          compilation.assets[file.name] = {
            source: function () {
              return newSource;
            },
            size: function () {
              return newSource.length
            }
          }
        }
      }
    })
  }
}
```

> loader 的方式

```js
module.exports = {
  chainWebpack(config) {
    config.module
      .rule('language')
      .test(/\.(js|vue)$/)
      .use('language-hk-loader')
      .loader('language-hk-loader')
      .end()
  }
}
```

> gulp plugin

```js
const through = require('through2')
const PluginError = require('plugin-error')
const cnchar = require('cnchar')
const trad = require('cnchar-trad')
cnchar.use(trad)

module.exports = function(opt) {
  let options = opt || {}

  function simple2trad(file, encoding, callback) {
    if (file.isNull()) {
      this.push(file)
      return callback()
    }

    if (file.isStream()) {
      this.emit('end')
      return new callback(PluginError('gulp-simple2trad', 'Streaming not supported:' + file.path))
    }

    let newSource = ''
    newSource = cnchar.convert.simpleToTrad(file.contents.toString())
    const optionKeys = Object.keys(options)
    optionKeys.length && optionKeys.forEach(key => {
      newSource = newSource.replace(new RegExp(key, 'g'), options[key])
    })
    file.contents = Buffer.from(newSource)
    this.push(file)

    callback()
  }

  return through.obj(simple2trad)
}
```
