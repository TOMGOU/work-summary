# miniprogram-ci

> miniprogram-ci 是从微信开发者工具中抽离的关于小程序/小游戏项目代码的编译模块。

> 开发者可不打开小程序开发者工具，独立使用 miniprogram-ci 进行小程序代码的上传、预览等操作。 

> 文档地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html

## 使用步骤

> step-1: 密钥及 IP 白名单配置

【微信公众平台-开发-开发设置-下载代码上传密钥-配置 IP 白名单】=> 公网 IP

> step-2: 脚本调用

```js
npm install miniprogram-ci --save
```

> step-3: 代码编写

```js
const ci = require('miniprogram-ci')
const path = require('path')

const project = new ci.Project({
  appid: 'wxc53b8fcb9acdd6c7',
  type: 'miniProgram',
  projectPath: path.resolve(__dirname, './stock_forecast_calculator_cloud'),
  privateKeyPath: path.resolve(__dirname, './private.key'),
  ignores: ['node_modules/**/*'],
})

const upload = async () => {
  const uploadResult = await ci.upload({
    project,
    version: '1.4.19',
    desc: 'update',
    setting: {
      es6: true,
    },
    onProgressUpdate: () => {},
    robot: Math.ceil(Math.random() * 29 + 1)
  })
}

upload()
```

## 结合 gulp 使用，动态传入描述内容

> gulp upload --desc=test

```js
const ci = require('miniprogram-ci')
const path = require('path')
const argv = require('yargs').argv

const { desc } = argv

const project = new ci.Project({
  appid: 'wxc53b8fcb9acdd6c7',
  type: 'miniProgram',
  projectPath: path.resolve(__dirname, './stock_forecast_calculator_cloud'),
  privateKeyPath: path.resolve(__dirname, './private.key'),
  ignores: ['node_modules/**/*'],
})

const upload = async () => {
  const uploadResult = await ci.upload({
    project,
    version: '1.4.19',
    desc,
    setting: {
      es6: true,
    },
    onProgressUpdate: () => {},
    robot: Math.ceil(Math.random() * 29 + 1)
  })
}

exports.upload = upload
```