# issue-1

## 版本

1.8.3

## tapd 地址

https://www.tapd.cn/20094861/bugtrace/bugs/view?bug_id=1120094861001007864&url_cache_key=9b1f1a5337cb7a2d86b2f33c22ba0337

## 复现步骤

1. 打开拍卖小程序，进入拍卖大厅
2. 点击拍卖中场次，进入场次详情
3. 点击拍卖中车辆，进入车辆详情

## 期望的结果

出价动效顺畅

## 实际发生

出价动效卡顿

------------------------
## 其他
* 引入版本： 1.8.3车辆详情改版，添加动画
* 具体原因：position设置的是DOM的样式，实现动画效果同时消耗CPU和内存，在性能不好的安卓手机上，会有很严重的卡顿
* 解决方案：absolute -> transform3d
 transform 使用的是显卡，性能开销低
* 反思：排版、定位使用position，动画效果使用transform


# issue-2

## 版本

1.3.22

## tapd 地址 

https://www.tapd.cn/20094861/bugtrace/bugs/view/1120094861001006897?corpid=ww4a62ce5c2c07b235&agentid=1000007&code=YrZx7Dn_4nvGxeqNW2PT0hl_K1itqP3L9zIROivTBqw&state=TAPD_QY_WECHAT

## 复现步骤
 1. 打开拍卖小程序竞拍大厅
 2. 点击开拍场次
 3. 点击正在拍卖的拍卖车辆

## 期望的结果
 去出价按钮可点击

## 实际发生
  去出价按钮不可点击

------------------------
## 其他
* 引入版本： 委托报价版本 1.3.22
* 具体原因： 添加委托报价功能时，只修改了websocket，没有修改之前的轮询，用户网络状态不好，请求use_socket接口超时，依然走的轮询方式
* 解决方案： 在轮询中，修改去出价按钮状态
* 反思： 做需求的时候，没有整体走一遍流程，只关注需求相关业务

# issue-3

## 企业微信版本
  3.0.20

## tapd 地址
 https://www.tapd.cn/20094861/bugtrace/bugs/view?bug_id=1120094861001007394&url_cache_key=d567be72e43d651e68d3f9037b1cc8a1

## 手机型号
 华为p20

## 复现步骤（部分安卓手机才会复现问题）
 车辆管理 -> 零售微店 -> 展示中（辆）-> 分享 -> 确定生成 -> 保存图片

## 期望的结果
 微店分享卡片保存相册成功

## 实际发生
 微店分享卡片保存相册失败，并且没有打开图片保存权限提示

------------------------
## 其他
* 具体原因： 未授权err.errMsg有两种情况，saveImageToPhotosAlbum:fail:auth denied和saveImageToPhotosAlbum:fail auth deny
而我们的判断是，err.errMsg.includes('saveImageToPhotosAlbum:fail auth')
* 解决方案： 权限判断改为：err.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' || err.errMsg === 'saveImageToPhotosAlbum:fail auth deny'
