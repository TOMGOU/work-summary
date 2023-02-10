## fullScreen 全屏事件切换

> 进入全屏模式： Element.requestFullscreen(options)

> 退出全屏模式： Element.exitFullscreen(options)

> mounted 的时候，绑定全屏监听事件：window.addEventListener("fullscreenchange", () => {})

> destroyed 的时候，解除全屏监听事件：window.removeEventListener("fullscreenchange", () => {})

```js
mounted () {
  // 绑定全屏监听事件
  window.addEventListener('fullscreenchange', e => {
    this.handleScreenChange()
  })
}

destroyed () {
  // 解除全屏监听事件
  window.removeEventListener('fullscreenchange', e => {
    this.handleScreenChange()
  })
}

/**
* 页面全屏事件
*/
handleFullScreen () {
  if (!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)) {
    const video = document.documentElement as any;
    const rfs = video.requestFullscreen || video.webkitRequestFullScreen || video.mozRequestFullScreen || video.msRequestFullscreen;
    rfs.call(video);
  } else {
    const rfs = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
    rfs.call(document);
  }
}

/**
* 全屏监听函数
*/
handleScreenChange () {
  const isFullscreen = !(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
  if (isFullscreen) {
    // 退出全屏
    this.toggleNavCrumb(false)
  } else {
    // 全屏显示
    this.toggleNavCrumb(true)
  }
}

/**
* 切换导航栏和面包屑的显示隐藏
*/
toggleNavCrumb (bool) {
  this.updateNav(bool)
  this.hideCrumb(bool)
}
```

## 需要注意的细节点

- fullscreenchange 的监听有浏览器兼容问题，可以直接将 toggleNavCrumb 放到 handleFullScreen 里面。

- 页面全屏事件，只能用户手动出发，不发自动全屏。类似声音和视频的自动播放。