## 微信小程序 radio 样式

> radio 样式使用了两张图片

> 点击文字无法切换状态

```html
<view>
  <block wx:if="{{ cdnUrl }}">
    <image
      wx:if="{{ isComfirm }}"
      class="fixed-buy__check"
      src="{{ '/assets/svg/checked.svg' }}"
      @tap="handleSwitchCoupon"
    />
    <image
      wx:else
      class="fixed-buy__check"
      src="{{ '/assets/svg/unchecked.svg' }}"
      @tap="handleSwitchCoupon"
    />
  </block>
  {{i18N.readAndAgree}}<text class="fixed-buy__protocol-link" @tap="handleShowProtocol">{{i18N.fixedPriceProtocol}}</text>
</view>
```

## 纯 css 样式 ✅ 

```html
<view>
  <radio
    checked="{{isComfirm}}"
    value="{{isComfirm}}"
    @tap="handleSwitchCoupon"
    color="#989EA9"
    class="quote-enter__radio"
  >
    {{i18N.readAndAgree}}<text class="fixed-buy__protocol-link" @tap="handleShowProtocol">{{i18N.fixedPriceProtocol}}</text>
  </radio>
</view>
```

```less
.quote-enter{
  &__radio {
    color: #666666;
    .wx-radio-input {
      height: 25rpx;
      width: 25rpx;
      border: none;
      // background: #d2d2d2;
      border: 2rpx solid #d2d2d2;
    }
    .wx-radio-input.wx-radio-input-checked {
      border: 2rpx solid #ffdf7f;
    }
    .wx-radio-input.wx-radio-input-checked::before {
      border-radius: 50%; /* 圆角 */
      width: 25rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
      height: 25rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
      line-height: 25rpx;
      text-align: center;
      font-size: 20rpx; /* 对勾大小 30rpx */
      color: #fff; /* 对勾颜色 白色 */
      background: #ffdf7f;
      border: 2rpx solid #ffdf7f;
      transform: translate(-50%, -50%) scale(1);
      -webkit-transform: translate(-50%, -50%) scale(1);
    }
  }
}
```