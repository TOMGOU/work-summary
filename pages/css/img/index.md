# 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来，对长边进行居中截取

### 1. 微信小程序(mode)

```html
<image style="width: 670px; height: 320px;" mode="aspectFill" src="***"></image>
```

### 2. 非小程序(object-fit)

```
// html
<img src="***" />
// css
img {
  width: 100%;
  height: calc(100vw * 32 / 67 );
  object-fit: cover;
}
```

### 3. 自定义(clip-path)

```
// html
<img src="***" />
// css
width: 670rpx;
height: 320rpx;
clip-path: polygon(0 91rpx, 670rpx 91rpx, 670rpx 411rpx, 0 411rpx);
margin-top: -91.5rpx;
```

# 缩放模式，保持纵横比缩放图片，允许长边留白毛玻璃效果（filter: blur(10px)）

```css
width: 411rpx;
height: 294rpx;
filter: blur(10px);
transform: scale(1.2);
overflow: hidden;
```