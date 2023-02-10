# REM 应用

## rem 的定义

这个单位代表根元素的 font-size 大小。当用在根元素的 font-size 上面时，它代表了它的初始值。- MDN

## 移动端 rem 原理

使用 rem 单位适配的本质就是把 rem 单位当做一个百分比单位，进行元素的等比缩放。

手机的屏幕宽度是 320px，设计稿的宽度是 750px，假设设计稿的跟字体大小是：100px。

320 / 750 = x / 100 => document.documentElement.style.fontSize = 100 * 320 / 750

这样，手机的屏幕宽度就是：7.5rem。

## pc 端也能使用 rem

```js
<script>
  !function(window){
    // 基准大小
    const baseSize = 100
    // 设置 rem 函数
    function setRem () {
      // 当前页面宽度相对于 1920 宽的缩放比例，可根据自己需要修改。
      const scale = document.documentElement.clientWidth / 1920
      // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
      document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
    }
    // 初始化
    setRem()
    // 改变窗口大小时重新设置 rem
    window.onresize = function () {
      setRem()
    }
  }(window);
</script>
```
