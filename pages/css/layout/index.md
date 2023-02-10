### 三栏布局的方案
- 浮动
- 绝对定位
- flex布局
- 百分比布局
- calc 布局
- 网格布局（grid布局）

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
    * {
        margin: 0px;
        padding: 0px;
    }
    .left {
        background-color: aqua;
    }

    .main {
        background-color: brown;
    }

    .right {
        background-color: aquamarine;
    }

    .container {
        display: grid;
        grid-template-columns: 100px auto 200px;
        grid-template-rows: 700px;
    }
</style>
<body>
    <div class="container">
        <div class="left">Left</div>
        <div class="main">Main</div>
        <div class="right">Right</div>
    </div>
</body>
</html>

```

- table布局

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
    * {
        margin: 0px;
        padding: 0px;
        height: 700px;
    }

    .left {
        width: 100px;
        background-color: aqua;
        display: table-cell;
    }

    .main {
        background-color: brown;
        display: table-cell;
    }

    .right {
        width: 200px;
        background-color: aquamarine;
        display: table-cell;
    }

    .container {
        display: table;
        width: 100%;
    }
</style>

<body>
    <div class="container">
        <div class="left">Left</div>
        <div class="main">Main</div>
        <div class="right">Right</div>
    </div>

</body>

</html>

```

### 垂直居中的方法

- 方案一：verticle-align: middle;

```css
.child {
  display: inline-block; /* verticle-align 前提 */
  verticle-align: middle;
}
```

- 方案二：line-height 与 height 相等;

```css
.child {
  height：100px;
  line-height: 100px;
}
```

- 方案三：display:flex；

```css
.parent {
  display: flex;
  align-items: center; 
}
```

- 方案四：transform: translateY(-50%);

```css
.parent {
  position: relative;
}

.child {
  display: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```

- 方案五：display: table-cell;

```css
.parent {
  display: table;
}

.child {
  display: table-cell;
}
```