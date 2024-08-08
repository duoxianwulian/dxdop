<p align="right">
    <a href="./README.md">English</a>| <b>中文</b>
</p>


# List（列表）

## 概述

列表基本上是一个垂直布局的矩形，按钮指向该矩形和可以添加文本。


## Parts and Styles（部件和样式）

列表可以分为文本列表和菜单列表。文本用于展示，菜单可以发送点击事件。

### Button（按钮）

addBtn(src, text)：添加一个带有图标的全角按钮

- src是图像或符号

- text是文本

如果文本太长，文本将开始水平滚动。

### Texts（文本）

addText(text)：添加文本。

## 事件

列表本身不会发送任何特殊事件，但菜单列表会像其他控件一样由按钮发送事件。

## 代码示例

![alt text](list.png)

```js
import ui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import log from '../dxmodules/dxLogger.js';

// ui上下文
let context = {}

// ui初始化
ui.init({ orientation: 0 }, context);

// 创建屏幕
let mainView = ui.View.build('mainView', ui.Utils.LAYER.MAIN)

let list = ui.List.build(mainView.id + 'list', mainView)
list.setPos(400, 200)
list.setSize(100, 150)
let btn123 = list.addBtn(null, "123")
list.addBtn(null, "456")
list.addBtn(null, "789")
list.addBtn(null, "000")
// 创建字体
let font_24 = ui.Font.build('/app/code/resource/font/AlibabaPuHuiTi-2-65-Medium.ttf', 24, ui.Utils.FONT_STYLE.ITALIC | ui.Utils.FONT_STYLE.BOLD)

list.textFont(font_24)

btn123.on(ui.Utils.EVENT.CLICK, () => {
    log.info(list.getBtnText(btn123))
})

// 加载屏幕
ui.loadMain(mainView)
```

