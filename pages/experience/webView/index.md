# 微信小程序与第三方应用跳转问题

> 微信小程序存在衔接第三方应用的场景，例如：由第三方E签宝提供的在线签合同服务，我们需要从小程序跳转到第三方E签宝应用，签完合同后，再跳转回小程序。

## web-view

> 承载网页的容器。会自动铺满整个小程序页面，个人类型的小程序暂不支持使用。

> https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
  <script>
    wx.miniProgram.navigateTo({url: '/pages/login/application'})
  </script>
</body>
</html>
```