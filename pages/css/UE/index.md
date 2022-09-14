# 如何提升用户体验？

### 1.移动端添加选中激活样式

```css
.xxx:active {
  background-color: #ECECEC;
}
```

### 2. 通过伪类加大可点击区域

```css
#btn::before {
  content: "";
  position: absolute;
  top: -20px;
  right: -20px;
  bottom: -20px;
  left: -20px;
}
```

### 3. 平滑滚动

```css
.scroll-view{
  sroll-behavior: smooth
}
```

### 4. 选择所有文本

```css
.test {
  user-select: all
}
```

### 5. PC 端显示鼠标指针，让用户感知这个地方是可以点击的

```css
.box {
  cursor: pointer
}
```

### 6. 超出省略号显示

```css
.text {
  overflow: hidden; // 超出的文本隐藏
  text-overflow: ellipsis; // 溢出用省略号显示
  white-space: nowrap; // 溢出不换行
  word-break: break-all;
}
```

### 7. 图片自适应

```css
img {
  width: 128px;
  height: 128px;
  object-fit: cover;
}
```

### 8. 无图片展示

```html
<img src="https://miro.medium.com/xxx.jpg" alt='fireworks picture' onerror="this.classList.add('error');">
```

```css
img.error {
  display: inline-block;
  transform: scale(1);
  content: '';
  color: transparent;
}
img.error::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #f5f5f5 url('https://cdn-images-1.medium.com/max/1600/1*we8wfyztsdo12e2Cww6oVA.jpeg') no-repeat center / 100% 100%;
}

```

### 9. 通过阴影来弱化背景

```css
.wrap{
  margin: 0 auto;
  width: 200px;
  height: 100px;
  box-shadow: 0 0 0 50vmax rgba(0, 0, 0, .8);
}
```

### 10. 页面自适应

```css
html {
    font-size: 16px;
}
@media screen and (min-width: 375px) {
    html {
        /* iPhone6的375px尺寸作为16px基准，414px正好18px大小, 600 20px */
        font-size: calc(100% + 2 * (100vw - 375px) / 39);
        font-size: calc(16px + 2 * (100vw - 375px) / 39);
    }
}
@media screen and (min-width: 414px) {
    html {
        /* 414px-1000px每100像素宽字体增加1px(18px-22px) */
        font-size: calc(112.5% + 4 * (100vw - 414px) / 586);
        font-size: calc(18px + 4 * (100vw - 414px) / 586);
    }
}
@media screen and (min-width: 600px) {
    html {
        /* 600px-1000px每100像素宽字体增加1px(20px-24px) */
        font-size: calc(125% + 4 * (100vw - 600px) / 400);
        font-size: calc(20px + 4 * (100vw - 600px) / 400);
    }
}
@media screen and (min-width: 1000px) {
    html {
        /* 1000px往后是每100像素0.5px增加 */
        font-size: calc(137.5% + 6 * (100vw - 1000px) / 1000);
        font-size: calc(22px + 6 * (100vw - 1000px) / 1000);
    }
}

/* 也可以分开写成多个 css 文件 */
@import "../../assets/styles/modules/operate/screenloadverticle" screen and (orientation:portrait);
@import "../../assets/styles/modules/operate/screenloadhorizontal" screen and (orientation:landscape);

```
