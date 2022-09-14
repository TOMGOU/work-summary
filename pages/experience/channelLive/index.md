# 小程序跳转视频号主页和直播页面

> 文档地址： API - 开放接口 - 视频号

- openChannelsUserProfile: 跳转视频号主页

- getChannelsLiveInfo: 获取直播信息

- openChannelsLive: 跳转直播页面

## 代码示例

```html
<div class="auction-session-menu">
  <div @tap="handleJumpVideoChannel" class="auction-session-menu__item">跳转视频号</div>
  <div @tap="handleJumpVideoLive" class="auction-session-menu__item">跳转直播间</div>
</div>
```

```js
handleJumpVideoChannel() {
  wx.openChannelsUserProfile({
    finderUserName: 'sphFavmZFOsxVZ2',
    success(res) {
      console.log({ res })
    },
    fail(err) {
      console.log({ err })
    }
  })
}
handleJumpVideoLive() {
  wx.getChannelsLiveInfo({
    finderUserName: 'sphFavmZFOsxVZ2',
    success(res) {
      console.log({ res })
      wx.openChannelsLive({
        finderUserName: 'sphFavmZFOsxVZ2',
        feedId: res.feedId,
        nonceId: res.nonceId,
        success(res1) {
          console.log({ res1 })
        },
        fail(err1) {
          console.log({ err1 })
        }
      })
    },
    fail(err) {
      console.log({ err })
    }
  })
}
```
