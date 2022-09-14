# iPhoneX 适配问题（微信小程序）

### 问题描述

> 通过 wx.getSystemInfoSync().model 判断机型，设置全局变量 isIpX, 然后页面通过获取全局变量 isIpX 区分样式。

> 随着苹果手机新机型的发布，我们需要不断添加新机型判断，由于目前拍卖小程序还没有添加 iPhone 11和12 机型，所有适配效果在这些手机上失效。

```js
const res = wx.getSystemInfoSync()
const model = res.model
if (model.includes('iPhone X') || model.includes('iPhone 11 Pro') || model === 'unknown') {
  this.globalData.isIpX = true
}
```

### env(safe-area-inset-bottom) 问题

> env(safe-area-inset-bottom) 默认边距太大，无法与设计保持一致，不美观。

```css
padding-bottom: env(safe-area-inset-bottom);
```

### 第一次尝试

> 失败：iPhoneX 手机 ❌ 普通手机 ✅ 

> 普通手机上面，env(safe-area-inset-bottom， -30rpx) 无效

> [MDN文档地址](https://developer.mozilla.org/en-US/docs/Web/CSS/env)

```css
.entrust-entry {
  padding-bottom: 10rpx;
  margin-bottom: env(safe-area-inset-bottom， -30rpx);
}
```

### 第二次尝试

> 失败：iPhoneX 手机 ✅ 普通手机 ❌

> 普通手机上面，calc(env(safe-area-inset-bottom) - 30rpx) 为 -30rpx

```css
.entrust-entry {
  padding-bottom: 10rpx;
  margin-bottom: calc(env(safe-area-inset-bottom) - 30rpx);
}
```

### 第三次尝试

> 失败：iPhoneX 手机 ❌ 普通手机 ✅ 

> when (env(safe-area-inset-bottom) > 0) 判断失效

```less
.inset () when (env(safe-area-inset-bottom) > 0){
  margin-bottom: calc(env(safe-area-inset-bottom) - 30rpx);
}

.entrust-entry {
  padding-bottom: 10rpx;
  .inset()
}
```

### 第四次尝试

> 失败：iPhoneX 手机 ❌ 普通手机 ✅ 

> @supports (margin-bottom: env(safe-area-inset-bottom)) 判断失效

```less
.entrust-entry {
  padding-bottom: 10rpx;
  @supports (margin-bottom: env(safe-area-inset-bottom)) {
    margin-bottom: calc(env(safe-area-inset-bottom) - 30rpx);
  }
}
```

### 最佳解决方案（新项目）

> 成功：iPhoneX 手机 ✅ 普通手机 ✅ 

> 关键点： padding 不能为负数

```css
.entrust-entry {
  margin-bottom: 10rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) - 30rpx);
}
```

### 改动最少修改方案（旧项目）

> 成功：iPhoneX 手机 ✅ 普通手机 ✅ 

> 关键点： 通过 res.screenHeight > res.safeArea.bottom 判断需要适配的机型，不用添加新机型

```js
const res = wx.getSystemInfoSync()
const model = res.model
if (res.screenHeight > res.safeArea.bottom || model === 'unknown') {
  this.globalData.isIpX = true
}
```