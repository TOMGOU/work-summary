# React Native

## 跨端解决方案(react-reconciler)
- ios / adr
- pc --> react-native-web
- wx --> remax

## rn 知识点
- svg vs iconfont
- png jpg jpeg webp 
- dpr/ppi/inch
- 数据状态管理：vuex/redux/mobx/dva
- iPhonex 适配
- 依赖包的版本锁定问题: 固定版本最好

```js
{
  "react": "15.2.1", // 固定版本
  "react": "~15.2.1", // 15.2.*
  "react": "^15.2.1", // 15.*
}
```