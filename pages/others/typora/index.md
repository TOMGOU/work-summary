# Typora 破解

## step-1: 找到 Typora.app 目录

```
code /Applications/Typora.app/Contents/Resources/TypeMark/
```

## step-2: 找到 LicenseIndex 文件

```
https://store.typora.io/ => LicenseIndex
```

## step-3: 修改 hasActivated 状态为 true

```
(e.hasActivated = "true" == e.hasActivated) => (e.hasActivated = "true" == "true")
```

## step-4: 自动关闭弹窗（随便找个合适的位置）

```
window.Setting.close();
```

还不完美，后面继续摸索。。。
