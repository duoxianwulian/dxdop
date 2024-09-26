<p align="right">
    <a href="./README.md">English</a>| <b>中文</b>
</p>


# Label （标签）

## 概述

标签是用来显示文本的基本对象类型.


### 坐标

坐标设置是基于父元素的相对位置，参数1为X轴，参数2为Y轴
```js
label.setPos(50, 130)
```

### 尺寸

尺寸设置参数1为元素宽度，参数2为高度.

```js
label.setSize(50, 130)
```

如果控件尺寸小于内容，会根据设置类型更换显示方式：
- "WRAP": 文本长的时候换行，
- "DOT": 文本长的时候用...替代，
- "SCROLL": 文本长的时候自动滚动，
- "SCROLL_CIRCULAR": 文本长的时候循环滚动，
- "CLIP": 文本长的时候自动截断

```js
// 设置自动换行
label.longMode(ui.Utils.LABEL_LONG_MODE.WRAP)
```

如果想要设置固定换行需要用\n
```js
// 设置文本内容
label2.text("line1\nline2\n\nline4")
```

## 样式
按钮样式适用于框架内提供的样式集，具体查看 style

## 事件
标签不发送特殊事件.


## 代码示例

![alt text](label.png)

```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js"

// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 1 }, context);

// 创建屏幕
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

// 创建样式集合
let labelStyle = ui.Style.build()
// 向集合添加属性
labelStyle.radius(10)
labelStyle.bgOpa(100)
labelStyle.bgColor(0x2196F3)

// 创建文本控件
let label2 = ui.Label.build(mainView.id + 'label2', mainView)
// 设置文本内容
label2.text("LONG_PRESSED")
// 元素基于父元素上下左右居中
label2.align(ui.Utils.ALIGN.CENTER, 0, 0)
// 创建字体
let font_24 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 24, ui.Utils.FONT_STYLE.ITALIC | ui.Utils.FONT_STYLE.BOLD)
// 设置文本字体
label2.textFont(font_24)
// 加载屏幕
ui.loadMain(mainView)
```