### position: fixed占位
父元素指定高度，子元素不指定top值，整块保持原位置不变，后续元素文档流布局，可避免繁琐的页面高度计算问题。
#### 应用场景
顶部输入框元素固定（下面有个动态展示的指示栏），中间下拉列表内容，底部按钮元素固定
#### 实际项目例子
```
// html代码
<div class="car-list__search-box">
  <search-input
    class="car-list__search-input"
    :placeholder="placeholder"
    :search-types="searchTypes"
    :default-type="defaultType"
    :value.sync="searchValue"
    :isPickerType="true"
    @cancel="handleCancel"
    @confirm="handleSearchConfirm"
    @toggle-type="handleToggleSearchType"
  >
  </search-input>
</div>

// css代码
.car-list {
  overflow-x: hidden;

  &__search-box {
    width: 100%;
    height: 120rpx;
  }

  &__search-input {
    position: fixed;
    z-index: 1;
    left: 0;
    width: 100%;
  }
}
```
