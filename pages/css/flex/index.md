# flex布局单行多个元素最后一行左对齐问题

> 业务开发过程中，经常会碰到单行多个元素的布局，并且元素个数不确定。

> 碰到这种情况，我们会使用 float 布局，或者 justify-content: flex-start 布局，中间间距无法自动分配。

## 解决方案

### 单行3个元素原理说明

- 当最后一行有一个元素的时候，本身就是对齐的。

- 当最后一行有两个元素的时候，加上新添加的带宽度的隐形占位元素，正好凑足3各元素，完美对齐。

- 当最后一行有三个元素的时候，由于新添加的隐形占位元素没有高度，不影响原来的布局。

- 单行4个元素，只需要添加两个隐形占位元素即可，只是不能使用伪类了，原理相同。

### 单行3个元素

```html
<div class="box">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
  <div class="item">7</div>
  <!-- <div class="item">8</div> -->
  <!-- <div class="item">9</div>
  <div class="item">10</div> -->
</div>
```

```css
/* 单行3个元素 */
.box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.box:after {
  content: '';
  width: 30%;
}

.item {
  width: 24%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: red;
  margin-top: 10px;
}
```

### 单行4个元素

```html
<div class="box">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
  <div class="item">7</div>
  <!-- <div class="item">8</div> -->
  <!-- <div class="item">9</div>
  <div class="item">10</div> -->
  <div class="add"></div>
  <div class="add"></div>
</div>
```

```css
/* 单行4个元素 */
.box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.item {
  width: 24%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: red;
  margin-top: 10px;
}

.add {
  width: 24%;
}
```