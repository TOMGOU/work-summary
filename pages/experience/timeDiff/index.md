# android 与 ios 时间上的区别

## 区别

- adroid：时间一般以 YYYY - MM - DD hh:mm:ss 显示，年月日以横线分隔

- ios：时间以 YYYY/MM/DD hh:mm:ss 显示，年月日以斜线分隔

## 兼容处理

```js
const finishTime = '2022-12-12 12:12:12'
if (new Date(finishTime.replace(/-/g, '/')).getTime() <= new Date().getTime()) {
  ...
}
```