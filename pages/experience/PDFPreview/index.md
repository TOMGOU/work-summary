# 微信小程序预览 PDF 文件

## 方案一： web-view 直接展示 PDF 内容

> 使用场景：pdf 文件为非机密文件，可以直接从 CDN 读取文件。

```html
<template>
  <view class="contract">
    <Navigate :title="navTitle"></Navigate>
    <web-view src="https://g.lxstatic.com/dos/ucma/dev/demo.pdf"></web-view>
  </view>
</template>
```

## 方案二：wx.openDocument 利用手机自带的第三方应用打开 PDF 文件

> 使用场景：pdf 文件为机密文件，文件存储地址不能随意暴露，需要经过后台接口读取文件，然后直接把文件内容返回给前端。

> 由于是机密文件，接口往往有权限控制，需要设置请求头。

```js
wx.downloadFile({
  url: 'https://g.lxstatic.com/dos/ucma/dev/demo.pdf',
  header: {
    'access-token': wx.getStorageSync('access_token')
  },
  success (res) {
    if (res.statusCode === 200) {
      wx.openDocument({
        filePath: res.tempFilePath,
        success: function (res) {
          console.log('打开文档成功')
        }
      })
    }
  }
})
```

> 这种方式打开的 pdf 文件标题是源文件的名称，非常不美观。

> 为了解决 title 不美观的问题，需要通过 filePath 对文件重命名

> wx.env.USER_DATA_PATH: http://usr【文件系统中的用户目录路径 (本地路径)】

```js
// 查看我的合同
handleContract() {
  const filePath = `${wx.env.USER_DATA_PATH}/我的合同.pdf`
  wx.downloadFile({
    url: `${appConfig.baseUrl}/my/esign_contract?application_id=${this.applicationId}`,
    header: {
      'access-token': wx.getStorageSync('access_token')
    },
    filePath,
    success (res) {
      if (res.statusCode === 200) {
        wx.openDocument({
          filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    },
    fail (res) {
      wx.showToast({
        icon: 'none',
        title: '打开文档失败'
      })
    }
  })
}
```
