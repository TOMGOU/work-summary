# 静默登录实现（PC 端）

> 原因：BI 报表大屏展示的过程中，用户登录态过期，导致需要重新扫码登录，用户体验极差。

## 思路

> 新增 refresh_token 比原来的 access_token 的有效期长，当 access_token 过期的时候，可以拿有效期更长的 refresh_token，重新自动登录。

## 难点 

- 初步流程：页面发送请求 -> 登录态过期 -> refresh_token 重新登录 -> 更新 access_token -> 刷新页面 location.reload()

### 如何做到用户无感知静默登录？

- 不调用 location.reload()，不刷新页面

- 优化流程：页面发送请求 -> 登录态过期 -> Promise 缓存请求 -> refresh_token 重新登录 -> 更新 access_token -> 重新发送请求

## Promise 缓存请求核心代码

```ts
// 处理时机：axios 拦截器
let retryTasks = [];
const responseErrorInterceptor = (ctx: typeof ajax) => (err) => {
  const { response } = err;
  if (response) {
    const { status } = response;
    switch (status) {
      case 401: // 用户没有登录态
        // !!! 利用 Promise 缓存请求
        new Promise(resolve  => retryTasks.push(() => resolve(axios(response.config))))
        return ajax.$rest.global.getRefreshToken().then(res => {
          if (res.code === 4001) {
            // refresh_token 也过期，跳转登录页，此函数内容省略
            openNoneLogin(ctx);
          }
          if (res.code === 0) {
            cache.setLocalStorageData('access_token', res.data.access_token);
            cache.setLocalStorageData('refresh_token', res.data.refresh_token);
            // 静默登录后重新发起请求，调用 Promise 的 resolve
            retryTasks.forEach(fn => fn())
            // location.reload()
            retryTasks = []
          }
        });
        break;
      default:
        ctx.showTips(`error:${err.response.status}`);
        break;
    }
    const res = normalizeRes(err.response);
    // return Promise.reject(res.data); // 返回接口返回的错误信息
    return res;
  }
  return null;
};
```

## 需要注意的细节点

- refresh_token 接口的参数不要使用 query 传递，不安全，直接放 headers 里面。

- 手动登出的时候，需要清空本地 localStorage 里面的 refresh_token，避免无法切换登录用户。

- 首次扫码登录成功，将 refresh_token 存储到 localStorage 后，需要删除 url 上面的 refresh_token，避免暴露关键信息。
